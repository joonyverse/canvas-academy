export interface Example {
  id: string;
  title: string;
  description: string;
  category: string;
  code: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
  parentId?: string;
  isOpen?: boolean;
}

export interface Project {
  id: string;
  name: string;
  files: FileItem[];
  activeFileId: string | null;
}