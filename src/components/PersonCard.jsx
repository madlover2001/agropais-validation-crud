import Link from "next/link"

function PersonCard({person}) {
    return (
        <Link href={`/persons/${person._id}`}>
            <div className="flex justify-center">
                <div className="bg-green-50 p-4 text-blue-900 w-2/3 rounded-md hover:cursor-pointer hover:bg-green-100">
                <div className="flex justify-between">
                {/* Columna Izquierda: Información Personal */}
                <div className="w-1/2">
                    {/* Nombre y Apellidos */}
                    <h3 className="font-bold">{`${person.name} ${person.lastName}`}</h3>
                    
                    {/* Número de cédula */}
                    <p><strong>Cédula:</strong> {person.ci}</p>
                    
                    {/* Información adicional */}
                    <div className="mt-2">
                    <p><strong>Finca:</strong> {person.hasFarm ? (
                <span>
                  {person.farmName}, <strong>RUC:</strong> {person.rucNumber}, <strong>Cultivos:</strong> {person.crops.join(', ')}
                </span>
              ) : 'No tiene finca'}</p>
                    </div>
                </div>
        
                {/* Columna Derecha: Información de la Empresa */}
                <div className="w-1/2">
                    <div className="mt-2">
                    <p><strong>Empresa:</strong></p>
                    <ul className="list-disc pl-6">
                        <li><strong>Total Trabajadores:</strong> {person.hasWorkers ? person.totalWorkers : 'No tiene trabajadores'}</li>
                        {person.hasWorkers && (
                        <>
                            <li><strong>Hombres:</strong> {person.menWorkers}</li>
                            <li><strong>Mujeres:</strong> {person.womanWorkers}</li>
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
export default PersonCard