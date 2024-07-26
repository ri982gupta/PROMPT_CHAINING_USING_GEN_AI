import "./Footer.scss";
const Footer = () => {
  const current_year =  new Date().getFullYear();
  return (
    <div className="footerContainer">
      <p>&copy;  <span>{current_year}</span>  - Project Finance - All rights Reserved | Prolifics</p>
    </div>
  );
};

export default Footer;
