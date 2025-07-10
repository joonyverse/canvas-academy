import { Example } from '../../types';

export const basicExamples: Example[] = [
  {
    id: 'basic-rectangle',
    title: 'Basic Rectangle',
    description: 'Draw a simple rectangle on the canvas',
    category: 'basics',
    difficulty: 'beginner',
    code: `// Get canvas and context
// Canvas and context are already available as 'canvas' and 'ctx'

// Set fill color
ctx.fillStyle = '#3498db';

// Draw a filled rectangle
ctx.fillRect(50, 50, 200, 100);

// Set stroke color and width
ctx.strokeStyle = '#2c3e50';
ctx.lineWidth = 3;

// Draw a rectangle outline
ctx.strokeRect(300, 50, 200, 100);`
  },
  {
    id: 'basic-circle',
    title: 'Basic Circle',
    description: 'Draw circles using arc method',
    category: 'basics',
    difficulty: 'beginner',
    code: `// Draw a filled circle
ctx.beginPath();
ctx.arc(150, 150, 50, 0, Math.PI * 2);
ctx.fillStyle = '#e74c3c';
ctx.fill();

// Draw a circle outline
ctx.beginPath();
ctx.arc(350, 150, 50, 0, Math.PI * 2);
ctx.strokeStyle = '#34495e';
ctx.lineWidth = 3;
ctx.stroke();

// Draw a semi-circle
ctx.beginPath();
ctx.arc(250, 300, 40, 0, Math.PI);
ctx.fillStyle = '#f39c12';
ctx.fill();`
  },
  {
    id: 'basic-lines',
    title: 'Drawing Lines',
    description: 'Learn to draw lines and paths',
    category: 'basics',
    difficulty: 'beginner',
    code: `// Draw a simple line
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(200, 100);
ctx.strokeStyle = '#3498db';
ctx.lineWidth = 2;
ctx.stroke();

// Draw a path with multiple lines
ctx.beginPath();
ctx.moveTo(250, 50);
ctx.lineTo(350, 100);
ctx.lineTo(300, 150);
ctx.lineTo(250, 100);
ctx.closePath();
ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 3;
ctx.stroke();

// Draw a curved line
ctx.beginPath();
ctx.moveTo(50, 200);
ctx.quadraticCurveTo(150, 150, 250, 200);
ctx.strokeStyle = '#27ae60';
ctx.lineWidth = 4;
ctx.stroke();`
  },
  {
    id: 'basic-text',
    title: 'Text Rendering',
    description: 'Add text to your canvas',
    category: 'basics',
    difficulty: 'beginner',
    code: `// Set font properties
ctx.font = '30px Arial';
ctx.fillStyle = '#2c3e50';
ctx.textAlign = 'center';

// Draw filled text
ctx.fillText('Hello Canvas!', canvas.width / 2, 100);

// Draw text outline
ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 2;
ctx.strokeText('Outlined Text', canvas.width / 2, 200);

// Different font and style
ctx.font = 'bold 24px Georgia';
ctx.fillStyle = '#27ae60';
ctx.textAlign = 'left';
ctx.fillText('Styled Text', 50, 300);

// Measure text width
const text = 'Measured Text';
const metrics = ctx.measureText(text);
ctx.fillStyle = '#f39c12';
ctx.fillText(text, 50, 400);
ctx.strokeStyle = '#d35400';
ctx.strokeRect(50, 375, metrics.width, 30);`
  }
];