import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext'; // Import useCurrency

const MobileShippingComponent = () => {
  const { 
    selectedCountry, 
    setSelectedCountry, 
    exchangeRates,
    getCurrencyInfo 
  } = useCurrency(); // Get currency context values
  
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryRef = useRef(null);

  // Toggle country dropdown
  const toggleCountryDropdown = () => {
    setIsCountryOpen(!isCountryOpen);
  };

  // Handle country change
  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode); // This will trigger currency conversion
    setIsCountryOpen(false);
    
    // Show success message
    if (window.toast) {
      const countryName = getCountryName(countryCode);
      const currencyInfo = exchangeRates[countryCode] || exchangeRates.PK;
      window.toast.success(`Shipping to ${countryName} (${currencyInfo.currency})`, "success");
    }
  };

  // Get current country flag
  const getCurrentCountryFlag = () => {
    return exchangeRates[selectedCountry]?.flag || '🇵🇰';
  };

  // Get country name from code
  const getCountryName = (code) => {
    const countryNames = {
      'PK': 'Pakistan',
      'US': 'United States',
      'AE': 'United Arab Emirates',
      'UK': 'United Kingdom',
      'SA': 'Saudi Arabia',
      'CA': 'Canada',
      'AU': 'Australia',
      'EU': 'European Union'
    };
    return countryNames[code] || code;
  };

  // Get currency info for display
  const getCurrencyDisplay = () => {
    const info = getCurrencyInfo();
    return `${info.symbol} ${info.currency}`;
  };

  // Convert exchangeRates object to countries array
  const countries = Object.keys(exchangeRates).map(code => ({
    code,
    name: getCountryName(code),
    flag: exchangeRates[code].flag,
    currency: exchangeRates[code].currency,
    symbol: exchangeRates[code].symbol
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mobile-shipping-main" ref={countryRef}>
      <button 
        className="mobile-shipping-main-btn"
        onClick={toggleCountryDropdown}
        aria-label="Change shipping country"
      >
        <span className="shipping-main-flag">{getCurrentCountryFlag()}</span>
        <span className="shipping-main-label">Ship to</span>
        <span className="shipping-main-currency">{getCurrencyDisplay()}</span>
      </button>
      
      {/* Country Dropdown */}
      <div className={`mobile-country-main-dropdown ${isCountryOpen ? 'active' : ''}`}>
        <div className="country-main-dropdown-header">
          <span>Select Shipping Country</span>
          <p className="country-main-dropdown-subtitle">
            Prices will be converted to local currency
          </p>
        </div>
        <div className="country-main-dropdown-list">
          {countries.map((country) => (
            <button
              key={country.code}
              className={`country-main-dropdown-item ${selectedCountry === country.code ? 'selected' : ''}`}
              onClick={() => handleCountryChange(country.code)}
              aria-label={`Ship to ${country.name}`}
            >
              <div className="country-main-left">
                <span className="country-main-flag">{country.flag}</span>
                <div className="country-main-info">
                  <span className="country-main-name">{country.name}</span>
                  <span className="country-main-currency-small">
                    {country.symbol} {country.currency}
                  </span>
                </div>
              </div>
              <div className="country-main-right">
                <span className="country-main-code">{country.code}</span>
                {selectedCountry === country.code && (
                  <span className="country-main-selected-indicator">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="country-main-dropdown-footer">
          <p className="country-main-note">
            * All prices are converted from PKR based on current exchange rates
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileShippingComponent;