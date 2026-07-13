export default function Features() {
  const features = [
    {
      title: "Alta Performance",
      description: "Aplicações rápidas utilizando Next.js e React.",
      icon: "⚡",
    },
    {
      title: "Código Organizado",
      description: "Estrutura escalável usando TypeScript e componentes.",
      icon: "💻",
    },
    {
      title: "Design Moderno",
      description: "Interfaces bonitas, responsivas e intuitivas.",
      icon: "🎨",
    },
  ];

  return (
    <section className="bg-gray-950 text-white py-24 px-8">
      <h2 className="text-4xl font-bold text-center mb-12">
        Nossos Diferenciais
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((item) => (
          <div
            key={item.title}
            className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
          >
            <div className="text-5xl mb-5">{item.icon}</div>

            <h3 className="text-2xl font-bold mb-3">
              {item.title}
            </h3>

            <p className="text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
