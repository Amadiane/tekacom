import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Logo = ({ scrolled }) => {
  return (
    <Link
      to="/"
      className="relative flex items-center z-10 -ml-16 lg:-ml-24"
    >
      {/* LOGO CONTAINER */}
      <div
        className={`
          relative overflow-hidden flex items-center justify-center
          transition-all duration-500 ease-in-out
          ${
            scrolled
              ? "w-64 h-16"
              : "w-[28rem] h-32 lg:w-[34rem] lg:h-36"
          }
        `}
      >
        <img
          src={logo}
          alt="Tekacom logo"
          className="w-full h-full object-contain scale-[1.18]"
        />
      </div>
    </Link>
  );
};

export default Logo;
