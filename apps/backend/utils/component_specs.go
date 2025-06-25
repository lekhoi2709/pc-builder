package utils

import (
	"encoding/json"
	"fmt"
	"pc-builder/backend/api/models"
)

func ValidateSpecsByCategory(category string, specsMap map[string]interface{}) (models.Specs, error) {
	// Convert map to JSON bytes
	specsJSON, err := json.Marshal(specsMap)
	if err != nil {
		return nil, err
	}

	switch category {
	case "CPU":
		var cpuSpecs models.CPUSpecs
		if err := json.Unmarshal(specsJSON, &cpuSpecs); err != nil {
			return nil, err
		}
		return cpuSpecs, nil

	case "GPU":
		var gpuSpecs models.GPUSpecs
		if err := json.Unmarshal(specsJSON, &gpuSpecs); err != nil {
			return nil, err
		}
		return gpuSpecs, nil

	case "MAINBOARD":
		var mainboardSpecs models.MainboardSpecs
		if err := json.Unmarshal(specsJSON, &mainboardSpecs); err != nil {
			return nil, err
		}
		return mainboardSpecs, nil

	case "RAM":
		var ramSpecs models.RAMSpecs
		if err := json.Unmarshal(specsJSON, &ramSpecs); err != nil {
			return nil, err
		}
		return ramSpecs, nil

	case "STORAGE":
		var storageSpecs models.StorageSpecs
		if err := json.Unmarshal(specsJSON, &storageSpecs); err != nil {
			return nil, err
		}
		return storageSpecs, nil

	case "PSU":
		var psuSpecs models.PSUSpecs
		if err := json.Unmarshal(specsJSON, &psuSpecs); err != nil {
			return nil, err
		}
		return psuSpecs, nil

	default:
		return nil, nil
	}
}

// validatePrice validates the price array
func ValidatePrice(prices models.Price) error {
	for _, price := range prices {
		if price.Currency == "" {
			return fmt.Errorf("currency is required for all price items")
		}
		if price.Amount < 0 {
			return fmt.Errorf("price amount cannot be negative")
		}
	}
	return nil
}
