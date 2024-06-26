"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ValidatorSchema } from "@/schemas/person.schema";

function FormPage() {
  const [newPerson, setNewPerson] = useState({
    name: "",
    lastName: "",
    ci: "",
    dateOfBirth: "",
    hasRuc: false,
    rucNumber: "",
    gender: "",
    hasFarm: false,
    farmHa: "",
    farmName: "",
    crops: [] as string[],
    family: [
      {
        name: "",
        lastName: "",
        ci: "",
      },
    ],
    hasWorkers: false,
    totalWorkers: "",
    menWorkers: "",
    womanWorkers: "",
    over18Workers: "",
    under18Workers: "",
    minorWorkersOcuppacion: "",
    hasPregnantWorkers: false,
    pregnantWorkers: "",
    pregnantWorkersOcuppacion: "",
  });

  const router = useRouter();
  const params = useParams();

  const tiposDeCultivos = ["maiz", "papa", "otro"];

  const isCropChecked = (crop: string) => {
    return newPerson.crops.includes(crop);
  };

  const getPerson = async () => {
    const res = await fetch(`/api/tasks/${params.id}`);
    const data = await res.json();
    console.log(data);
    setNewPerson({
      name: data.name,
      lastName: data.lastName,
      ci: data.ci,
      dateOfBirth: data.dateOfBirth,
      hasRuc: data.hasRuc,
      rucNumber: data.rucNumber,
      gender: data.gender,
      hasFarm: data.hasFarm,
      farmHa: data.farmHa,
      farmName: data.farmName,
      crops: data.crops,
      family: data.family.map((member) => ({
        name: member.name,
        lastName: member.lastName,
        ci: member.ci,
      })),
      hasWorkers: data.hasWorkers,
      totalWorkers: data.totalWorkers,
      menWorkers: data.menWorkers,
      womanWorkers: data.womanWorkers,
      over18Workers: data.over18Workers,
      under18Workers: data.under18Workers,
      minorWorkersOcuppacion: data.minorWorkersOcuppacion,
      hasPregnantWorkers: data.hasPregnantWorkers,
      pregnantWorkers: data.pregnantWorkers,
      pregnantWorkersOcuppacion: data.pregnantWorkersOcuppacion,
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      if (
        name === "hasRuc" ||
        name === "hasFarm" ||
        name === "hasWorkers" ||
        name === "hasPregnantWorkers"
      ) {
        setNewPerson((prevState) => ({
          ...prevState,
          [name]: checkbox.checked,
          rucNumber:
            checkbox.name === "hasRuc" && !checkbox.checked
              ? ""
              : prevState.rucNumber,
        }));
      } else if (name === "crops") {
        if (checkbox.checked) {
          setNewPerson((prevState) => ({
            ...prevState,
            crops: [...prevState.crops, value],
          }));
        } else {
          setNewPerson((prevState) => ({
            ...prevState,
            crops: prevState.crops.filter((crop) => crop !== value),
          }));
        }
      }
    } else if (index !== undefined && name.startsWith("family")) {
      const familyKey = name.slice(6, 7).toLowerCase() + name.slice(7);
      setNewPerson((prevState) => {
        const updatedFamily = [...prevState.family];
        updatedFamily[index] = { ...updatedFamily[index], [familyKey]: value };
        return { ...prevState, family: updatedFamily };
      });
    } else {
      setNewPerson((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addFamilyMember = () => {
    setNewPerson((prevState) => ({
      ...prevState,
      family: [...prevState.family, { name: "", lastName: "", ci: "" }],
    }));
  };

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(newPerson)
    if (!params.id) {
        const validation = ValidatorSchema.safeParse(newPerson);
            if (!validation.success) {
            setValidationErrors(validation.error.errors.map(err => err.message));
            return;
            }
      try {
        const filteredPerson = {
          ...newPerson,
          // Eliminar rucNumber si hasRuc es false
          rucNumber: newPerson.hasRuc ? newPerson.rucNumber : undefined,
          // Eliminar campos de la familia que estén vacíos
          family: newPerson.family.filter(
            (member) => member.name || member.lastName || member.ci
          ),
        };
        if (!ValidatorSchema.safeParse(filteredPerson).success) {
            return;
        }
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredPerson),
        });

        if (response.ok) {
          router.push("/"); // Redireccionar después de éxito
        } else {
          console.error("Error al enviar el formulario:", response);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
      router.refresh();
    } else {
      updatePerson();
    }
  };

  const updatePerson = async () => {
    const validation = ValidatorSchema.safeParse(newPerson);
    if (!validation.success) {
      setValidationErrors(validation.error.errors.map(err => err.message));
      return;
    }
    const res = await fetch(`/api/tasks/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(newPerson),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    router.push("/");
    router.refresh();
  };

  const handleDelete = async () => {
    if (
      window.confirm("Estas seguro de querer salir y eliminar este registro")
    ) {
      try {
        const res = await fetch(`/api/tasks/${params.id}`, {
          method: "DELETE",
        });
        router.push("/");
        router.refresh();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (params.id) {
      getPerson();
    }
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 p-10 text-blue-900 rounded-md">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-4 rounded-md shadow-md"
      >
        <header className="flex justify-between">
          <h3 className="font-bold text-3xl pb-4">
            {!params.id
              ? "Crear Nuevo Registro"
              : "Actualizar el Registro Guardado"}
          </h3>
          <button
            onClick={handleDelete}
            className="bg-red-200 px-3 py-1 rounded-md"
            type="button"
          >
            Eliminar
          </button>
        </header>
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">Nombre:</label>
          <input
            type="text"
            name="name"
            required
            onChange={handleChange}
            value={newPerson.name}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">
            Apellido:
          </label>
          <input
            type="text"
            name="lastName"
            required
            onChange={handleChange}
            value={newPerson.lastName}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">Cédula:</label>
          <input
            type="text"
            name="ci"
            required
            onChange={handleChange}
            value={newPerson.ci}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">
            Fecha de nacimiento:
          </label>
          <input
            type="date"
            name="dateOfBirth"
            required
            onChange={handleChange}
            value={newPerson.dateOfBirth}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">
            Tiene RUC:
          </label>
          <input
            type="checkbox"
            name="hasRuc"
            onChange={handleChange}
            checked={newPerson.hasRuc}
            className="mr-2 leading-tight"
          />
        </div>
        {newPerson.hasRuc && (
          <div className="mb-4">
            <label className="block text-green-700 font-bold mb-2">
              Número de RUC:
            </label>
            <input
              type="text"
              name="rucNumber"
              value={newPerson.rucNumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">Género:</label>
          <select
            name="gender"
            required
            onChange={handleChange}
            value={newPerson.gender}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Seleccione...</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">
            Tiene finca:
          </label>
          <input
            type="checkbox"
            name="hasFarm"
            onChange={handleChange}
            checked={newPerson.hasFarm}
            className="mr-2 leading-tight"
          />
        </div>
        {newPerson.hasFarm && (
          <>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Hectáreas de la finca:
              </label>
              <input
                type="number"
                name="farmHa"
                onChange={handleChange}
                value={newPerson.farmHa}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Nombre de la finca:
              </label>
              <input
                type="text"
                name="farmName"
                onChange={handleChange}
                value={newPerson.farmName}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">
            Tipos de cultivos:
          </label>
          {tiposDeCultivos.map((crop) => (
            <div key={crop} className="flex items-center mb-2">
              <input
                type="checkbox"
                name="crops"
                value={crop}
                onChange={handleChange}
                checked={isCropChecked(crop)}
                className="mr-2 leading-tight"
              />
              <label>{crop.charAt(0).toUpperCase() + crop.slice(1)}</label>
            </div>
          ))}
          <label className="block text-green-700 font-bold mb-2">
            Nucleo Familiar:
          </label>
          {newPerson.family.map((member, index) => (
            <div key={index} className="mb-2">
              <div className="mb-2">
                <label className="block text-green-700 text-sm font-bold mb-2">
                  Nombre:
                </label>
                <input
                  type="text"
                  name="familyName"
                  value={member.name}
                  onChange={(e) => handleChange(e, index)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-2">
                <label className="block text-green-700 text-sm font-bold mb-2">
                  Apellido:
                </label>
                <input
                  type="text"
                  name="familyLastName"
                  value={member.lastName}
                  onChange={(e) => handleChange(e, index)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-2">
                <label className="block text-green-700 text-sm font-bold mb-2">
                  Cédula:
                </label>
                <input
                  type="text"
                  name="familyCi"
                  value={member.ci}
                  onChange={(e) => handleChange(e, index)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addFamilyMember}
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agregar Miembro de la Familia
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">
            Tiene trabajadores:
          </label>
          <input
            type="checkbox"
            name="hasWorkers"
            onChange={handleChange}
            checked={newPerson.hasWorkers}
            className="mr-2 leading-tight"
          />
        </div>
        {newPerson.hasWorkers && (
          <>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Total de trabajadores:
              </label>
              <input
                type="number"
                name="totalWorkers"
                onChange={handleChange}
                value={newPerson.totalWorkers}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Trabajadores hombres:
              </label>
              <input
                type="number"
                name="menWorkers"
                onChange={handleChange}
                value={newPerson.menWorkers}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Trabajadores mujeres:
              </label>
              <input
                type="number"
                name="womanWorkers"
                onChange={handleChange}
                value={newPerson.womanWorkers}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Trabajadores mayores de 18 años:
              </label>
              <input
                type="number"
                name="over18Workers"
                onChange={handleChange}
                value={newPerson.over18Workers}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Trabajadores menores de 18 años:
              </label>
              <input
                type="number"
                name="under18Workers"
                onChange={handleChange}
                value={newPerson.under18Workers}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Ocupación de trabajadores menores de edad:
              </label>
              <input
                type="text"
                name="minorWorkersOcuppacion"
                onChange={handleChange}
                value={newPerson.minorWorkersOcuppacion}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-green-700 font-bold mb-2">
            Tiene trabajadoras embarazadas:
          </label>
          <input
            type="checkbox"
            name="hasPregnantWorkers"
            onChange={handleChange}
            checked={newPerson.hasPregnantWorkers}
            className="mr-2 leading-tight"
          />
        </div>
        {newPerson.hasPregnantWorkers && (
          <>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Número de trabajadoras embarazadas:
              </label>
              <input
                type="number"
                name="pregnantWorkers"
                onChange={handleChange}
                value={newPerson.pregnantWorkers}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-green-700 font-bold mb-2">
                Ocupación de trabajadoras embarazadas:
              </label>
              <input
                type="text"
                name="pregnantWorkersOcuppacion"
                onChange={handleChange}
                value={newPerson.pregnantWorkersOcuppacion}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        )}
        {validationErrors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {!params.id ? "Crear Registro" : "Actualizar Registro"}
        </button>
      </form>
    </div>
  );
}

export default FormPage;
