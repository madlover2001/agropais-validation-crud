import { z } from "zod";

export const ValidatorSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  ci: z.string().min(7, { message: 'La cédula debe tener al menos 7 caracteres' }),
  dateOfBirth: z.string().optional(), // Podría tener validación de formato de fecha aquí
  hasRuc: z.boolean(),
  rucNumber: z.string().min(10, { message: 'El número de RUC debe tener al menos 10 caracteres' }).optional(),
  gender: z.enum(['male', 'female', 'other']),
  hasFarm: z.boolean(),
  farmHa: z.number().min(0, { message: 'Las hectáreas de la finca deben ser un número mayor o igual a 0' }).optional(),
  farmName: z.string().min(2, { message: 'El nombre de la finca debe tener al menos 2 caracteres' }).optional(),
  crops: z.array(z.string()),
  family: z.array(
    z.object({
      name: z.string().min(2, { message: 'El nombre del miembro de la familia debe tener al menos 2 caracteres' }),
      lastName: z.string().min(2, { message: 'El apellido del miembro de la familia debe tener al menos 2 caracteres' }),
      ci: z.string().min(7, { message: 'La cédula del miembro de la familia debe tener al menos 7 caracteres' }),
    })
  ),
  hasWorkers: z.boolean(),
  totalWorkers: z.number().min(0, { message: 'El total de trabajadores debe ser un número mayor o igual a 0' }).optional(),
  menWorkers: z.number().min(0, { message: 'El número de trabajadores hombres debe ser un número mayor o igual a 0' }).optional(),
  womanWorkers: z.number().min(0, { message: 'El número de trabajadores mujeres debe ser un número mayor o igual a 0' }).optional(),
  over18Workers: z.number().min(0, { message: 'El número de trabajadores mayores de 18 años debe ser un número mayor o igual a 0' }).optional(),
  under18Workers: z.number().min(0, { message: 'El número de trabajadores menores de 18 años debe ser un número mayor o igual a 0' }).optional(),
  minorWorkersOcuppacion: z.string().optional(),
  hasPregnantWorkers: z.boolean(),
  pregnantWorkers: z.number().min(0, { message: 'El número de trabajadoras embarazadas debe ser un número mayor o igual a 0' }).optional(),
  pregnantWorkersOcuppacion: z.string().optional(),
});