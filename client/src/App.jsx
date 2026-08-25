import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";

import { AuthInitializer } from "./components/AuthInitializer";
import { AppRoutes } from "./routes/AppRoutes";

import "./styles/auth.css";

function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            className: "auth-toast",
          }}
        />
        <AppRoutes />
      </AuthInitializer>
    </BrowserRouter>
  );
}

export default App;
