import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  FireIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Interactive Lessons',
    description: 'Structured lessons covering vocabulary, sentences, and practical exercises for all levels.',
    icon: BookOpenIcon,
    colSpan: 'md:col-span-2',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Smart Flashcards',
    description: 'Spaced repetition system for effective memorization and long-term retention.',
    icon: AcademicCapIcon,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Gamified Quizzes',
    description: 'Multiple quiz types with XP rewards and achievements to keep you motivated.',
    icon: FireIcon,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your journey with detailed stats, streaks, and personalized insights.',
    icon: ChartBarIcon,
    gradient: 'from-violet-500 to-purple-600',
  },
];

const stats = [
  { label: 'Lessons', value: '20+' },
  { label: 'Words', value: '500+' },
  { label: 'Learners', value: '1K+' },
  { label: 'Quizzes', value: '50+' },
];

const testimonials = [
  { name: 'Sarah M.', text: 'Finally learning Darija feels natural! The flashcards are genius.' },
  { name: 'Ahmed K.', text: 'Best app for Moroccan Arabic. Progressed faster than expected.' },
  { name: 'Lisa R.', text: 'Love the gamification. Makes learning feel like a game!' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-zinc-950">
        {/* Animated background */}
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
              <SparklesIcon className="w-4 h-4" />
              Start your Darija journey today
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight animate-fade-in-up">
              Master Moroccan Darija
              <span className="block mt-2 text-gradient">the Natural Way</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Interactive lessons, smart flashcards, and engaging quizzes designed to make learning conversational Moroccan Arabic effortless.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/signup">
                <Button size="lg" variant="glow" className="w-full sm:w-auto">
                  Start Learning Free
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/lessons">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Browse Lessons
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-8 mt-20 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              A complete platform built for modern language learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="interactive" 
                className={feature.colSpan}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Loved by Learners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="default" className="relative">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="font-semibold text-zinc-900 dark:text-white">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join thousands of learners mastering Moroccan Darija every day. It&apos;s free to start!
          </p>
          <Link href="/signup">
            <Button size="lg" variant="glow" className="px-10 py-4 text-lg">
              Create Free Account
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">د</span>
              </div>
              <span className="text-lg font-bold text-zinc-300">Darija Companion</span>
            </div>
            <p className="text-sm text-zinc-500">
              © 2024 Built for the Moroccan Arabic learning community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
