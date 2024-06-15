import React, { createContext, useContext, useState, useEffect } from 'react';
import useSettings from "../../hooks/useSettings";


const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState([]);
  const { getAll: getAllSettings } = useSettings();

  useEffect(() => {
    const fetchSettings = async () => {
        try {
          const fetchedSettings = await getAllSettings();
          setSettings(fetchedSettings);
        } catch (error) {
          console.error('Erro ao carregar configurações:', error);
        }
      };
    
      fetchSettings();
      // eslint-disable-next-line
  }, []); // Certifique-se de definir as dependências apropriadas

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, getAllSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  return useContext(SettingsContext);
};