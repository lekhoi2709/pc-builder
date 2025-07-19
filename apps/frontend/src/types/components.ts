export interface Component {
  id: string;
  name: string;
  category: CategoryType;
  brand: string;
  models: string;
  specs: Specs;
  price: PriceItem[];
  image_url: string[];
  created_at: string;
  updated_at: string;
}

export type CategoryType =
  | 'CPU'
  | 'GPU'
  | 'MAINBOARD'
  | 'RAM'
  | 'STORAGE'
  | 'PSU';

export interface PriceItem {
  currency: string;
  amount: number;
  symbol: string;
}

export type Specs =
  | CPUSpecs
  | GPUSpecs
  | MainboardSpecs
  | RAMSpecs
  | StorageSpecs
  | PSUSpecs;

export interface CPUSpecs {
  category: 'CPU';
  architecture: {
    code_name: string;
    generation: string;
    memory_support: string;
  };
  physical: {
    socket: string;
    foundry: string;
    process_size: string;
  };
  cache: {
    l1: string;
    l2: string;
    l3: string;
  };
  performance: {
    cores: number;
    threads: number;
    integrated_graphics: string;
    frequency: string;
    turbo_clock: string;
    base_clock: string;
    tdp: string;
  };
  other: {
    market: string;
    release_date: string;
  };
}

export interface GPUSpecs {
  category: 'GPU';
  architecture: {
    code_name: string;
    generation: string;
    process_size: string;
  };
  physical: {
    length: string;
    width: string;
    height: string;
    slots: number;
    weight: string;
    power_pins: string;
  };
  memory: {
    size: string;
    type: string;
    bus: string;
    bandwidth: string;
  };
  performance: {
    base_clock: string;
    boost_clock: string;
    memory_clock: string;
    cuda_cores?: number;
    stream_procs?: number;
    rt_cores?: number;
    tensor_cores?: number;
    tdp: string;
  };
  display: {
    max_resolution: string;
    max_displays: number;
    outputs: string[];
  };
  other: {
    market: string;
    release_date: string;
  };
}

export interface MainboardSpecs {
  category: 'MAINBOARD';
  physical: {
    form_factor: string;
    length: string;
    width: string;
  };
  chipset: {
    name: string;
    manufacturer: string;
  };
  cpu: {
    socket: string;
    supported_cpus: string[];
  };
  memory: {
    type: string;
    max_capacity: string;
    slots: number;
    max_speed: string;
  };
  expansion: {
    pcie_slots: {
      version: string;
      lanes: string;
      count: number;
    }[];
    other_slots: string[];
  };
  storage: {
    sata_ports: number;
    m2_slots: {
      key_type: string;
      length: string;
      interface: string;
      generation: string;
    }[];
  };
  connectivity: {
    ethernet: string[];
    wifi: string;
    usb: {
      usb2: number;
      usb3: number;
      usbc: number;
    };
    audio: string[];
    display: string[];
  };
  other: {
    rgb_lighting: boolean;
    release_date: string;
  };
}

export interface RAMSpecs {
  category: 'RAM';
  physical: {
    form_factor: string;
    modules: number;
  };
  memory: {
    type: string;
    capacity: string;
    per_module: string;
  };
  performance: {
    speed: string;
    latency: string;
    voltage: string;
    timing: string;
  };
  other: {
    rgb_lighting: boolean;
    heat_sink: boolean;
    release_date: string;
  };
}

export interface StorageSpecs {
  category: 'STORAGE';
  physical: {
    type: string;
    form_factor: string;
    interface: string;
    capacity: string;
  };
  performance: {
    read_speed: string;
    write_speed: string;
    iops: string;
    latency: string;
    endurance: string;
  };
  features: {
    encryption: boolean;
    cache: string;
    controller: string;
  };
  other: {
    warranty: string;
    release_date: string;
  };
}

export interface PSUSpecs {
  category: 'PSU';
  physical: {
    form_factor: string;
    length: string;
    width: string;
    height: string;
    weight: string;
  };
  power: {
    wattage: string;
    efficiency: string;
    certification: string;
    modular: boolean;
  };
  connectors: {
    motherboard: string;
    cpu: string;
    pcie: string;
    sata: string;
    molex: string;
  };
  other: {
    fan_size: string;
    warranty: string;
    release_date: string;
  };
}
