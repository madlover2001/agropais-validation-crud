import Link from "next/link"

function Navbar(){
    return(
        <nav className="bg-gray-50 py-5 mb-2">
        <div className="container flex text-2xl font-bold mb-2 justify-between items-center my-2 mx-2">
                <Link href="/">  <h1 className="text-5xl pl-4">Agropaís</h1> </Link>    
            <ul>
                <li>
                    <Link href="/persons/new" className="text-lg text-green-600">Crear Nuevo Registro</Link>
                </li>
            </ul>
        </div>
        </nav>
    )
}

export default Navbar

