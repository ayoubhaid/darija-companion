'use client';

import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Copy, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  Type,
  HelpCircle,
  ListOrdered,
  Image
} from 'lucide-react';

interface LessonTemplate {
  id: string;
  name: string;
  description: string;
  components: TemplateComponent[];
  createdAt: string;
  usageCount: number;
}

interface TemplateComponent {
  type: 'flashcard' | 'quiz' | 'audio' | 'matching' | 'dialogue' | 'grammar' | 'reading' | 'video';
  label: string;
}

const defaultTemplates: LessonTemplate[] = [
  {
    id: '1',
    name: 'Vocabulary Introduction',
    description: 'Introduce new vocabulary with flashcards followed by a quiz',
    components: [
      { type: 'flashcard', label: 'Vocabulary Cards' },
      { type: 'quiz', label: 'Quick Check' },
    ],
    createdAt: '2024-01-15',
    usageCount: 45,
  },
  {
    id: '2',
    name: 'Dialogue Practice',
    description: 'Practice conversational phrases with audio and role-play',
    components: [
      { type: 'dialogue', label: 'Conversation' },
      { type: 'audio', label: 'Listen & Repeat' },
      { type: 'flashcard', label: 'Key Phrases' },
    ],
    createdAt: '2024-01-20',
    usageCount: 32,
  },
  {
    id: '3',
    name: 'Grammar Lesson',
    description: 'Explain grammar rules with examples and exercises',
    components: [
      { type: 'reading', label: 'Rule Explanation' },
      { type: 'flashcard', label: 'Examples' },
      { type: 'quiz', label: 'Practice' },
    ],
    createdAt: '2024-02-01',
    usageCount: 28,
  },
  {
    id: '4',
    name: 'Listening Comprehension',
    description: 'Audio-based listening exercises with comprehension questions',
    components: [
      { type: 'audio', label: 'Listen' },
      { type: 'quiz', label: 'Comprehension' },
      { type: 'matching', label: 'Vocabulary Match' },
    ],
    createdAt: '2024-02-10',
    usageCount: 19,
  },
];

const componentIcons: Record<string, typeof BookOpen> = {
  flashcard: BookOpen,
  quiz: HelpCircle,
  audio: FileText,
  matching: ListOrdered,
  dialogue: FileText,
  grammar: Type,
  reading: FileText,
  video: FileText,
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<LessonTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<LessonTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    const newTemplate: LessonTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      description: newTemplateDesc,
      components: [],
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
    };
    
    setTemplates([newTemplate, ...templates]);
    setNewTemplateName('');
    setNewTemplateDesc('');
    setShowCreateModal(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null);
    }
  };

  const handleDuplicateTemplate = (template: LessonTemplate) => {
    const duplicate: LessonTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
    };
    setTemplates([duplicate, ...templates]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>Lesson Templates</h1>
          <p style={{ fontSize: 13, color: '#5a6880' }}>Create reusable lesson structures</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#10b981', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} />
          New Template
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div style={{ background: '#0f1117', borderRadius: 12, padding: 16, border: '1px solid #1e2130' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff' }}>{templates.length}</div>
          <div style={{ fontSize: 12, color: '#5a6880' }}>Total Templates</div>
        </div>
        <div style={{ background: '#0f1117', borderRadius: 12, padding: 16, border: '1px solid #1e2130' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff' }}>{templates.reduce((a, t) => a + t.usageCount, 0)}</div>
          <div style={{ fontSize: 12, color: '#5a6880' }}>Total Usage</div>
        </div>
        <div style={{ background: '#0f1117', borderRadius: 12, padding: 16, border: '1px solid #1e2130' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff' }}>8</div>
          <div style={{ fontSize: 12, color: '#5a6880' }}>Component Types</div>
        </div>
        <div style={{ background: '#0f1117', borderRadius: 12, padding: 16, border: '1px solid #1e2130' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff' }}>4.2</div>
          <div style={{ fontSize: 12, color: '#5a6880' }}>Avg Components/Template</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Templates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {templates.map((template) => (
            <div 
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              style={{ 
                background: selectedTemplate?.id === template.id ? '#10b98115' : '#0f1117', 
                borderRadius: 12, 
                padding: 20, 
                border: `1px solid ${selectedTemplate?.id === template.id ? '#10b98140' : '#1e2130'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ff', marginBottom: 4 }}>{template.name}</h3>
                  <p style={{ fontSize: 12, color: '#5a6880' }}>{template.description}</p>
                </div>
              </div>
              
              {/* Component Preview */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {template.components.map((comp, i) => {
                  const Icon = componentIcons[comp.type] || FileText;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: '#1e2130', borderRadius: 6, fontSize: 11, color: '#8890a0' }}>
                      <Icon size={12} />
                      {comp.label}
                    </div>
                  );
                })}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#5a6880' }}>Used {template.usageCount} times</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDuplicateTemplate(template); }}
                    style={{ padding: 6, background: 'transparent', border: 'none', color: '#5a6880', cursor: 'pointer', borderRadius: 6 }}
                    title="Duplicate"
                  >
                    <Copy size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}
                    style={{ padding: 6, background: 'transparent', border: 'none', color: '#5a6880', cursor: 'pointer', borderRadius: 6 }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Template Detail Panel */}
        <div style={{ background: '#0f1117', borderRadius: 12, padding: 20, border: '1px solid #1e2130', height: 'fit-content' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ff', marginBottom: 16 }}>
            {selectedTemplate ? 'Template Details' : 'Select a Template'}
          </h3>
          
          {selectedTemplate ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: '#5a6880', display: 'block', marginBottom: 4 }}>Template Name</label>
                <input 
                  type="text" 
                  value={selectedTemplate.name}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#1e2130', border: '1px solid #2a2d3a', borderRadius: 8, color: '#f0f4ff', fontSize: 13 }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: 11, color: '#5a6880', display: 'block', marginBottom: 4 }}>Description</label>
                <textarea 
                  value={selectedTemplate.description}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, description: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', background: '#1e2130', border: '1px solid #2a2d3a', borderRadius: 8, color: '#f0f4ff', fontSize: 13, resize: 'none' }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: 11, color: '#5a6880', display: 'block', marginBottom: 8 }}>Components</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedTemplate.components.map((comp, i) => {
                    const Icon = componentIcons[comp.type] || FileText;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#1e2130', borderRadius: 8 }}>
                        <Icon size={14} style={{ color: '#10b981' }} />
                        <span style={{ flex: 1, fontSize: 13, color: '#f0f4ff' }}>{comp.label}</span>
                        <span style={{ fontSize: 11, color: '#5a6880', textTransform: 'capitalize' }}>{comp.type}</span>
                      </div>
                    );
                  })}
                  
                  <button 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', background: '#1e2130', border: '1px dashed #2a2d3a', borderRadius: 8, color: '#5a6880', fontSize: 12, cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                    Add Component
                  </button>
                </div>
              </div>
              
              <button style={{ padding: '10px 16px', background: '#10b981', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Use Template
              </button>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#5a6880', textAlign: 'center', padding: '20px 0' }}>
              Click on a template to view details and edit
            </p>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f1117', borderRadius: 16, padding: 24, width: 400, border: '1px solid #1e2130' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f0f4ff', marginBottom: 20 }}>Create New Template</h2>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#5a6880', display: 'block', marginBottom: 6 }}>Template Name</label>
              <input 
                type="text" 
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="e.g., Vocabulary Introduction"
                style={{ width: '100%', padding: '10px 12px', background: '#1e2130', border: '1px solid #2a2d3a', borderRadius: 8, color: '#f0f4ff', fontSize: 13 }}
              />
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#5a6880', display: 'block', marginBottom: 6 }}>Description</label>
              <textarea 
                value={newTemplateDesc}
                onChange={(e) => setNewTemplateDesc(e.target.value)}
                placeholder="Describe what this template is for..."
                rows={3}
                style={{ width: '100%', padding: '10px 12px', background: '#1e2130', border: '1px solid #2a2d3a', borderRadius: 8, color: '#f0f4ff', fontSize: 13, resize: 'none' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #1e2130', borderRadius: 8, color: '#8890a0', fontSize: 13, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTemplate}
                style={{ padding: '10px 16px', background: '#10b981', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
