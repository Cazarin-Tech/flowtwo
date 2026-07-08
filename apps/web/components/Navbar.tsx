export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-black text-white">
      <h1 className="text-2xl font-bold text-blue-500">
        FlowTwo
      </h1>

      <ul className="flex gap-8 text-gray-300">
        <li className="hover:text-white cursor-pointer">Home</li>
        <li className="hover:text-white cursor-pointer">Serviços</li>
        <li className="hover:text-white cursor-pointer">Sobre</li>
        <li className="hover:text-white cursor-pointer">Contato</li>
      </ul>

      <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition">
        Começar
      </button>
    </nav>
  );
}