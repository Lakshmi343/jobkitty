import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
  
      <div className="pt-10">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
