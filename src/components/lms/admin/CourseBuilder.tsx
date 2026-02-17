'use client';

import { useState, useCallback } from 'react';
import { 
  Course, 
  Module, 
  Lesson, 
  EditorJSContent,
  CourseDifficulty 
} from '@/types/lms';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronRight,
  Eye,
  Edit,
  Lock,
  Unlock,
  Settings,
  Save,
  X,
  FolderOpen,
  FileText,
  Video,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

// Dynamic import for Editor to avoid SSR issues
const Editor = dynamic(() => import('@/components/editor/Editor'), { 
  ssr: false,
  loading: () => (
    <div className="h-96 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
  )
});

interface CourseBuilderProps {
  course?: Course;
  onSave: (course: Partial<Course>) => Promise<void>;
  onCancel: () => void;
}

/**
 * Course Builder - Admin Interface for creating/editing courses
 */
export function CourseBuilder({ course, onSave, onCancel }: CourseBuilderProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'structure' | 'content'>('settings');
  const [isSaving, setIsSaving] = useState(false);
  
  // Course settings state
  const [title, setTitle] = useState(course?.title || '');
  const [slug, setSlug] = useState(course?.slug || '');
  const [description, setDescription] = useState(course?.description || '');
  const [shortDescription, setShortDescription] = useState(course?.shortDescription || '');
  const [coverImage, setCoverImage] = useState(course?.coverImage || '');
  const [difficulty, setDifficulty] = useState<CourseDifficulty>(course?.difficulty || 'beginner');
  const [category, setCategory] = useState(course?.category || '');
  const [tags, setTags] = useState<string[]>(course?.tags || []);
  const [estimatedDuration, setEstimatedDuration] = useState(course?.estimatedDuration || 60);
  const [isFree, setIsFree] = useState(course?.isFree ?? true);
  const [price, setPrice] = useState(course?.price || 0);
  const [isPublished, setIsPublished] = useState(course?.isPublished || false);
  const [isFeatured, setIsFeatured] = useState(course?.isFeatured || false);
  const [certificateEnabled, setCertificateEnabled] = useState(course?.certificateEnabled || false);
  
  // Module/Lesson structure
  const [modules, setModules] = useState<Module[]>(course?.modules || []);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  
  // Current editing lesson
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonContent, setLessonContent] = useState<EditorJSContent | null>(null);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave({
        title,
        slug,
        description,
        shortDescription,
        coverImage,
        difficulty,
        category,
        tags,
        estimatedDuration,
        isFree,
        price,
        isPublished,
        isFeatured,
        certificateEnabled,
        modules,
      });
    } finally {
      setIsSaving(false);
    }
  }, [title, slug, description, shortDescription, coverImage, difficulty, category, tags, estimatedDuration, isFree, price, isPublished, isFeatured, certificateEnabled, modules, onSave]);

  const addModule = useCallback(() => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      courseId: course?.id || '',
      title: `Module ${modules.length + 1}`,
      description: '',
      order: modules.length,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lessons: [],
    };
    setModules([...modules, newModule]);
    setExpandedModules(new Set([...expandedModules, newModule.id]));
  }, [modules, expandedModules, course?.id]);

  const addLesson = useCallback((moduleId: string) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      moduleId,
      courseId: course?.id || '',
      title: `Lesson ${(modules[moduleIndex].lessons?.length || 0) + 1}`,
      description: '',
      content: { time: Date.now(), version: '2.0', blocks: [] },
      order: modules[moduleIndex].lessons?.length || 0,
      duration: 10,
      xpReward: 10,
      difficulty: 'beginner',
      isFree: false,
      isPublished: false,
      createdBy: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedModules = [...modules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      lessons: [...(updatedModules[moduleIndex].lessons || []), newLesson],
    };
    setModules(updatedModules);
  }, [modules, course?.id]);

  const toggleModule = useCallback((moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  }, [expandedModules]);

  const deleteModule = useCallback((moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  }, [modules]);

  const deleteLesson = useCallback((moduleId: string, lessonId: string) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const updatedModules = [...modules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      lessons: updatedModules[moduleIndex].lessons?.filter(l => l.id !== lessonId) || [],
    };
    setModules(updatedModules);
  }, [modules]);

  const editLesson = useCallback((lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonContent(lesson.content);
    setActiveTab('content');
  }, []);

  const saveLesson = useCallback(() => {
    if (!editingLesson) return;
    
    const moduleIndex = modules.findIndex(m => m.id === editingLesson.moduleId);
    if (moduleIndex === -1) return;
    
    const updatedModules = [...modules];
    const lessonIndex = updatedModules[moduleIndex].lessons?.findIndex(l => l.id === editingLesson.id);
    if (lessonIndex === -1) return;
    
    updatedModules[moduleIndex].lessons![lessonIndex] = {
      ...editingLesson,
      content: lessonContent || editingLesson.content,
      updatedAt: new Date(),
    };
    setModules(updatedModules);
    setEditingLesson(null);
  }, [editingLesson, lessonContent, modules]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div>
          <h1 className="text-xl font-bold">
            {course ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-sm text-zinc-500">
            {course ? `Editing: ${course.title}` : 'Add a new course to your LMS'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Course'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
        {[
          { id: 'settings', label: 'Course Settings', icon: Settings },
          { id: 'structure', label: 'Course Structure', icon: FolderOpen },
          { id: 'content', label: 'Lesson Content', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={clsx(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-white dark:bg-zinc-900 text-blue-600 border-b-2 border-blue-600'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-zinc-50 dark:bg-zinc-950">
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 className="font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Course Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    placeholder="e.g., Introduction to Moroccan Darija"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    placeholder="e.g., intro-moroccan-darija"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    placeholder="A brief summary (displayed in cards)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    placeholder="Detailed course description"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 className="font-semibold mb-4">Media</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    placeholder="https://..."
                  />
                  {coverImage && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-100">
                      <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 className="font-semibold mb-4">Course Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as CourseDifficulty)}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    placeholder="e.g., Language, Grammar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Duration (min)</label>
                  <input
                    type="number"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <input
                    type="text"
                    value={tags.join(', ')}
                    onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                    placeholder="comma, separated, tags"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 className="font-semibold mb-4">Pricing & Access</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-medium">Free Course</span>
                </label>
                {!isFree && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (USD)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Publishing */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 className="font-semibold mb-4">Publishing</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-medium">Published</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-medium">Featured Course</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={certificateEnabled}
                    onChange={(e) => setCertificateEnabled(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-medium">Enable Certificate on Completion</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Course Structure</h3>
              <button
                onClick={addModule}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                <FolderOpen className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
                <p className="text-zinc-500 mb-4">No modules yet</p>
                <button
                  onClick={addModule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Module
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {modules.map((module, moduleIndex) => (
                  <div
                    key={module.id}
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                  >
                    {/* Module Header */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-zinc-400 cursor-grab" />
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="w-5 h-5 text-zinc-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-zinc-500" />
                        )}
                        <div>
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-sm text-zinc-500">
                            {module.lessons?.length || 0} lessons
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addLesson(module.id);
                          }}
                          className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteModule(module.id);
                          }}
                          className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons */}
                    {expandedModules.has(module.id) && module.lessons && module.lessons.length > 0 && (
                      <div className="border-t border-zinc-200 dark:border-zinc-700">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-4 pl-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-zinc-400" />
                              <div>
                                <p className="font-medium">{lesson.title}</p>
                                <p className="text-xs text-zinc-500">
                                  {lesson.duration} min • {lesson.xpReward} XP
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => editLesson(lesson)}
                                className="p-2 text-zinc-500 hover:text-blue-600 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteLesson(module.id, lesson.id)}
                                className="p-2 text-zinc-500 hover:text-red-600 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="max-w-4xl">
            {editingLesson ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Editing: {editingLesson.title}</h3>
                    <p className="text-sm text-zinc-500">Use the editor below to create lesson content</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingLesson(null)}
                      className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveLesson}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4" />
                      Save Lesson
                    </button>
                  </div>
                </div>

                {/* Lesson metadata */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={editingLesson.title}
                        onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration (min)</label>
                      <input
                        type="number"
                        value={editingLesson.duration}
                        onChange={(e) => setEditingLesson({ ...editingLesson, duration: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">XP Reward</label>
                      <input
                        type="number"
                        value={editingLesson.xpReward}
                        onChange={(e) => setEditingLesson({ ...editingLesson, xpReward: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                  <Editor
                    data={lessonContent || editingLesson.content}
                    onChange={(data) => setLessonContent(data)}
                    config={{
                      placeholder: 'Start creating your lesson content...',
                      autosave: {
                        enabled: true,
                        interval: 30000,
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
                <p className="text-zinc-500 mb-4">Select a lesson from the Structure tab to edit its content</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseBuilder;
