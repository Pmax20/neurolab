import type { ModelDef } from './types';
import { membraneModel } from './membrane';
import { hhModel } from './hh';
import { conductionModel } from './conduction';
import { synapseModel, nmjModel, pspModel } from './synapse';
import { muscleModel } from './muscle';
import { enzymeModel, transportModel, osmosisModel } from './cell';
import { acidBaseModel } from './chem';
import { circulationModel, respirationModel } from './physio';
import { concentrationModel, equilibriumModel, redoxModel } from './chem2';
import { leverModel, flowModel, rcModel, lensModel, ultrasoundModel, decayModel, diffusionModel } from './physics';

/** Modellbibliothek: alle verfügbaren, dokumentierten Simulationen */
export const MODELS: ModelDef[] = [
  membraneModel,
  hhModel,
  conductionModel,
  synapseModel,
  pspModel,
  nmjModel,
  muscleModel,
  transportModel,
  osmosisModel,
  enzymeModel,
  acidBaseModel,
  circulationModel,
  respirationModel,
  concentrationModel,
  equilibriumModel,
  redoxModel,
  leverModel,
  flowModel,
  diffusionModel,
  rcModel,
  lensModel,
  ultrasoundModel,
  decayModel,
];

export const modelById = (id: string) => MODELS.find((m) => m.id === id);
