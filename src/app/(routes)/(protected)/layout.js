import Footer from "@/app/(routes)/(protected)/_components/footer";
import Navbar from "@/app/(routes)/(protected)/_components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/navbar/nav-left/app-sidebar";

export default function ProtectedLayout({ children }) {
  return (
  <SidebarProvider>
  <AppSidebar />
  <div className="grid grid-rows-[min-content_1fr_min-content] min-h-full w-full gap-4">
      <header>
        <nav>
          <Navbar />
        </nav>
      </header>
      
      <main className="container mx-auto px-4">
        {children}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
    </SidebarProvider>
  );
}
