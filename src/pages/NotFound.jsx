import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black-primary flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-text-secondary mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-text-primary mb-4">Page Not Found</h2>
        <p className="text-text-muted mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button variant="primary">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
