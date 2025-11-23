// src/pacients/layout/PacientLayout.tsx
const PacientLayout = ({
  title,
  children,
  onNavigate,
  activeView,
}: PacientLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <PacientSidebar onNavigate={onNavigate} activeView={activeView} />

      {/* ml-16 = mesma largura da sidebar, sem espaço extra */}
      <main className="ml-16 flex-1 flex flex-col">
        {/* px-6 -> px-4 pra aproximar do lado esquerdo */}
        <header className="h-16 border-b border-border flex items-center px-4">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>

        {/* p-6 -> px-4 py-6: menos padding horizontal, igual vertical */}
        <section className="flex-1 px-4 py-6 overflow-auto">
          {children}
        </section>
      </main>
    </div>
  );
};
