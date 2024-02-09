import React from 'react';
import './styles/Settings.css';
import { useTranslation } from 'react-i18next';

function Settings({ isDarkMode, onToggleTheme }) {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };
  return (
    <div className="settings-container">
      <div className="setting">
        <span>{t('colorTheme')}</span>
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={onToggleTheme} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="setting">
        <span>{t('language')}</span>
        <select onChange={handleLanguageChange}>
          <option value=""></option>
          <option value="en">{t('en')}</option>
          <option value="lt">{t('lt')}</option>
        </select>
      </div>
    </div>
  );
}

export default Settings;
