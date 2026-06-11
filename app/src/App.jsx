import { Routes, Route } from "react-router-dom";
import RedirectPage from "./pages/RedirectPage";
import AboutUs from "./pages/AboutUs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:code" element={<RedirectPage />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
}
