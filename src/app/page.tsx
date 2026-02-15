import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  FireIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Interactive Lessons',
    description: 'Learn Darija with structured lessons covering vocabulary, sentences, and practical exercises.',
    icon: BookOpenIcon,
  },
  {
    name: 'Vocabulary Flashcards',
    description: 'Master new words with spaced repetition flashcards designed for effective memorization.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Interactive Quizzes',
    description: 'Test your knowledge with various quiz types including multiple choice and fill-in-the-blank.',
    icon: FireIcon,
  },
  {
    name: 'Track Progress',
    description: 'Monitor your learning journey with XP, streaks, and detailed progress statistics.',
    icon: ChartBarIcon,
  },
];

const stats = [
  { label: 'Lessons Available', value: '20+' },
  { label: 'Vocabulary Words', value: '500+' },
  { label: 'Active Learners', value: '1,000+' },
  { label: 'Quizzes', value: '50+' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Learn Moroccan Darija
              <span className="block text-primary-300">the Fun Way</span>
            </h1>
            <p className="text-xl text-secondary-100 max-w-2xl mx-auto mb-8">
              Master conversational Moroccan Arabic with interactive lessons, 
              vocabulary flashcards, and engaging quizzes. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/lessons">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary-600 px-8">
                  Browse Lessons
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Learn Darija
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our comprehensive learning platform provides all the tools you need 
              to become fluent in Moroccan Arabic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.name} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 border-none">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-secondary-100 text-lg">
                  Join thousands of learners mastering Moroccan Darija every day.
                </p>
              </div>
              <Link href="/signup">
                <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <footer className="bg-white dark:bg-slate-800 py-12 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">د</span>
              </div>
              <span className="text-lg font-bold text-secondary-500">Darija Companion</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Darija Companion. Built with ❤️ for the Moroccan Arabic learning community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
