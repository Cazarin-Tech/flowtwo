export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-10 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">FlowTwo</h2>
          <p className="mt-2">Construindo soluções modernas com Next.js.</p>
        </div>

        <div className="flex gap-6 mt-6 md:mt-0">
          <a href="#" className="hover:text-white transition">
            GitHub
          </a>
          <a href="#" className="hover:text-white transition">
            LinkedIn
          </a>
          <a href="#" className="hover:text-white transition">
            Contato
          </a>
        </div>
      </div>

      <p className="text-center mt-8 text-sm">
        © 2026 FlowTwo. Todos os direitos reservados.
      </p>
    </footer>
  );
}