export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[80vh] bg-gradient-to-b from-black to-gray-900 text-white px-6">
      <span className="bg-blue-600 px-4 py-1 rounded-full text-sm mb-6">
        🚀 Bem-vindo ao FlowTwo
      </span>

      <h1 className="text-6xl font-extrabold max-w-4xl">
        Desenvolvendo o futuro
        <span className="text-blue-500"> uma linha de código </span>
        por vez.
      </h1>

      <p className="text-gray-400 text-xl mt-6 max-w-2xl">
        Uma plataforma moderna construída com Next.js, React e TypeScript,
        focada em performance, organização e escalabilidade.
      </p>

      <div className="flex gap-4 mt-10">
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition">
          Começar Agora
        </button>

        <button className="border border-gray-600 hover:border-blue-500 px-8 py-4 rounded-xl transition">
          Saiba Mais
        </button>
      </div>
    </section>
  );
}