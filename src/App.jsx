import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CadastrarEscritorio from "./pages/CadastrarEscritorio";
import ListarCartorios from "./pages/ListarCartorios";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="cadastrar" element={<CadastrarEscritorio />} />
        <Route path="listar" element={<ListarCartorios />} />
      </Route>
    </Routes>
  );
}

export default App;
