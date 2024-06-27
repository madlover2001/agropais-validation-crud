import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-gradient-to-t from-green-50 to-green-100 py-5 mb-1">
      <div className="container flex text-2xl font-bold mb-2 justify-between items-center my-2 mx-2">
        <Link href="/">
          {" "}
          <h1 className="text-5xl pl-4 hover:text-green-800">
            Agr<span className="text-green-800 hover:text-blue-800">op</span>aís
          </h1>{" "}
        </Link>
        <ul>
          <li>
            <Link
              href="/persons/create"
              className="text-lg text-green-600 hover:text-blue-900 "
            >
              Crear Nuevo Registro
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
