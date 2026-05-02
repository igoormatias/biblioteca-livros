import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PageLayout } from "./components/PageLayout";
import { AssuntosPage, AutoresPage, HomePage, LivrosPage, RelatorioPage } from "./features";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/livros" element={<LivrosPage />} />
          <Route path="/autores" element={<AutoresPage />} />
          <Route path="/assuntos" element={<AssuntosPage />} />
          <Route path="/relatorio" element={<RelatorioPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
