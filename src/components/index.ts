/**
 * 这个文件作为组件的目录
 * 目的是统一管理对外输出的组件，方便分类
 */
/**
 * 布局组件
 */
import Footer from './Footer';
import IconDisplay from './IconDisplay';
import { getIconComponent } from './IconDisplay/getIconComponent';
import { SelectLang, SettingButton } from './RightContent';
import { AvatarDropdown, AvatarName } from './RightContent/AvatarDropdown';

export {
  AvatarDropdown,
  AvatarName,
  Footer,
  SelectLang,
  SettingButton,
  IconDisplay,
  getIconComponent,
};
