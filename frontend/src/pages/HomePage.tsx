import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-in">
              AI Studio
            </h1>
            <p className="text-xl text-gray-600 mb-8 text-balance">
              Transform your fashion ideas into stunning images with our AI-powered generation studio.
              Upload your designs, add creative prompts, and watch the magic happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/studio"
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  Go to Studio
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="btn btn-primary text-lg px-8 py-3"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-secondary text-lg px-8 py-3"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Everything you need for creative fashion design
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Image Upload</h3>
                <p className="text-gray-600">
                  Upload your fashion designs with support for all major image formats. Intelligent processing ensures optimal results.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Creative Prompts</h3>
                <p className="text-gray-600">
                  Guide the AI with detailed text prompts and choose from various artistic styles to bring your vision to life.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
                <p className="text-gray-600">
                  Experience fast generation with real-time progress tracking. Your creations are ready in moments, not hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to create something amazing?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of designers using AI Studio to transform their creative ideas into reality.
            </p>
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="btn btn-primary text-lg px-8 py-3"
              >
                Start Creating Today
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}