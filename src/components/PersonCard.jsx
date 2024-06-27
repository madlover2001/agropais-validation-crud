import Link from "next/link";

function PersonCard({ person }) {
  return (
    <Link href={`/persons/${person._id}`}>
      <div className="flex justify-center">
        <div className="bg-green-100 p-4 text-blue-900 w-2/3 rounded-md hover:cursor-pointer hover:bg-gradient-to-l from-green-200 to-yellow-50">
          <div className="flex justify-between">
            {/* Columna Izquierda: Información Personal */}
            <div className="w-1/2">
              <label className="font-bold text-xl">Información Personal</label>
              <div className="text-gray-800">
              <h3 className="font-semibold">{`${person.name} ${person.lastName}`}</h3>
              <p>
                <strong className="font-semibold">Cédula:</strong> {person.ci}
              </p>

              {/* Información adicional */}
              <div className="mt-2">
                <p>
                  <strong className="font-semibold">Nombre de la Finca:</strong>{" "}
                  {person.hasFarm ? (
                    <span>{person.farmName}</span>
                  ) : (
                    "No tiene finca"
                  )}
                </p>
              </div>
              </div>
              
            </div>

            {/* Columna Derecha: Información de la Empresa */}
            <div className="w-1/2">
              <label className="font-bold text-xl">Información de la Finca</label>
              <div className="mt-2 text-gray-800">
                <ul className="list-disc pl-6">
                    <li>
                        <strong className="font-semibold">RUC:</strong> {person.rucNumber}
                    </li>
                    <li>
                        <strong className="font-semibold">Hectareas de la Finca:</strong> {person.farmHa}
                    </li>
                  <li>
                    <strong className="font-semibold">Total de Trabajadores:</strong>{" "}
                    {person.hasWorkers
                      ? person.totalWorkers
                      : "No tiene trabajadores"}
                  </li>
                  {person.hasWorkers && (
                    <>
                      <li>
                        <strong className="font-semibold">Hombres:</strong> {person.menWorkers}
                      </li>
                      <li>
                        <strong className="font-semibold">Mujeres:</strong> {person.womanWorkers}
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default PersonCard;
