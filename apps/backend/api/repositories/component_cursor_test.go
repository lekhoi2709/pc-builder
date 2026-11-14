package repositories

import (
	"encoding/base64"
	"testing"
)

func TestParseComponentCursor(t *testing.T) {
	token := base64.RawURLEncoding.EncodeToString([]byte(`{"Name":"CPU Édition","ID":"cpu-x","Order":"asc"}`))

	t.Run("givenNameCursor_whenParsingSameOrder_thenReturnsBoundary", func(t *testing.T) {
		got, err := ParseComponentCursor(token, ComponentFilter{SortBy: "name", SortOrder: "asc"})

		want := ComponentCursor{Name: "CPU Édition", ID: "cpu-x", Order: "asc"}
		if err != nil || got == nil || *got != want {
			t.Fatalf("got %v, err %v, want %v", got, err, want)
		}
	})

	t.Run("givenNameCursor_whenParsingOppositeOrder_thenRejectsToken", func(t *testing.T) {
		_, err := ParseComponentCursor(token, ComponentFilter{SortBy: "name", SortOrder: "desc"})

		if err == nil {
			t.Fatal("expected an error for a cursor created with the opposite order")
		}
	})
}

func TestParsePriceCursor(t *testing.T) {
	token := base64.RawURLEncoding.EncodeToString([]byte(`{"ID":"cpu-x","Order":"asc","Price":"249.90","Currency":"components.price_vnd"}`))

	t.Run("givenVNDCursor_whenParsingVNDOrder_thenPreservesExactPrice", func(t *testing.T) {
		got, err := ParseComponentCursor(token, ComponentFilter{SortBy: "price", SortOrder: "asc", Currency: "VND"})

		if err != nil || got == nil || got.Price != "249.90" {
			t.Fatalf("got %v, err %v, want exact price 249.90", got, err)
		}
	})

	t.Run("givenVNDCursor_whenParsingUSDOrder_thenRejectsToken", func(t *testing.T) {
		_, err := ParseComponentCursor(token, ComponentFilter{SortBy: "price", SortOrder: "asc", Currency: "USD"})

		if err == nil {
			t.Fatal("expected an error for a cursor from a different currency")
		}
	})
}
