import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Shield, User, History, Share, Route } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AppFooter: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-12 px-6 bg-secondary/50 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2">
              <Truck size={20} className="text-primary" />
              <span className="font-semibold text-lg">{t('companyName')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footerDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">{t('navigation')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('navHome')}
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('navTrack')}
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Shield size={14} />
                    <span>{t('adminArea')}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/driver-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <User size={14} />
                    <span>{t('drivers')}</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">{t('drivers')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/driver-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Route size={14} />
                    <span>{t('onTrip')}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/driver-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <History size={14} />
                    <span>{t('tripHistory')}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/driver-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Share size={14} />
                    <span>{t('shareLocation')}</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">{t('contact')}</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} />
                  <span>{t('emergency')} 555-123-4567</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {t('companyName')}. {t('allRightsReserved')}
          </p>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('terms')}
            </Link>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('privacy')}
            </Link>
            <Link to="/login" className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <Shield size={12} />
              <span>{t('adminArea')}</span>
            </Link>
            <Link to="/driver-login" className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <User size={12} />
              <span>{t('driversArea')}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
