import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { Keys } from "./pages/Keys";
import { Channels } from "./pages/Channels";
import { AiAssistant } from "./pages/AiAssistant";
import { Docs } from "./pages/Docs";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="keys" element={<Keys />} />
          <Route path="channels" element={<Channels />} />
          <Route path="ai" element={<AiAssistant />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        <Route path="/docs" element={<Layout />}>
          <Route index element={<Docs />} />
        </Route>
        
        {/* Fallback for other routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
