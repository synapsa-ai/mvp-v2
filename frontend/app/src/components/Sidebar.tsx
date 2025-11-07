import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: "home", label: "Home", path: "/home" },
  { icon: "mic", label: "AI Voice", path: "/ai-voice" },
  { icon: "calendar_month", label: "Schedule", path: "/schedule" },
  { icon: "payments", label: "Finance", path: "/finance" },
  { icon: "clinical_notes", label: "Hub", path: "/medical-record" },
  { icon: "chat", label: "Chat", path: "/chat" },
  { icon: "person", label: "Doctor Profile", path: "/doctor-profile" },
  { icon: "settings", label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  return (
    <aside className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 gap-4 fixed left-0 top-0 h-screen z-50">
      <div className="mb-4">
        <h1 className="text-2xl font-heading font-bold gradient-primary bg-clip-text text-transparent">S</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "w-14 h-14 flex items-center justify-center rounded-xl transition-smooth group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <span className="material-symbols-rounded text-2xl">
              {item.icon}
            </span>
            <div className="absolute left-full ml-4 px-3 py-2 bg-card rounded-lg shadow-elevated opacity-0 group-hover:opacity-100 pointer-events-none transition-smooth whitespace-nowrap">
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
