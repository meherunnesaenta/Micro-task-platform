import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Compass, Sparkles } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-card relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float-3d" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        {/* 404 Number with Gradient */}
        <div className="relative mb-6">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 animate-bounce-subtle">
            <Search size={32} className="text-primary/30" />
          </div>
        </div>

        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Compass size={48} className="text-primary" />
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-3">
          Oops! Page Not Found
        </h2>
        
        <p className="text-base-content/60 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved to another URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass-panel hover:glass-panel-dark transition-all duration-300 font-medium group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl btn-gradient font-medium group"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            Back to Home
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-base-content/40 mt-8 flex items-center justify-center gap-1">
          <Sparkles size={12} />
          Need help? Contact our support team
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes float3d {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float-3d {
          animation: float3d 6s ease-in-out infinite;
        }
        
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-bounce-subtle {
          animation: bounceSubtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;