import Header from "./layout/header/Header";

export default function Layout({ children }) {
  return (
  <div className="layout">
    <Header></Header>
    {children}</div>);
}
