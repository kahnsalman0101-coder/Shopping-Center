import React, { createContext, useState, useContext, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('PK');
  const [currencySymbol, setCurrencySymbol] = useState('₨');

  // Define exchange rates for different countries (relative to PKR)
  const exchangeRates = {
    PK: { rate: 1, symbol: '₨', currency: 'PKR', flag: '🇵🇰', name: 'Pakistan' },
    US: { rate: 0.0036, symbol: '$', currency: 'USD', flag: '🇺🇸', name: 'United States' },
    AE: { rate: 0.013, symbol: 'د.إ', currency: 'AED', flag: '🇦🇪', name: 'UAE' },
    UK: { rate: 0.0028, symbol: '£', currency: 'GBP', flag: '🇬🇧', name: 'UK' },
    SA: { rate: 0.014, symbol: 'ر.س', currency: 'SAR', flag: '🇸🇦', name: 'Saudi Arabia' },
    CA: { rate: 0.0048, symbol: '$', currency: 'CAD', flag: '🇨🇦', name: 'Canada' },
    AU: { rate: 0.0052, symbol: '$', currency: 'AUD', flag: '🇦🇺', name: 'Australia' },
    EU: { rate: 0.0032, symbol: '€', currency: 'EUR', flag: '🇪🇺', name: 'Europe' }
  };

  // Function to convert price from PKR to selected currency
  const convertPrice = (priceInPKR) => {
    const rateInfo = exchangeRates[selectedCountry] || exchangeRates.PK;
    return Math.round(priceInPKR * rateInfo.rate);
  };

  // Function to get currency info
  const getCurrencyInfo = () => {
    return exchangeRates[selectedCountry] || exchangeRates.PK;
  };

  // Function to update country
  const updateCountry = (countryCode) => {
    setSelectedCountry(countryCode);
    localStorage.setItem('selectedCountry', countryCode);
  };

  // Get countries array
  const countries = Object.keys(exchangeRates).map(code => ({
    code,
    name: exchangeRates[code].name,
    flag: exchangeRates[code].flag,
    currency: exchangeRates[code].currency,
    symbol: exchangeRates[code].symbol
  }));

  // Load saved country preference on mount
  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry && exchangeRates[savedCountry]) {
      setSelectedCountry(savedCountry);
      setCurrencySymbol(exchangeRates[savedCountry].symbol);
    }
  }, []);

  // Update currency symbol when country changes
  useEffect(() => {
    const rateInfo = exchangeRates[selectedCountry] || exchangeRates.PK;
    setCurrencySymbol(rateInfo.symbol);
  }, [selectedCountry]);

  return (
    <CurrencyContext.Provider value={{
      selectedCountry,
      setSelectedCountry: updateCountry,
      convertPrice,
      currencySymbol,
      getCurrencyInfo,
      exchangeRates,
      countries
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};