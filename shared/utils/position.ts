// shared/utils/position.utils.ts

export const positionNames = {
  RECEPTIONIST: "Recepcionista",
  THERAPIST: "Terapeuta",
  PSYCHOLOGIST: "Psicólogo",
  PHYSIOTHERAPIST: "Fisioterapeuta",
  NUTRITIONIST: "Nutriólogo",
  CENTER_MANAGER: "Administrador del Centro",
  HR_MANAGER: "Recursos Humanos",
  ACCOUNTANT: "Contador",
  ASSISTANT: "Asistente",
  INTERN: "Practicante",
} as const;

export type Position = keyof typeof positionNames;

export const getPositionName = (position?: Position) => {
  return position ? positionNames[position] : "";
};

export const getPositionOptions = () =>
  (Object.keys(positionNames) as Position[]).map((id) => ({
    id,
    label: positionNames[id],
  }));