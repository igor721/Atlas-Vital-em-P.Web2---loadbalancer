import { useState, useEffect } from "react";
import { Edit, Trash2, Check, X } from "lucide-react";
import apiService from '../services/api';

export default function ListaCartorios() {
  const [cartorios, setCartorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ nome: "", email: "", cnpj: "" });

  useEffect(() => {
    const fetchCartorios = async () => {
      try {
        const data = await apiService.getCartorios();
        setCartorios(data);
      } catch (err) {
        console.error(err);
        alert("Falha ao carregar cartórios");
      } finally {
        setLoading(false);
      }
    };
    fetchCartorios();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cartório?")) return;
    try {
      await apiService.deleteCartorio(id);
      setCartorios(cartorios.filter((c) => c.id !== id));
      alert("Cartório excluído com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Falha ao excluir cartório.");
    }
  };

  const startEdit = (cartorio) => {
    setEditingId(cartorio.id);
    setEditData({ nome: cartorio.nome, email: cartorio.email, cnpj: cartorio.cnpj });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ nome: "", email: "", cnpj: "" });
  };

  const saveEdit = async (id) => {
    try {
      await apiService.updateCartorio(id, editData);
      setCartorios(cartorios.map(c => (c.id === id ? { ...c, ...editData } : c)));
      cancelEdit();
      alert("Cartório atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Falha ao atualizar cartório.");
    }
  };

  if (loading) return <p>Carregando cartórios...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Cartórios</h1>

      {cartorios.length === 0 ? (
        <p className="text-gray-500">Nenhum cartório cadastrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-center text-gray-700 font-semibold">ID</th>
                <th className="py-3 px-4 border-b text-center text-gray-700 font-semibold">Nome</th>
                <th className="py-3 px-4 border-b text-center text-gray-700 font-semibold">Email</th>
                <th className="py-3 px-4 border-b text-center text-gray-700 font-semibold">CNPJ</th>
                <th className="py-3 px-4 border-b text-center text-gray-700 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cartorios.map((c, index) => (
                <tr key={c.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-2 px-4 border-b text-center">{c.id}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {editingId === c.id ? (
                      <input
                        className="border rounded px-2 py-1 w-full text-center"
                        value={editData.nome}
                        onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                      />
                    ) : (
                      c.nome
                    )}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {editingId === c.id ? (
                      <input
                        className="border rounded px-2 py-1 w-full text-center"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      c.email
                    )}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {editingId === c.id ? (
                      <input
                        className="border rounded px-2 py-1 w-full text-center"
                        value={editData.cnpj}
                        onChange={(e) => setEditData({ ...editData, cnpj: e.target.value })}
                      />
                    ) : (
                      c.cnpj
                    )}
                  </td>
                  <td className="py-2 px-4 border-b text-center flex justify-center gap-2">
                    {editingId === c.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(c.id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(c)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
