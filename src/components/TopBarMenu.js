import React from 'react';
import './styles/TopBarMenu.css';
import { useTranslation } from 'react-i18next';
import AuthService from "../services/auth.service";

function TopBarMenu({ onComponentChange }) {
  const { t } = useTranslation();

  const logOut = () => {
    AuthService.logout();
  };

  //==============================
  //===== CHECK USER ROLE =======
  //==============================

  const currentUser = AuthService.getCurrentUser();
  const isAdminOrManager = currentUser && (currentUser.roles.includes("ROLE_ADMIN") || currentUser.roles.includes("ROLE_MANAGER"));
  
  return (
    <div className="TopBarMenu">
      <div className="top-row">
        <img src="./images/LogoCarPal(Croped).png" alt="CarPal Logo" />
        <span>{t('welcome')}<b>CarPal !</b></span>
        <div className="top-row-links">
        <div>
        <button onClick={() => onComponentChange('vehicles')} className="vehicles-btn">🚗 {t('vehicles')}</button>
        {isAdminOrManager && (
        <button onClick={() => onComponentChange('newvehicleform')} className="vehicles-btn">{t('addNew')}</button>
        )}
        <div>
        </div>
        <button onClick={() => onComponentChange('drivers')} className="drivers-btn">🤵 {t('drivers')}</button>
        {isAdminOrManager && (
        <button onClick={() => onComponentChange('newdriverform')} className="drivers-btn">{t('addNew')}</button>
        )}
        </div>
        </div>
      </div>
      <div className="bottom-row">
        <nav>
          <ul>
            <li>🗒️{t('about')}</li>
            <li onClick={() => onComponentChange('petrolstation')}>⛽{t('petrolStation')}</li>
            <li onClick={() => onComponentChange('parking')}>🅿️{t('parking')}</li>
            <li onClick={() => onComponentChange('settings')}>🛠️{t('settings')}</li>
            <li onClick={() => onComponentChange('help')}>🆘{t('help')}</li>
            <li><a href="/login" onClick={logOut}>👤 {t('logout')}</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default TopBarMenu;
