import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const PersonSchema = new Schema({
      name: { type: String, required: true },
      lastName: { type: String, required: true },
        ci: {
          type: String,
          required: true,
          unique: true,
          validate: {
            validator: function (v) {
              return /^[0-9]{10}$/.test(v); // Valida formato de cédula ecuatoriana
            },
            message: (props) => `${props.value} no es una cédula válida!`,
          },
        },
      dateOfBirth: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            const birthDate = new Date(v);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            return age >= 18; // Debe ser mayor de 18 años
          },
          message: (props) =>
            `La fecha de nacimiento debe indicar que la persona es mayor de 18 años`,
        },
      },
      hasRuc: { type: Boolean },
      rucNumber: {
        type: String,
        validate: {
          validator: function (v) {
            if (this.hasRuc && !v) return false;
            return /^[0-9]{13}$/.test(v); // Valida formato de RUC ecuatoriano
          },
          message: (props) => `${props.value} no es un RUC válido!`,
        },
      },
      gender: { type: String, required: true },
      hasFarm: { type: Boolean },
      farmHa: {
        type: Number,
        validate: {
          validator: function (v) {
            return !this.hasFarm || (this.hasFarm && v !== undefined); // Obligatorio si tiene finca
          },
          message: (props) => `Las hectáreas de la finca son obligatorias`,
        },
      },
      farmName: {
        type: String,
        validate: {
          validator: function (v) {
            return !this.hasFarm || (this.hasFarm && v); // Obligatorio si tiene finca
          },
          message: (props) => `El nombre de la finca es obligatorio`,
        },
      },
      crops: {
        type: [String],
        validate: {
          validator: function (v) {
            return !this.hasFarm || (this.hasFarm && v.length > 0); // Obligatorio si tiene finca
          },
          message: (props) => `Los cultivos son obligatorios`,
        },
      },
      family: [
        {
          name: { type: String },
          lastName: { type: String },
          ci: {
            type: String,
            required: true,
            validate: {
              validator: function (v) {
                return /^[0-9]{10}$/.test(v); // Valida formato de cédula ecuatoriana
              },
              message: (props) => `${props.value} no es una cédula válida!`,
            },
          },
        },
      ],
      hasWorkers: { type: Boolean },
      totalWorkers: {
        type: Number,
        validate: {
          validator: function (v) {
            return !this.hasWorkers || (this.hasWorkers && v !== undefined); // Obligatorio si tiene trabajadores
          },
          message: (props) => `El número total de trabajadores es obligatorio`,
        },
      },
      menWorkers: {
        type: Number,
        validate: {
          validator: function (v) {
            if (!this.hasWorkers) return true;
            return (
              v !== undefined &&
              this.womanWorkers !== undefined &&
              v + this.womanWorkers === this.totalWorkers
            );
          },
          message: (props) =>
            `La suma de trabajadores hombres y mujeres debe ser igual al total de trabajadores`,
        },
      },
      womanWorkers: {
        type: Number,
        validate: {
          validator: function (v) {
            if (!this.hasWorkers) return true;
            return (
              v !== undefined &&
              this.menWorkers !== undefined &&
              v + this.menWorkers === this.totalWorkers
            );
          },
          message: (props) =>
            `La suma de trabajadores hombres y mujeres debe ser igual al total de trabajadores`,
        },
      },
      over18Workers: {
        type: Number,
        validate: {
          validator: function (v) {
            if (!this.hasWorkers) return true;
            return (
              v !== undefined &&
              this.under18Workers !== undefined &&
              v + this.under18Workers === this.totalWorkers
            );
          },
          message: (props) =>
            `La suma de trabajadores mayores y menores de 18 años debe ser igual al total de trabajadores`,
        },
      },
      under18Workers: {
        type: Number,
        validate: {
          validator: function (v) {
            if (!this.hasWorkers) return true;
            return (
              v !== undefined &&
              this.over18Workers !== undefined &&
              v + this.over18Workers === this.totalWorkers
            );
          },
          message: (props) =>
            `La suma de trabajadores mayores y menores de 18 años debe ser igual al total de trabajadores`,
        },
      },
      minorWorkersOcuppacion: {
        type: String,
        validate: {
          validator: function (v) {
            if (this.under18Workers > 0 && !v) return false;
            return true;
          },
          message: (props) =>
            `La ocupación de los trabajadores menores de edad es obligatoria`,
        },
      },
      hasPregnantWorkers: { type: Boolean },
      pregnantWorkers: {
        type: Number,
        validate: {
          validator: function (v) {
            if (!this.hasPregnantWorkers) return true;
            return v !== undefined && v <= this.womanWorkers;
          },
          message: (props) =>
            `El número de trabajadoras embarazadas no puede ser mayor al número de trabajadoras`,
        },
      },
      pregnantWorkersOcuppacion: {
        type: String,
        validate: {
          validator: function (v) {
            if (this.pregnantWorkers > 0 && !v) return false;
            return true;
          },
          message: (props) =>
            `La ocupación de las trabajadoras embarazadas es obligatoria`,
        },
      },
    });

const Person = models.Person || model("Person", PersonSchema, "persons");

export default Person;
