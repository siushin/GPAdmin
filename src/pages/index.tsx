import { history } from '@umijs/max';
import { useEffect } from 'react';

const Index: React.FC = () => {
  useEffect(() => {
    // 重定向到 /workbench
    history.replace('/workbench');
  }, []);

  return null;
};

export default Index;
