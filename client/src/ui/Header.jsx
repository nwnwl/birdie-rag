import { Link } from "react-router-dom";

function Header() {
  return (
    <Link to="/">
      <h1 className="sm:text-3xl text-2xl   flex items-center gap-2 ">
        <span style={{ fontSize: "1em", verticalAlign: "-0.1em" }}>
          <img
            src="/favicon.ico"
            className="
              w-[1.2em]
              h-[1.2em]
              inline-block
              object-contain
            "
            alt="bird emoji"
          />
        </span>{" "}
        <span className="text-amber-900/90 font-cause tracking-wider ">
          Birdie
        </span>
      </h1>
    </Link>
  );
}
export default Header;
