package models

import (
	"encoding/json"
	"fmt"
	"time"
)

type Component struct {
	ID        string          `json:"id" gorm:"primaryKey;size:255"`
	Name      string          `json:"name" gorm:"size:255;not null"`
	Category  string          `json:"category" gorm:"type:varchar(50);not null"`
	Brand     string          `json:"brand" gorm:"size:255;not null"`
	Models    string          `json:"models" gorm:"size:255"`
	Specs     json.RawMessage `json:"specs" gorm:"type:jsonb;serializer:json"`
	Price     Price           `json:"price" gorm:"type:jsonb;serializer:json"`
	ImageURL  ImageURL        `json:"image_url" gorm:"type:jsonb;serializer:json"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

// Add a method to get typed specs
func (c *Component) GetTypedSpecs() (Specs, error) {
	var specs Specs
	switch c.Category {
	case "CPU":
		specs = &CPUSpecs{}
	case "GPU":
		specs = &GPUSpecs{}
	case "MAINBOARD":
		specs = &MainboardSpecs{}
	case "RAM":
		specs = &RAMSpecs{}
	case "PSU":
		specs = &PSUSpecs{}
	default:
		return nil, fmt.Errorf("unknown category: %s", c.Category)
	}

	if err := json.Unmarshal(c.Specs, specs); err != nil {
		return nil, err
	}

	return specs, nil
}

type Specs interface {
	GetCategory() string
	Validate() error
}

type PriceItem struct {
	Currency string  `json:"currency"`
	Amount   float64 `json:"amount"`
	Symbol   string  `json:"symbol,omitempty"`
}

type Price []PriceItem
type ImageURL []string

// CPU Specifications
type CPUSpecs struct {
	Architecture struct {
		CodeName      string `json:"code_name"`
		Generation    string `json:"generation"`
		MemorySupport string `json:"memory_support"`
	} `json:"architecture"`
	Physical struct {
		Socket      string `json:"socket"`
		Foundry     string `json:"foundry"`
		ProcessSize string `json:"process_size"`
	} `json:"physical"`
	Cache struct {
		L1 string `json:"l1"`
		L2 string `json:"l2"`
		L3 string `json:"l3"`
	} `json:"cache"`
	Performance struct {
		Cores              int    `json:"cores"`
		Threads            int    `json:"threads"`
		IntegratedGraphics string `json:"integrated_graphics"`
		Frequency          string `json:"frequency"`
		TurboClock         string `json:"turbo_clock"`
		BaseClock          string `json:"base_clock"`
		TDP                string `json:"tdp"`
	} `json:"performance"`
	Other struct {
		Market      string `json:"market"`
		ReleaseDate string `json:"release_date"`
	} `json:"other"`
}

func (c CPUSpecs) GetCategory() string { return "CPU" }
func (c CPUSpecs) Validate() error     { return nil }

// GPU Specifications
type GPUSpecs struct {
	Architecture struct {
		CodeName    string `json:"code_name"`
		Generation  string `json:"generation"`
		ProcessSize string `json:"process_size"`
	} `json:"architecture"`
	Physical struct {
		Length    string `json:"length"`
		Width     string `json:"width"`
		Height    string `json:"height"`
		Slots     int    `json:"slots"`
		Weight    string `json:"weight"`
		PowerPins string `json:"power_pins"`
	} `json:"physical"`
	Memory struct {
		Size      string `json:"size"`
		Type      string `json:"type"`
		Bus       string `json:"bus"`
		Bandwidth string `json:"bandwidth"`
	} `json:"memory"`
	Performance struct {
		BaseClock   string `json:"base_clock"`
		BoostClock  string `json:"boost_clock"`
		MemoryClock string `json:"memory_clock"`
		CudaCores   int    `json:"cuda_cores,omitempty"`
		StreamProcs int    `json:"stream_procs,omitempty"`
		RTCores     int    `json:"rt_cores,omitempty"`
		TensorCores int    `json:"tensor_cores,omitempty"`
		TDP         string `json:"tdp"`
	} `json:"performance"`
	Display struct {
		MaxResolution string   `json:"max_resolution"`
		MaxDisplays   int      `json:"max_displays"`
		Outputs       []string `json:"outputs"`
	} `json:"display"`
	Other struct {
		Market      string `json:"market"`
		ReleaseDate string `json:"release_date"`
	} `json:"other"`
}

func (g GPUSpecs) GetCategory() string { return "GPU" }
func (g GPUSpecs) Validate() error     { return nil }

// Mainboard Specifications
type MainboardSpecs struct {
	Physical struct {
		FormFactor string `json:"form_factor"`
		Length     string `json:"length"`
		Width      string `json:"width"`
	} `json:"physical"`
	Chipset struct {
		Name         string `json:"name"`
		Manufacturer string `json:"manufacturer"`
	} `json:"chipset"`
	CPU struct {
		Socket        string   `json:"socket"`
		SupportedCPUs []string `json:"supported_cpus"`
	} `json:"cpu"`
	Memory struct {
		Type        string `json:"type"`
		MaxCapacity string `json:"max_capacity"`
		Slots       int    `json:"slots"`
		MaxSpeed    string `json:"max_speed"`
	} `json:"memory"`
	Expansion struct {
		PCIeSlots []struct {
			Version string `json:"version"`
			Lanes   string `json:"lanes"`
			Count   int    `json:"count"`
		} `json:"pcie_slots"`
		OtherSlots []string `json:"other_slots"`
	} `json:"expansion"`
	Storage struct {
		SATAPorts int `json:"sata_ports"`
		M2Slots   []struct {
			KeyType    string `json:"key_type"`
			Length     string `json:"length"`
			Interface  string `json:"interface"`
			Generation string `json:"generation"`
		} `json:"m2_slots"`
	} `json:"storage"`
	Connectivity struct {
		Ethernet []string `json:"ethernet"`
		WiFi     string   `json:"wifi"`
		USB      struct {
			USB2 int `json:"usb2"`
			USB3 int `json:"usb3"`
			USBC int `json:"usbc"`
		} `json:"usb"`
		Audio   []string `json:"audio"`
		Display []string `json:"display"`
	} `json:"connectivity"`
	Other struct {
		RGBLighting bool   `json:"rgb_lighting"`
		ReleaseDate string `json:"release_date"`
	} `json:"other"`
}

func (m MainboardSpecs) GetCategory() string { return "Mainboard" }
func (m MainboardSpecs) Validate() error     { return nil }

// RAM Specifications
type RAMSpecs struct {
	Physical struct {
		FormFactor string `json:"form_factor"`
		Modules    int    `json:"modules"`
	} `json:"physical"`
	Memory struct {
		Type      string `json:"type"`
		Capacity  string `json:"capacity"`
		PerModule string `json:"per_module"`
	} `json:"memory"`
	Performance struct {
		Speed   string `json:"speed"`
		Latency string `json:"latency"`
		Voltage string `json:"voltage"`
		Timing  string `json:"timing"`
	} `json:"performance"`
	Other struct {
		RGBLighting bool   `json:"rgb_lighting"`
		HeatSink    bool   `json:"heat_sink"`
		ReleaseDate string `json:"release_date"`
	} `json:"other"`
}

func (r RAMSpecs) GetCategory() string { return "RAM" }
func (r RAMSpecs) Validate() error     { return nil }

// Storage Specifications
type StorageSpecs struct {
	Physical struct {
		Type       string `json:"type"` // SSD, HDD, NVMe
		FormFactor string `json:"form_factor"`
		Interface  string `json:"interface"`
		Capacity   string `json:"capacity"`
	} `json:"physical"`
	Performance struct {
		ReadSpeed  string `json:"read_speed"`
		WriteSpeed string `json:"write_speed"`
		IOPS       string `json:"iops"`
		Latency    string `json:"latency"`
		Endurance  string `json:"endurance"`
	} `json:"performance"`
	Features struct {
		Encryption bool   `json:"encryption"`
		Cache      string `json:"cache"`
		Controller string `json:"controller"`
	} `json:"features"`
	Other struct {
		Warranty    string `json:"warranty"`
		ReleaseDate string `json:"release_date"`
	} `json:"other"`
}

func (s StorageSpecs) GetCategory() string { return "Storage" }
func (s StorageSpecs) Validate() error     { return nil }

// PSU Specifications
type PSUSpecs struct {
	Physical struct {
		FormFactor string `json:"form_factor"`
		Length     string `json:"length"`
		Width      string `json:"width"`
		Height     string `json:"height"`
		Weight     string `json:"weight"`
	} `json:"physical"`
	Power struct {
		Wattage       string `json:"wattage"`
		Efficiency    string `json:"efficiency"`
		Certification string `json:"certification"`
		Modular       bool   `json:"modular"`
	} `json:"power"`
	Connectors struct {
		Motherboard string `json:"motherboard"`
		CPU         string `json:"cpu"`
		PCIe        string `json:"pcie"`
		SATA        string `json:"sata"`
		Molex       string `json:"molex"`
	} `json:"connectors"`
	Other struct {
		FanSize     string `json:"fan_size"`
		Warranty    string `json:"warranty"`
		ReleaseDate string `json:"release_date"`
	} `json:"other"`
}

func (p PSUSpecs) GetCategory() string { return "PSU" }
func (p PSUSpecs) Validate() error     { return nil }
