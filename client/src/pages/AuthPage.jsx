// client/src/pages/AuthPage.jsx
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';

// Takes a prop 'type' to determine which form to display
const AuthPage = ({ type }) => {
  return (
    <div className="flex items-center justify-center p-10">
      {type === 'register' ? <RegisterForm /> : <LoginForm />}
    </div>
  );
};

export default AuthPage;