import Navbar from "./navbar";
import Footer from "./footer";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="p-3">{children}</main>
      <Footer />
    </div>
  );
}
