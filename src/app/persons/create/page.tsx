"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import {
  ValidatorSchema,
  type ValidatorSchemaType,
} from "@/schemas/person.schema";

const genderOptions = ["male", "female", "other"];
const cropOptions = ["Maíz", "Papa", "Café", "Cacao", "Otros"];

export default function Form() {
  const { id } = useParams(); // Obtiene el ID del parámetro de la URL
  const router = useRouter();
  const [data, setData] = React.useState({});
  const [error, setError] = useState(null);
  const [checkboxState, setCheckboxState] = useState({
    hasRuc: false,
    hasFarm: false,
    hasWorkers: false,
    hasPregnantWorkers: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ValidatorSchemaType>({
    resolver: zodResolver(ValidatorSchema),
    defaultValues: {
      name: "",
      lastName: "",
      ci: "",
      dateOfBirth: "",
      gender: undefined,
      hasRuc: false,
      rucNumber: "",
      hasFarm: false,
      farmName: "",
      farmHa: 0,
      crops: [],
      family: [{ name: "", lastName: "", ci: "" }],
      hasWorkers: false,
      totalWorkers: 0,
      menWorkers: 0,
      womanWorkers: 0,
      over18Workers: 0,
      under18Workers: 0,
      minorWorkersOcuppacion: "",
      hasPregnantWorkers: false,
      pregnantWorkers: 0,
      pregnantWorkersOcuppacion: "",
    },
  });

  useEffect(() => {
    if (id) {
      // Si hay un ID, carga los datos del registro existente
      update(id);
    } else {
      // Si no hay ID, resetea el formulario
      reset();
    }
  }, [id, reset]);

  useEffect(() => {
    setCheckboxState({
      hasRuc: watch("hasRuc"),
      hasFarm: watch("hasFarm"),
      hasWorkers: watch("hasWorkers"),
      hasPregnantWorkers: watch("hasPregnantWorkers"),
    });
  }, [watch]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "family",
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const update = async (recordId: string) => {
    try {
      const response = await fetch(`/api/tasks/${recordId}`);
      if (!response.ok) {
        throw new Error("Error al cargar el registro");
      }
      const recordData = await response.json();

      Object.keys(recordData).forEach((key) => {
        setValue(key as keyof ValidatorSchemaType, recordData[key]);
      });
      setData(recordData);
      router.refresh();
    } catch (error) {
      console.error("Error al cargar el registro:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Estas seguro de querer salir y eliminar este registro")
    ) {
      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Error al eliminar el registro:", error);
      }
    }
  };

  const onSubmit = async (formData: ValidatorSchemaType) => {
    setError(null); 
    try {
      let apiUrl = "/api/tasks";
      let method = "POST";

      if (id) {
        // Si hay un ID, actualiza el registro existente
        apiUrl = `/api/tasks/${id}`;
        method = "PUT";
      }

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario, revisa que coincidan las cantidades");
      }
      const responseData = await response.json();
      setData(responseData); // Actualiza los datos en el estado local si es necesario
      reset(); // Resetea el formulario después de enviar
      // Redirecciona a la página principal u otra página de destino
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error( error);
      setError(error.message); 
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 mt-0 text-blue-900 rounded-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white p-4 rounded-md shadow-md bg-gradient-to-r from-green-50 to-green-100"
      >
        <header className="flex justify-between">
          <h3 className="font-bold text-2xl pb-4">
            {!id ? "Crear Nuevo Registro" : "Actualizar el Registro Guardado"}
          </h3>
          {id && (
            <button
              onClick={handleDelete}
              className="bg-red-400 hover:bg-red-500 text-white text-xs font-bold p-2 m-2 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Eliminar
            </button>
          )}
        </header>
        <div>
          <label className="block text-green-700 font-bold mb-2">Nombre</label>
          <input
            type="text"
            id="name"
            placeholder="Nombre es obligatorio"
            className="input-field shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register("name")}
          />
          {errors.name && (
            <p className="error-message text-red-500 text-sm p-3">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-green-700 font-bold mb-2 mt-2">
            Apellido
          </label>
          <input
            type="text"
            placeholder="Apellido es obligatorio"
            className="input-field shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="error-message text-red-500 text-sm p-3">
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-green-700 font-bold mb-2 mt-2">
            Numero de Cedula
          </label>
          <input
            type="text"
            placeholder="Numero de Cedula obligatorio"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register("ci")}
          />
          {errors.ci && (
            <p className="error-message text-red-500 text-sm p-3">
              {errors.ci.message}
            </p>
          )}
        </div>
        <label className="block text-green-700 font-bold mb-2 mt-2">
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("dateOfBirth")}
        />
        {errors.dateOfBirth && (
          <p className="error-message text-red-500 text-sm p-3">
            {errors.dateOfBirth.message}
          </p>
        )}
        <div>
          <label className="block text-green-700 font-bold mb-2 mt-2">
            Género
          </label>
          <select
            id="gender"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register("gender")}
          >
            <option value="">Seleccione...</option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option === "male"
                  ? "Masculino"
                  : option === "female"
                  ? "Femenino"
                  : "Otro"}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="error-message text-red-500 text-sm p-3">
              {errors.gender.message}
            </p>
          )}
        </div>
        <label className="block text-green-700 font-bold mb-2 mt-2">
          Tiene RUC?
        </label>
        <input
          type="checkbox"
          {...register("hasRuc")}
          className="input appearance-none w-5 h-5 border border-gray-500 bg-white rounded-md checked:bg-green-700 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
          defaultChecked={watch("hasRuc", false)}
        />
        {errors.hasRuc && (
          <p className="error-message text-red-500 text-sm p-3">
            {errors.hasRuc.message}
          </p>
        )}
        {(watch("hasRuc") || checkboxState.hasRuc) && (
          <div>
            <label className="block text-green-700 font-bold mb-2 mt-2">
              Numero de RUC
            </label>
            <input
              type="text"
              placeholder="Numero de RUC es requerido"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("rucNumber")}
            />
            {errors.rucNumber && (
              <p className="error-message text-red-500 text-sm p-3">
                {errors.rucNumber.message}
              </p>
            )}
          </div>
        )}
        <div>
          <label className="block text-green-700 font-bold mb-2 mt-2">
            Tiene Finca?
          </label>
          <input
            type="checkbox"
            className="input appearance-none w-5 h-5 border border-gray-500 bg-white rounded-md checked:bg-green-700 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
            {...register("hasFarm")}
            defaultChecked={watch("hasFarm", false)}
          />
          {errors.hasFarm && (
            <p className="error-message text-red-500 text-sm p-3">
              {errors.hasFarm.message}
            </p>
          )}
        </div>
        {(watch("hasFarm") || checkboxState.hasFarm) && (
          <div>
            <div>
              <label className="block text-green-700 font-bold mb-2 mt-2">
                Nombre de la Finca
              </label>
              <input
                type="text"
                placeholder="Ingresa el nombre de la propiedad"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("farmName")}
              />
              {errors.farmName && (
                <p className="error-message text-red-500 text-sm p-3">
                  {errors.farmName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-green-700 font-bold mb-2 mt-2">
                Hectareas de la Finca
              </label>
              <input
                type="number"
                placeholder="Ingresa el numero de hectareas"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("farmHa", { valueAsNumber: true })}
              />
              {errors.farmHa && (
                <p className="error-message text-red-500 text-sm p-3">
                  {errors.farmHa.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-green-700 font-bold mb-2 mt-2">
                Tipos de Cultivos de la Finca
              </label>
              {cropOptions.map((crop) => (
                <div key={crop}>
                  <input
                    type="checkbox"
                    className="link input appearance-none w-4 h-4 border border-gray-500 bg-white rounded-md checked:bg-green-700 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                    id={crop}
                    {...register("crops")}
                    value={crop}
                  />
                  <label htmlFor={crop}> {crop}</label>
                </div>
              ))}
              {errors.crops && (
                <p className="error-message text-red-500 text-sm p-3">
                  {errors.crops.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-green-700 font-bold mb-2 mt-2 text-lg">
                Familiares
              </label>
              <label className="block text-gray-400 text-sm font-bold m-2">
                    Agrega por lo menos un integrante de la Familia
                  </label>
              {fields.map((item, index) => (
                <div key={item.id} className="card pb-2">
                  <label className="block text-green-700 text-sm font-bold m-2">
                    Nombre del Familiar:
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register(`family.${index}.name` as const)}
                  />
                  {errors.family?.[index]?.name && (
                    <span className="error-message text-red-500 text-sm p-3">
                      {errors.family[index].name?.message}
                    </span>
                  )}
                  <label className="block text-green-700 text-sm font-bold m-2">
                    Apellido del Familiar:
                  </label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register(`family.${index}.lastName` as const)}
                  />
                  {errors.family?.[index]?.lastName && (
                    <span className="error-message text-red-500 text-sm p-3">
                      {errors.family[index].lastName?.message}
                    </span>
                  )}
                  <label className="block text-green-700 text-sm font-bold m-2">
                    Cedula del Familiar:
                  </label>
                  <input
                    type="text"
                    placeholder="CI"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register(`family.${index}.ci` as const)}
                  />
                  {errors.family?.[index]?.ci && (
                    <span className="error-message text-red-500 text-sm p-3">
                      {errors.family[index].ci?.message}
                    </span>
                  )}
                  <div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-400 hover:bg-red-500 text-white text-xs font-bold p-2 m-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => remove(index)}
                    >
                      Eliminar
                    </button>
                  )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-xs"
                onClick={() => append({ name: "", lastName: "", ci: "" })}
              >
                Añadir Familiar
              </button>
            </div>
            <div>
              <label className="block text-green-700 font-bold mb-2 mt-2">
                Tiene Trabajadores?
              </label>
              <input
                type="checkbox"
                className="input appearance-none w-5 h-5 border border-gray-500 bg-white rounded-md checked:bg-green-700 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register("hasWorkers")}
                defaultChecked={watch("hasWorkers", false)}
              />
              {errors.hasWorkers && (
                <p className="error-message text-red-500 text-sm p-3">
                  {errors.hasWorkers.message}
                </p>
              )}
              {(watch("hasWorkers") || checkboxState.hasWorkers) && (
                <div>
                  <label className="block text-green-700 font-bold mb-2 mt-2">
                    Numero Total de Trabajadores
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("totalWorkers", { valueAsNumber: true })}
                  />
                  {errors.totalWorkers && (
                    <p className="error-message text-red-500 text-sm p-3">
                      {errors.totalWorkers.message}
                    </p>
                  )}
                  <label className="block text-green-700 font-bold mb-2 mt-2">
                    Trabajadores Hombres
                  </label>
                  <input
                    type="number"
                    placeholder="Numero de trabajadores Hombres"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("menWorkers", { valueAsNumber: true })}
                  />
                  {errors.menWorkers && (
                    <p className="error-message text-red-500 text-sm p-3">
                      {errors.menWorkers.message}
                    </p>
                  )}
                  <label className="block text-green-700 font-bold mb-2 mt-2">
                    Trabajadores Mujeres
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("womanWorkers", { valueAsNumber: true })}
                  />
                  {errors.womanWorkers && (
                    <p className="error-message text-red-500 text-sm p-3">
                      {errors.womanWorkers.message}
                    </p>
                  )}
                  <label className="block text-green-700 font-bold mb-2 mt-2">
                    Trabajadores Mayores de Edad
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("over18Workers", { valueAsNumber: true })}
                  />
                  {errors.over18Workers && (
                    <p className="error-message text-red-500 text-sm p-3">
                      {errors.over18Workers.message}
                    </p>
                  )}
                  <label className="block text-green-700 font-bold mb-2 mt-2">
                    Trabajadores Menores de Edad
                  </label>
                  <input
                    type="number"
                    placeholder="Numero de trabajadores Menores de edad"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("under18Workers", { valueAsNumber: true })}
                  />
                  {errors.under18Workers && (
                    <p className="error-message text-red-500 text-sm p-3">
                      {errors.under18Workers.message}
                    </p>
                  )}
                  <label className="block text-green-700 font-bold mb-2 mt-2">
                    Ocupacion de los Trabajadores Menores de Edad
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa una Ocupación"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register("minorWorkersOcuppacion")}
                  />
                  {errors.minorWorkersOcuppacion && (
                    <p className="error-message text-red-500 text-sm p-3">
                      {errors.minorWorkersOcuppacion.message}
                    </p>
                  )}
                  <label className="block text-green-700 font-bold mb-2 mt-2">
                    Tiene Trabajadoras Embarazadas?
                  </label>
                  <input
                    type="checkbox"
                    className="input appearance-none w-5 h-5 border border-gray-500 bg-white rounded-md checked:bg-green-700 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                    {...register("hasPregnantWorkers")}
                    defaultChecked={watch("hasPregnantWorkers", false)}
                  />
                  {errors.hasPregnantWorkers && (
                    <p className="error-message text-red-500 text-sm p-3">
                      {errors.hasPregnantWorkers.message}
                    </p>
                  )}
                  {(watch("hasPregnantWorkers") ||
                    checkboxState.hasPregnantWorkers) && (
                    <div>
                      <label className="block text-green-700 font-bold mb-2 mt-2">
                        Numero de Trabajadoras Embarazadas
                      </label>
                      <input
                        type="number"
                        placeholder="Numero de trabajadoras embarazadas"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register("pregnantWorkers", {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.pregnantWorkers && (
                        <p className="error-message text-red-500 text-sm p-3">
                          {errors.pregnantWorkers.message}
                        </p>
                      )}
                      <label className="block text-green-700 font-bold mb-2 mt-2">
                        Ocupacion de las Trabajadoras Embarazadas
                      </label>
                      <input
                        type="text"
                        placeholder="Ingresa una Ocupación"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register("pregnantWorkersOcuppacion")}
                      />
                      {errors.pregnantWorkersOcuppacion && (
                        <p className="error-message text-red-500 text-sm p-3">
                          {errors.pregnantWorkersOcuppacion.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        <div>
        {error && <p className="error-message text-red-500 text-sm p-3">{error}</p>} 
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
        >
          {!id ? "Crear Registro" : "Actualizar Registro"}
        </button>
      </form>
    </div>
  );
}
