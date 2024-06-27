import { z } from "zod";

const isOlderThan18 = (date: string): boolean => {
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return age - 1 >= 18;
  }
  return age >= 18;
};

const genderOptions = ["male", "female", "other"] as const;

export const ValidatorSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  ci: z.string().min(10, { message: 'La cédula debe tener al menos 10 caracteres' }),
  dateOfBirth: z.string().refine(isOlderThan18, {
    message: "Debe ser mayor de 18 años",
  }).optional(),
  hasRuc: z.boolean().optional().refine(value => value === true, {message: "El Ruc es requerido, marca la casilla para continuar"}),
  rucNumber: z.string().min(13, { message: 'El número de RUC debe tener al menos 13 caracteres' }).optional(),
  gender: z.enum(genderOptions,{message: 'Genero obligatorio'}).optional(),
  hasFarm: z.boolean().optional().refine(value => value === true, {message: "La Finca es requerida, marca la casilla para continuar"}),
  farmHa: z.number().min(0, { message: 'Las hectáreas de la finca deben ser un número mayor o igual a 0' }).optional(),
  farmName: z.string().min(2, { message: 'El nombre de la finca debe tener al menos 2 caracteres' }).optional(),
  crops: z.array(z.string()).optional(),
  family: z.array(
    z.object({
      name: z.string().min(2, { message: 'El nombre del miembro de la familia debe tener al menos 2 caracteres' }).optional(),
      lastName: z.string().min(2, { message: 'El apellido del miembro de la familia debe tener al menos 2 caracteres' }).optional(),
      ci: z.string().min(10, { message: 'La cédula del miembro de la familia debe tener al menos 10 caracteres' }).optional(),
    })
  ).optional(),
  hasWorkers: z.boolean().optional().refine(value => value === true, {message: "Trabajadores requeridos, marca la casilla para continuar"}),
  totalWorkers: z.number().min(0, { message: 'El total de trabajadores debe ser un número mayor o igual a 0' }).optional(),
  menWorkers: z.number().min(0, { message: 'El número de trabajadores hombres debe ser un número mayor o igual a 0' }).optional(),
  womanWorkers: z.number().min(0, { message: 'El número de trabajadores mujeres debe ser un número mayor o igual a 0' }).optional(),
  over18Workers: z.number().min(0, { message: 'El número de trabajadores mayores de 18 años debe ser un número mayor o igual a 0' }).optional(),
  under18Workers: z.number().min(0, { message: 'El número de trabajadores menores de 18 años debe ser un número mayor o igual a 0' }).optional(),
  minorWorkersOcuppacion: z.string().optional(),
  hasPregnantWorkers: z.boolean().optional(),
  pregnantWorkers: z.number().min(0, { message: 'El número de trabajadoras embarazadas debe ser un número mayor o igual a 0' }).optional(),
  pregnantWorkersOcuppacion: z.string().optional(),
});

export type ValidatorSchemaType = z.infer<typeof ValidatorSchema>;
