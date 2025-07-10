import React, { useRef, useEffect, useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Copy, Check, Settings, Download, Upload, Maximize2, Minimize2, AlertTriangle, Save, Lightbulb, Zap, Map } from 'lucide-react';
import { validateAndSanitizeFile } from '../utils/fileValidation';
import { useProject } from '../contexts/ProjectContext';
import { canvasSnippets, canvasApiDocumentation } from '../utils/canvasSnippets';
import { CanvasCodeValidator, ValidationError } from '../utils/canvasValidation';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onRun, onReset }) => {
  const { saveActiveFile, hasUnsavedChanges, setHasUnsavedChanges, getActiveFile } = useProject()
  const [copied, setCopied] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [performanceSuggestions, setPerformanceSuggestions] = useState<string[]>([]);
  const [editorSettings, setEditorSettings] = React.useState({
    fontSize: 14,
    wordWrap: 'on' as 'on' | 'off',
    minimap: true,
    minimapShowSlider: 'always' as 'always' | 'mouseover',
    minimapRenderCharacters: true,
    minimapMaxColumn: 120,
    lineNumbers: 'on' as 'on' | 'off',
    theme: 'vs' as 'vs' | 'vs-dark' | 'hc-black'
  });
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!getActiveFile()) return;

    try {
      setIsSaving(true);
      await saveActiveFile(code);
    } catch (error) {
      console.error('Failed to save file:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Validate code in real-time
  const validateCode = useCallback((codeToValidate: string) => {
    const result = CanvasCodeValidator.validateCode(codeToValidate);
    setValidationErrors(result.errors);
    
    const suggestions = CanvasCodeValidator.getPerformanceSuggestions(codeToValidate);
    setPerformanceSuggestions(suggestions);
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    onChange(newCode);

    // Check if content has changed
    const activeFile = getActiveFile();
    if (activeFile && activeFile.content !== newCode) {
      setHasUnsavedChanges(true);
    }

    // Validate code in real-time
    validateCode(newCode);
  };

  // Initial validation when component mounts or code changes from outside
  useEffect(() => {
    validateCode(code);
  }, [code, validateCode]);

  // Handle Ctrl+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-code.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileRead = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const validation = await validateAndSanitizeFile(file, {
        maxSize: 100 * 1024, // 100KB
        allowedExtensions: ['.js', '.txt'],
        maxLines: 2000
      });

      if (!validation.isValid) {
        setUploadError(validation.error || 'File validation failed');
        return;
      }

      if (validation.sanitizedContent) {
        onChange(validation.sanitizedContent);

        // Show success message briefly
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }

    } catch (error) {
      setUploadError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Add custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
      onReset();
    });

    // Toggle minimap with Ctrl+M
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM, () => {
      updateEditorSettings('minimap', !editorSettings.minimap);
    });

    // Register Canvas snippets as completion items
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = canvasSnippets.map(snippet => ({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: {
            value: snippet.documentation,
            isTrusted: true
          },
          detail: snippet.detail,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          }
        }));

        // Add Canvas API methods with documentation
        const canvasApiSuggestions = Object.entries(canvasApiDocumentation).map(([method, info]) => {
          const parameters = info.parameters ? `(${info.parameters.join(', ')})` : '()';
          const documentation = [
            info.description,
            info.parameters && info.parameters.length > 0 ? `\n**Parameters:** ${info.parameters.join(', ')}` : '',
            info.returnType ? `\n**Returns:** ${info.returnType}` : '',
            info.example ? `\n\n**Example:**\n\`\`\`javascript\n${info.example}\n\`\`\`` : '',
            info.mdn ? `\n\n[📖 MDN Documentation](${info.mdn})` : ''
          ].filter(Boolean).join('');

          return {
            label: method,
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: method,
            documentation: {
              value: documentation,
              isTrusted: true
            },
            detail: `${info.returnType || 'void'} ${method}${parameters}`,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column
            }
          };
        });

        return {
          suggestions: [...suggestions, ...canvasApiSuggestions]
        };
      }
    });

    // Set up real-time diagnostics
    const updateMarkers = (code: string) => {
      const result = CanvasCodeValidator.validateCode(code);
      const markers = result.errors.map(error => ({
        startLineNumber: error.line,
        startColumn: error.column,
        endLineNumber: error.line,
        endColumn: error.column + 10,
        message: error.message,
        severity: error.severity === 'error' ? monaco.MarkerSeverity.Error :
                 error.severity === 'warning' ? monaco.MarkerSeverity.Warning :
                 monaco.MarkerSeverity.Info,
        source: error.source || 'canvas-validator'
      }));
      
      monaco.editor.setModelMarkers(editor.getModel(), 'canvas-validator', markers);
    };

    // Update markers on content change
    editor.onDidChangeModelContent(() => {
      updateMarkers(editor.getValue());
    });

    // Initial validation
    updateMarkers(code);

    // Add Canvas API autocompletion
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
      interface CanvasRenderingContext2D {
        fillRect(x: number, y: number, width: number, height: number): void;
        strokeRect(x: number, y: number, width: number, height: number): void;
        clearRect(x: number, y: number, width: number, height: number): void;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
        beginPath(): void;
        closePath(): void;
        fill(): void;
        stroke(): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        fillStyle: string | CanvasGradient | CanvasPattern;
        strokeStyle: string | CanvasGradient | CanvasPattern;
        lineWidth: number;
        font: string;
        textAlign: CanvasTextAlign;
        fillText(text: string, x: number, y: number, maxWidth?: number): void;
        strokeText(text: string, x: number, y: number, maxWidth?: number): void;
        save(): void;
        restore(): void;
        translate(x: number, y: number): void;
        rotate(angle: number): void;
        scale(x: number, y: number): void;
        createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
        createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
        globalAlpha: number;
        globalCompositeOperation: GlobalCompositeOperation;
      }
      
      declare const canvas: HTMLCanvasElement;
      declare const ctx: CanvasRenderingContext2D;
      declare function requestAnimationFrame(callback: FrameRequestCallback): number;
      declare function cancelAnimationFrame(handle: number): void;
    `, 'canvas-api.d.ts');

    // Configure JavaScript language features
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const updateEditorSettings = (key: string, value: any) => {
    setEditorSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-full'}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 h-12">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-bold font-mont tracking-wide flex items-center space-x-2">
            <span>Code</span>
            <span>Editor</span>
          </h3>
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-1 text-xs text-amber-600">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              <span>Unsaved</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors relative ${
              validationErrors.length > 0 ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title={`Diagnostics (${validationErrors.length} issues)`}
          >
            <AlertTriangle className="w-5 h-5" />
            {validationErrors.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {validationErrors.length > 9 ? '9+' : validationErrors.length}
              </span>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !getActiveFile()}
            className={`w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 ${hasUnsavedChanges ? 'border border-gray-400' : ''}`}
            title="Save (Ctrl+S)"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={() => updateEditorSettings('minimap', !editorSettings.minimap)}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
              editorSettings.minimap ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title={`${editorSettings.minimap ? 'Hide' : 'Show'} Minimap`}
          >
            <Map className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Upload File (.js, .txt - max 100KB)"
          >
            <Upload className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Download Code"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopy}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${copied ? 'text-green-600 bg-green-50 border border-green-400' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'}`}
            title="Copy"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onReset}
            className="w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Reset Code (Ctrl+R)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 bg-red-50 border-b border-red-200 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">File Upload Error</p>
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-red-600 hover:text-red-800 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      {showDiagnostics && (validationErrors.length > 0 || performanceSuggestions.length > 0) && (
        <div className="max-h-40 overflow-y-auto bg-gray-50 border-b border-gray-200">
          {validationErrors.length > 0 && (
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h4 className="text-sm font-medium text-gray-900">Code Issues ({validationErrors.length})</h4>
              </div>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs">
                    <span className={`px-1.5 py-0.5 rounded text-white text-xs ${
                      error.severity === 'error' ? 'bg-red-500' : 
                      error.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      {error.severity === 'error' ? 'ERR' : error.severity === 'warning' ? 'WARN' : 'INFO'}
                    </span>
                    <span className="text-gray-600">Line {error.line}:</span>
                    <span className="text-gray-800 flex-1">{error.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {performanceSuggestions.length > 0 && (
            <div className="p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <h4 className="text-sm font-medium text-gray-900">Performance Suggestions</h4>
              </div>
              <div className="space-y-1">
                {performanceSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs">
                    <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showSettings && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
              <select
                value={editorSettings.fontSize}
                onChange={(e) => updateEditorSettings('fontSize', parseInt(e.target.value))}
                className="w-full px-3 py-1 text-xs bg-white border border-gray-300 rounded-md text-gray-700 focus:border-gray-400 focus:outline-none"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
                <option value={20}>20px</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Theme</label>
              <select
                value={editorSettings.theme}
                onChange={(e) => updateEditorSettings('theme', e.target.value)}
                className="w-full px-3 py-1 text-xs bg-white border border-gray-300 rounded-md text-gray-700 focus:border-gray-400 focus:outline-none"
              >
                <option value="vs">Light</option>
                <option value="vs-dark">Dark</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Word Wrap</label>
              <select
                value={editorSettings.wordWrap}
                onChange={(e) => updateEditorSettings('wordWrap', e.target.value)}
                className="w-full px-3 py-1 text-xs bg-white border border-gray-300 rounded-md text-gray-700 focus:border-gray-400 focus:outline-none"
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Line Numbers</label>
              <select
                value={editorSettings.lineNumbers}
                onChange={(e) => updateEditorSettings('lineNumbers', e.target.value)}
                className="w-full px-3 py-1 text-xs bg-white border border-gray-300 rounded-md text-gray-700 focus:border-gray-400 focus:outline-none"
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Minimap</label>
              <select
                value={editorSettings.minimap ? 'on' : 'off'}
                onChange={(e) => updateEditorSettings('minimap', e.target.value === 'on')}
                className="w-full px-3 py-1 text-xs bg-white border border-gray-300 rounded-md text-gray-700 focus:border-gray-400 focus:outline-none"
              >
                <option value="off">Off</option>
                <option value="on">On</option>
              </select>
            </div>

            </div>

            {editorSettings.minimap && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Minimap Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Slider Display</label>
                    <select
                      value={editorSettings.minimapShowSlider}
                      onChange={(e) => updateEditorSettings('minimapShowSlider', e.target.value)}
                      className="w-full px-3 py-1 text-xs bg-white border border-gray-300 rounded-md text-gray-700 focus:border-gray-400 focus:outline-none"
                    >
                      <option value="always">Always Show</option>
                      <option value="mouseover">On Hover</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Render Mode</label>
                    <select
                      value={editorSettings.minimapRenderCharacters ? 'chars' : 'blocks'}
                      onChange={(e) => updateEditorSettings('minimapRenderCharacters', e.target.value === 'chars')}
                      className="w-full px-3 py-1 text-xs bg-white border border-gray-300 rounded-md text-gray-700 focus:border-gray-400 focus:outline-none"
                    >
                      <option value="blocks">Color Blocks</option>
                      <option value="chars">Text Characters</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme={editorSettings.theme}
          options={{
            minimap: { 
              enabled: editorSettings.minimap,
              showSlider: editorSettings.minimapShowSlider,
              renderCharacters: editorSettings.minimapRenderCharacters,
              maxColumn: editorSettings.minimapMaxColumn,
              scale: 1,
              side: 'right',
              size: 'proportional', // 'proportional' | 'fill' | 'fit'
              autohide: false // 항상 표시
            },
            scrollBeyondLastLine: true,
            padding: {
              top: 0,
              bottom: 80 // Increased bottom padding to prevent overlap with help text
            },
            fontSize: editorSettings.fontSize,
            fontFamily: 'Monaco, Menlo, "Courier New", monospace',
            wordWrap: editorSettings.wordWrap,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderLineHighlight: 'line',
            contextmenu: true,
            lineNumbers: editorSettings.lineNumbers,
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 2,
            // 미니맵과 함께 작동하는 overview ruler 설정
            rulers: [80, 120], // 코드 길이 가이드라인
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              // 미니맵이 켜져있을 때 스크롤바 조정
              handleMouseWheel: true,
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalSliderSize: 12,
              horizontalSliderSize: 12
            },
            // Advanced features
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showStructs: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showColors: true,
              showFiles: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showIssues: true,
              showUsers: true,
              showWords: true
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            },
            parameterHints: {
              enabled: true
            },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
            bracketPairColorization: {
              enabled: true
            },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            hover: {
              enabled: true
            }
          }}
          className="cursor-text"
        />

        {/* Keyboard shortcuts help - positioned to avoid overlap */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white bg-opacity-90 px-3 py-2 rounded-md shadow-lg max-w-md border border-gray-200 pointer-events-none backdrop-blur-sm z-10">
          <div className="space-y-0.5">
            <div>Ctrl+Enter: Run • Ctrl+R: Reset • Ctrl+M: Toggle Minimap</div>
            <div>Ctrl+Space: Snippets • Shift+Alt+F: Format</div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".js,.txt"
        onChange={handleFileRead}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default CodeEditor;