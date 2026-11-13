package controllers

import (
	"encoding/json"
	"pc-builder/backend/api/models"
	"reflect"
	"strings"
	"testing"
)

func TestSpecsEncoding(t *testing.T) {
	for _, tc := range []struct {
		name  string
		input map[string]interface{}
		want  []models.ComponentSpec
	}{
		{
			name:  "givenMixedValues_whenEncodingSpecs_thenPreservesStringsAndFilterability",
			input: map[string]interface{}{"socket": "AM5", "cores": 8},
			want: []models.ComponentSpec{
				{Key: "cores", Value: "8"},
				{Key: "socket", Value: "AM5", IsFilterable: true},
			},
		},
		{
			name: "givenMissingSpecs_whenEncodingSpecs_thenReturnsEmptyArray",
			want: []models.ComponentSpec{},
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			encoded, err := encodeSpecs(tc.input)
			if err != nil {
				t.Fatal(err)
			}

			var got []models.ComponentSpec
			if err := json.Unmarshal(encoded, &got); err != nil {
				t.Fatal(err)
			}
			if !reflect.DeepEqual(got, tc.want) {
				t.Fatalf("got %#v, want %#v", got, tc.want)
			}
		})
	}

	t.Run("givenOverlongKey_whenEncodingSpecs_thenReturnsError", func(t *testing.T) {
		input := map[string]interface{}{strings.Repeat("á", 101): "value"}

		_, err := encodeSpecs(input)

		if err == nil {
			t.Fatal("expected an error for a key longer than 100 characters")
		}
	})
}
