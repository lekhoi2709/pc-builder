import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useComponentStore } from '../stores/componentStore';
import type { ComponentFilter } from '../types/components';

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialMinValue?: number;
  initialMaxValue?: number;
  currency?: string;
  onChange?: (minValue: number, maxValue: number) => void;
}

const currencyToSymbol: { [key: string]: string } = {
  VND: '₫',
  USD: '$',
};

const currencyToLocale: Record<string, string> = {
  USD: 'en-US',
  VND: 'vi-VN',
};

const PriceRangeSlider = memo(
  ({
    min = 0,
    max = 1000,
    step = 100,
    currency = 'VND',
    onChange,
  }: PriceRangeSliderProps) => {
    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);
    const [minInputValue, setMinInputValue] = useState(String(min));
    const [maxInputValue, setMaxInputValue] = useState(String(max));
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const { filters, setFilters } = useComponentStore();

    // Sync slider state with store filters
    useEffect(() => {
      const storeMinPrice = filters.min_price;
      const storeMaxPrice = filters.max_price;

      // Reset to min/max if filters are cleared
      if (storeMinPrice === undefined && storeMaxPrice === undefined) {
        setMinValue(min);
        setMaxValue(max);
        setMinInputValue(String(min));
        setMaxInputValue(String(max));
      } else {
        // Update slider to match store values if they exist
        if (storeMinPrice !== undefined && storeMinPrice !== minValue) {
          setMinValue(storeMinPrice);
          setMinInputValue(String(storeMinPrice));
        }
        if (storeMaxPrice !== undefined && storeMaxPrice !== maxValue) {
          setMaxValue(storeMaxPrice);
          setMaxInputValue(String(storeMaxPrice));
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.min_price, filters.max_price, min, max]);

    // Reset slider when min/max props change
    useEffect(() => {
      if (!filters.min_price && !filters.max_price) {
        setMinValue(min);
        setMaxValue(max);
        setMinInputValue(String(min));
        setMaxInputValue(String(max));
      }
    }, [min, max, filters.min_price, filters.max_price]);

    if (currency === 'VND') {
      step = 100000;
    }

    const sliderRef = useRef<HTMLDivElement>(null);

    const getPercentage = (value: number) =>
      ((value - min) / (max - min)) * 100;

    const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(type);
    };

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = Math.max(
          0,
          Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
        );
        const newValue =
          Math.round(((percentage / 100) * (max - min) + min) / step) * step;

        if (isDragging === 'min') {
          const clampedValue = Math.max(
            min,
            Math.min(newValue, maxValue - step)
          );
          setMinValue(clampedValue);
          setMinInputValue(String(clampedValue));
          onChange?.(clampedValue, maxValue);
        } else if (isDragging === 'max') {
          const clampedValue = Math.min(
            max,
            Math.max(newValue, minValue + step)
          );
          setMaxValue(clampedValue);
          setMaxInputValue(String(clampedValue));
          onChange?.(minValue, clampedValue);
        }
      },
      [isDragging, min, max, step, minValue, maxValue, onChange]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(null);
    }, []);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const validateAndLimitInput = (value: string): string => {
      // Remove any non-numeric characters except for leading minus sign
      let cleanValue = value.replace(/[^0-9-]/g, '');

      // Handle negative sign (only allow at the beginning)
      if (cleanValue.includes('-')) {
        const negativeCount = cleanValue.split('-').length - 1;
        if (
          negativeCount > 1 ||
          (cleanValue.indexOf('-') !== 0 && cleanValue.includes('-'))
        ) {
          cleanValue = cleanValue.replace(/-/g, '');
        }
      }

      // Remove leading zeros but keep single zero
      if (
        cleanValue.length > 1 &&
        cleanValue.startsWith('0') &&
        !cleanValue.startsWith('0.')
      ) {
        cleanValue = cleanValue.replace(/^0+/, '');
        if (cleanValue === '') cleanValue = '0';
      }

      // Limit to 10 digits (not including minus sign)
      const limitedNums = currency !== 'VND' ? 7 : 12;
      const digitsOnly = cleanValue.replace('-', '');
      if (digitsOnly.length > limitedNums) {
        const isNegative = cleanValue.startsWith('-');
        const limitedDigits = digitsOnly.substring(0, limitedNums);
        cleanValue = isNegative ? '-' + limitedDigits : limitedDigits;
      }

      return cleanValue;
    };

    const handleInputChange = (type: 'min' | 'max', value: string) => {
      // Validate and limit the input first
      const validatedValue = validateAndLimitInput(value);

      // Update the display value immediately (allows empty string)
      if (type === 'min') {
        setMinInputValue(validatedValue);
      } else {
        setMaxInputValue(validatedValue);
      }

      // Only update the actual values and call onChange if the input is not empty
      if (validatedValue.trim() === '' || validatedValue === '-') {
        return; // Don't update slider values for empty input or just minus sign
      }

      const numValue = parseFloat(validatedValue);

      // Validate that it's a valid number
      if (isNaN(numValue)) {
        return;
      }

      // Additional validation to ensure the number doesn't exceed reasonable bounds
      const maxSafeValue = currency !== 'VND' ? 9999999 : 999999999999;
      if (Math.abs(numValue) > maxSafeValue) {
        return;
      }

      if (type === 'min') {
        const clampedValue = Math.max(min, Math.min(numValue, maxValue - step));
        setMinValue(clampedValue);
        onChange?.(clampedValue, maxValue);
      } else {
        const clampedValue = Math.min(max, Math.max(numValue, minValue + step));
        setMaxValue(clampedValue);
        onChange?.(minValue, clampedValue);
      }
    };

    const minPercentage = getPercentage(minValue);
    const maxPercentage = getPercentage(maxValue);

    const priceFormatter = (
      value: number,
      locale: string,
      style: 'decimal' | 'currency' | 'percent' | 'unit' = 'currency'
    ) => {
      const formatter = new Intl.NumberFormat(locale, {
        style: style,
        currency,
      });
      return formatter.format(value);
    };

    return (
      <div className="mt-4 flex flex-col gap-4">
        {/* Slider */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="bg-accent-600/20 dark:bg-accent-400/20 relative h-2 cursor-pointer rounded-full"
          >
            {/* Range Track */}
            <div
              className="bg-accent-200 dark:bg-accent-400/80 absolute h-2 rounded-full"
              style={{
                left: `${minPercentage}%`,
                right: `${100 - maxPercentage}%`,
              }}
            />

            {/* Min Handle */}
            <div
              className={`border-primary-500 absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform cursor-grab rounded-full border-2 bg-white shadow-md transition-shadow hover:shadow-lg ${
                isDragging === 'min' ? 'scale-110 cursor-grabbing' : ''
              }`}
              style={{ left: `${minPercentage}%` }}
              onMouseDown={handleMouseDown('min')}
            />

            {/* Max Handle */}
            <div
              className={`border-primary-500 absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform cursor-grab rounded-full border-2 bg-white shadow-md transition-shadow hover:shadow-lg ${
                isDragging === 'max' ? 'scale-110 cursor-grabbing' : ''
              }`}
              style={{ left: `${maxPercentage}%` }}
              onMouseDown={handleMouseDown('max')}
            />
          </div>
        </div>

        {/* Input Fields */}
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500">
                {currencyToSymbol[currency] || currency}
              </span>
              <input
                type="text"
                value={priceFormatter(
                  parseInt(minInputValue) || 0,
                  currencyToLocale[currency],
                  'decimal'
                )}
                onChange={e => handleInputChange('min', e.target.value)}
                className="border-light-elevated dark:border-dark-elevated border-1 bg-light-elevated dark:bg-dark-elevated focus:ring-secondary-300 dark:focus:ring-secondary-500 w-full rounded-md py-2 pl-8 pr-3 focus:border-transparent focus:outline-none focus:ring-1"
                min={min}
                max={maxValue - step}
                placeholder={String(min)}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={12}
              />
            </div>
          </div>
          <p className="text-2xl">-</p>
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500">
                {currencyToSymbol[currency] || currency}
              </span>
              <input
                type="text"
                value={priceFormatter(
                  parseInt(maxInputValue) || 0,
                  currencyToLocale[currency],
                  'decimal'
                )}
                onChange={e => handleInputChange('max', e.target.value)}
                className="border-light-elevated dark:border-dark-elevated border-1 bg-light-elevated dark:bg-dark-elevated focus:ring-secondary-300 dark:focus:ring-secondary-500 w-full rounded-md py-2 pl-8 pr-3 focus:border-transparent focus:outline-none focus:ring-1"
                min={min}
                max={max}
                placeholder={String(max)}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={12}
              />
            </div>
          </div>
        </div>
        <button
          className="bg-accent-200 dark:bg-accent-400/80 dark:hover:bg-accent-400/50 hover:bg-accent-300 border-primary-600/50 dark:border-primary-400/50 dark:bg-primary-800/50 flex w-full cursor-pointer items-center justify-center rounded p-4 py-2 transition-colors duration-300 ease-in-out"
          onClick={() => {
            setFilters({
              ...(filters as ComponentFilter),
              min_price: minValue,
              max_price: maxValue,
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Apply Price
        </button>
      </div>
    );
  }
);

export default PriceRangeSlider;
