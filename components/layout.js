import Footer from "./layout/footer/Footer";
import Header from "./layout/header/Header";

export default function Layout({ children }) {
  return (
  <div className="layout">
    <Header/>
    {children}
    <Footer/>
  </div>
  );
}
