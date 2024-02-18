import React from 'react';
import './styles/Help.css';
import { useTranslation } from 'react-i18next';

function Settings() {
  const { t } = useTranslation();
  const handleRoadsideAssistanceClick = () => {
    window.location.href = 'tel:+37062594862';
  };
  const handleFileButtonClick = () => {
    window.open('/files/Eismo_ivykio_deklaracija.pdf', '_blank');
  };
  
  const handleFileButtonClick2 = () => {
    // Assuming 'Eismo_ivykio_deklaracija.pdf' is in the public folder
    window.open('/files/pirkimo-pardavimo-sutarties-forma.pdf', '_blank');
  };

  return (
    <div className="help-container">
      <div className="help">
        <span>{t('roadside assistance')}</span>
        <button onClick={handleRoadsideAssistanceClick}>{t('call')}</button>
      </div>
      <div className="help">
        <span>{t('accident declaration')}</span>
        <button onClick={handleFileButtonClick}>{t('open file')}</button>
      </div>
      <div className="help">
        <span>{t('sale/purchase agreement')}</span>
        <button onClick={handleFileButtonClick2}>{t('open file')}</button>
      </div>
    </div>
  );
}

export default Settings;
