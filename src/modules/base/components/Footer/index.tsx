import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const company = process.env.UMI_APP_COMPANY || 'GPAdmin';
  const startYear = process.env.UMI_APP_COPYRIGHT_START_YEAR || '2025';
  const currentYear = new Date().getFullYear();
  const copyrightYear =
    startYear === currentYear.toString()
      ? startYear
      : `${startYear}-${currentYear}`;
  const copyright = `${copyrightYear} Powered by ${company}`;

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={copyright}
      links={[]}
    />
  );
};

export default Footer;
