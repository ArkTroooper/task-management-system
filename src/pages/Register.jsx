import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-black-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-accent rounded-lg items-center justify-center mb-4">
            <span className="text-black-primary font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold text-text-secondary mb-2">Task Manager</h1>
          <p className="text-text-muted">Create your account to get started</p>
        </div>

        {/* Register form card */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-text-secondary mb-6">Register</h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
