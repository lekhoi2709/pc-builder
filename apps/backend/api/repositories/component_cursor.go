package repositories

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"regexp"
	"strings"
)

type ComponentCursor struct {
	Name     string
	ID       string
	Order    string
	Price    string
	Currency string
}

var cursorPricePattern = regexp.MustCompile(`^(?:-?[0-9]+(?:\.[0-9]+)?|Infinity|-Infinity|NaN)$`)

func ParseComponentCursor(token string, filters ComponentFilter) (*ComponentCursor, error) {
	var cursor ComponentCursor
	if len(token) <= 8192 && cursorOrder(filters) {
		data, err := base64.RawURLEncoding.DecodeString(token)
		if err == nil && json.Unmarshal(data, &cursor) == nil &&
			cursor.ID != "" && cursor.Order == filters.SortOrder &&
			!strings.ContainsRune(cursor.ID, 0) && !strings.ContainsRune(cursor.Name, 0) &&
			((filters.SortBy == "name" && cursor.Currency == "" && cursor.Price == "") ||
				(filters.SortBy == "price" && cursor.Currency == indexedPrice(filters) && cursorPricePattern.MatchString(cursor.Price))) {
			return &cursor, nil
		}
	}
	return nil, errors.New("invalid cursor for this sort")
}

func cursorOrder(filters ComponentFilter) bool {
	return (filters.SortBy == "name" || filters.SortBy == "price" && indexedPrice(filters) != "") &&
		(filters.SortOrder == "asc" || filters.SortOrder == "desc")
}

func indexedPrice(filters ComponentFilter) string {
	switch filters.Currency {
	case "", "VND":
		return "components.price_vnd"
	case "USD":
		return "components.price_usd"
	default:
		return ""
	}
}

func priceSortExpression(column string) string {
	return "COALESCE(" + column + ", 'Infinity'::numeric)"
}
