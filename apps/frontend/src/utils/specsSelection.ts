import type {
  Specs,
  CPUSpecs,
  GPUSpecs,
  MainboardSpecs,
  RAMSpecs,
  StorageSpecs,
  PSUSpecs,
  CategoryType,
} from '../types/components';

export function isCPUSpecs(specs: Specs): specs is CPUSpecs {
  return specs.category === 'CPU';
}

export function isGPUSpecs(specs: Specs): specs is GPUSpecs {
  return specs.category === 'GPU';
}

export function isMainboardSpecs(specs: Specs): specs is MainboardSpecs {
  return specs.category === 'MAINBOARD';
}

export function isRAMSpecs(specs: Specs): specs is RAMSpecs {
  return specs.category === 'RAM';
}

export function isStorageSpecs(specs: Specs): specs is StorageSpecs {
  return specs.category === 'STORAGE';
}

export function isPSUSpecs(specs: Specs): specs is PSUSpecs {
  return specs.category === 'PSU';
}

export function parseSpecs(category: CategoryType, raw: object): Specs | null {
  switch (category) {
    case 'CPU':
      return { category, ...raw } as CPUSpecs;
    case 'GPU':
      return { category, ...raw } as GPUSpecs;
    case 'MAINBOARD':
      return { category, ...raw } as MainboardSpecs;
    case 'RAM':
      return { category, ...raw } as RAMSpecs;
    case 'STORAGE':
      return { category, ...raw } as StorageSpecs;
    case 'PSU':
      return { category, ...raw } as PSUSpecs;
    default:
      return null;
  }
}
