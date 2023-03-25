import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Editor from "../pages/Editor";
import SitePreview from "../pages/SitePreview";
import { AnimatePresence } from "framer-motion";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="editor" element={<Editor />} />
        <Route path="preview" element={<SitePreview />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
