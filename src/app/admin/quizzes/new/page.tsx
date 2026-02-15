'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuiz } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { Question } from '@/types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const questionTypes = ['multipleChoice', 'fillInTheBlank', 'matching', 'trueFalse'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

export default function NewQuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    xpReward: 20,
    passingScore: 70,
    questions: [] as Question[],
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      question: '',
      type: 'multipleChoice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 10,
      explanation: '',
    };
    setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...formData.questions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, questions: updated });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...formData.questions];
    if (updated[qIndex].options) {
      updated[qIndex].options![oIndex] = value;
    }
    setFormData({ ...formData, questions: updated });
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const quizData = {
        ...formData,
        type: 'mixed' as const,
        timeLimit: 300,
        isAdaptive: false,
        totalQuestions: formData.questions.length,
      };

      await createQuiz(quizData as any, user.uid, user.displayName || 'Admin');
      router.push('/admin/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/admin/quizzes" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Quiz</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Greetings Quiz"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Quiz description"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {difficulties.map(d => (
                        <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="XP Reward"
                    type="number"
                    value={formData.xpReward}
                    onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 20 })}
                  />
                  <Input
                    label="Passing Score %"
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 70 })}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Questions ({formData.questions.length})</h2>
                <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {formData.questions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No questions yet. Add one to get started.</p>
              ) : (
                <div className="space-y-6">
                  {formData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <span className="font-medium text-gray-700">Question {qIndex + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                            placeholder="Enter question"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={question.type}
                              onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              {questionTypes.map(t => (
                                <option key={t} value={t}>{t === 'multipleChoice' ? 'Multiple Choice' : t === 'fillInTheBlank' ? 'Fill in Blank' : t === 'trueFalse' ? 'True/False' : 'Matching'}</option>
                              ))}
                            </select>
                          </div>
                          <Input
                            label="Points"
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 10)}
                          />
                        </div>

                        {(question.type === 'multipleChoice' || question.type === 'trueFalse') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                            <div className="space-y-2">
                              {(question.type === 'trueFalse' 
                                ? ['True', 'False'] 
                                : (question.options || ['', '', '', ''])
                              ).map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={question.correctAnswer === option}
                                    onChange={() => updateQuestion(qIndex, 'correctAnswer', option)}
                                    className="mr-2"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => !question.type?.includes('trueFalse') && updateOption(qIndex, oIndex, e.target.value)}
                                    placeholder={question.type === 'trueFalse' ? option : `Option ${oIndex + 1}`}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    disabled={question.type === 'trueFalse'}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.type === 'fillInTheBlank' && (
                          <Input
                            label="Correct Answer"
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                            placeholder="The correct answer"
                          />
                        )}

                        <Input
                          label="Explanation"
                          value={question.explanation}
                          onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                          placeholder="Explain the correct answer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <div className="flex space-x-3">
                <Link href="/admin/quizzes" className="flex-1">
                  <Button variant="outline" type="button" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" loading={saving} className="flex-1">
                  <Save className="w-5 h-5 mr-2" />
                  Create
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
