import { SelectLang as UmiSelectLang } from '@umijs/max';
import { SettingButton } from './SettingButton';

export type SiderTheme = 'light' | 'dark';

export const SelectLang: React.FC = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export { SettingButton };
