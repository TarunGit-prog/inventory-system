import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function Home() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <h1>Welcome to the Inventory Management System</h1>
      <div>
        <button onClick={toggleForm}>
          {isLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </div>
      <div>
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

export default Home;
