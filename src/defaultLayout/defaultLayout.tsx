import Footer from "../components/Footer/footer";
import Header from "../components/Header/header";
import Content from "../components/content/content";
import Sidebar from "../components/Sidebar/sideBar";




const DefaultLayout = (props:{children : React.ReactNode}) => {



  return (
    <>
    <div className="wrapper">
      <Sidebar />
      <div className="right-container">
        <Header />
        <div className="views">
          <Content />
        </div>
        <Footer />
      </div>
    </div>
    </>
  );
};

export default DefaultLayout;
