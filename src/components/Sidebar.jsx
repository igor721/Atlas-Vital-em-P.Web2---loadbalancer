import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, PlusSquare, FileText } from "lucide-react"; // 👈 adicionei ícone para listar cartórios

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <Home size={18} /> },
    { name: "Cadastrar Escritório", path: "/cadastrar", icon: <PlusSquare size={18} /> },
    { name: "Listar Cartórios", path: "/listar", icon: <FileText size={18} /> }, // 👈 novo item
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-green-600 to-green-800 text-white shadow-lg shadow-gray-700/30 h-screen p-4 flex flex-col relative z-10">
     
      <h2 className="text-2xl font-bold mb-8 tracking-wide">Atlas Vital</h2>

      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-green-500/30 border-l-4 border-white"
                    : "hover:bg-green-500/20"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      
      <div className="mt-auto text-sm text-gray-200 border-t border-gray-500/40 pt-4">
        © {new Date().getFullYear()} Atlas Vital
      </div>
    </aside>
  );
};

export default Sidebar;
