import { SelectLang as UmiSelectLang } from '@umijs/max';
import { SettingButton } from './SettingButton';

export type SiderTheme = 'light' | 'dark';

export const SelectLang: React.FC = () => {
  return (
    <UmiSelectLang
      style={{
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    />
  );
};

export { SettingButton };
