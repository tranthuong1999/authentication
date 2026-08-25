import { useContext, useState } from "react";
import "./App.css";

import {
  AuthProvider,
  AuthContext,
} from "./context/AuthContext";

import { RegisterForm } from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import { getInitialAuthPage } from "./utils/googleAuth";

function App() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
}

function AuthContent() {
  const auth = useContext(AuthContext);

  const [page, setPage] = useState(getInitialAuthPage);

  if (!auth) {
    return null;
  }

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (auth.user) {
    return <Home />;
  }

  if (page === "login") {
    return (
      <div>
        <LoginForm />

        <button
          onClick={() => setPage("register")}
        >
          Create account
        </button>
      </div>
    );
  }

  return (
    <div>
      <RegisterForm />

      <button
        onClick={() => setPage("login")}
      >
        Already have an account?
      </button>
    </div>
  );
}

export default App;