import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {/* ✅ Push content below the fixed navbar */}
      <div className="pt-10">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
