import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import '../styles/not-found.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1>404</h1>
          <p>Page Not Found</p>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <div className="not-found-actions">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              <ArrowLeft size={20} />
              Go to Dashboard
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              <Home size={20} />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
