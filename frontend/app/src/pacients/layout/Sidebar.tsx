// src/pacients/layout/Sidebar.tsx
const PacientSidebar = ({ onNavigate, activeView }: PacientSidebarProps) => {
  return (
    <aside className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 gap-4 fixed left-0 top-0 h-screen z-50">
      <div className="mb-6">
        <div className="h-10 w-10 rounded-2xl bg-card shadow-elevated flex items-center justify-center overflow-hidden">
          <img src="/images/favicon.svg" className="h-8 w-8" />
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = item.id === activeView;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`w-12 h-12 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth ${
                isActive ? "bg-muted text-foreground" : ""
              }`}
            >
              <span className="material-symbols-rounded text-2xl">
                {item.icon}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
