import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../../lib/cn";
import { BookOpen, FileText, Home, Tags, Users } from "lucide-react";
import { BackToTopButton } from "../BackToTopButton";

const nav = [
  { to: "/", label: "Início", Icon: Home },
  { to: "/livros", label: "Livros", Icon: BookOpen },
  { to: "/autores", label: "Autores", Icon: Users },
  { to: "/assuntos", label: "Assuntos", Icon: Tags },
  { to: "/relatorio", label: "Relatório", Icon: FileText },
];

export function PageLayout() {
  return (
    <div className="min-h-dvh bg-bg">
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[216px_1fr] md:items-start md:px-6 lg:px-8">
        <aside className="flex flex-col overflow-hidden rounded-lg border border-border/70 bg-surface shadow-card md:sticky md:top-8 md:h-[calc(100dvh-4rem)]">
          <div className="border-b border-border/60 px-4 pt-5 pb-4">
            <p className="text-[15px] font-semibold tracking-tight text-text">Biblioteca</p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Cadastro de livros
            </p>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-auto px-2 py-3">
            {nav.map(({ Icon, ...item }) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-[13px] font-medium text-muted transition-colors duration-200 ease-out",
                    !isActive && "hover:bg-bg hover:text-text",
                    isActive && "bg-primary/10 text-primary font-semibold",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-transparent transition-all duration-200 ease-out",
                        isActive && "bg-primary",
                      )}
                    />
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors duration-200 ease-out",
                        isActive ? "text-primary" : "text-muted/80 group-hover:text-text",
                      )}
                      aria-hidden="true"
                    />
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
      <BackToTopButton />
    </div>
  );
}

