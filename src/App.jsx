import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import CreateLovePage from "./pages/CreateLovePage/CreateLovePage";
import PublicLovePage from "./pages/PublicLovePage/PublicLovePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/create" element={<CreateLovePage />} />

        <Route path="/love/:pageId" element={<PublicLovePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
