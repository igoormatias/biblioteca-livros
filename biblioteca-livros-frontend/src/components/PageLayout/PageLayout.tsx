import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../../lib/cn";
import { BookOpen, FileText, Home, Tags, Users } from "lucide-react";

const nav = [
  { to: "/", label: "Início", Icon: Home },
  { to: "/livros", label: "Livros", Icon: BookOpen },
  { to: "/autores", label: "Autores", Icon: Users },
  { to: "/assuntos", label: "Assuntos", Icon: Tags },
  { to: "/relatorio", label: "Relatório", Icon: FileText },
];

export function PageLayout() {
  return (
    <div className="min-h-dvh bg-bg md:h-dvh">
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:items-start">
        <aside className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card md:sticky md:top-6 md:h-[calc(100dvh-3rem)]">
          <div className="border-b border-border px-5 py-4">
            <p className="text-lg font-semibold text-primary">Biblioteca</p>
            <p className="text-xs text-muted">Cadastro de livros</p>
          </div>
          <nav className="flex-1 overflow-auto p-2">
            {nav.map(({ Icon, ...item }) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-bg hover:text-text",
                    isActive && "bg-bg text-primary font-semibold",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-transparent",
                        isActive && "bg-primary",
                      )}
                    />
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

