import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './root.scss';

const Obstetrics: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h3 >{t('obtetricsWelcome', 'Welcome to Obtetrics Module')}</h3>
        </div>
    )

};

export default Obstetrics;