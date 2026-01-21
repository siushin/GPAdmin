/**
 * 这个文件作为组件的目录
 * 目的是统一管理对外输出的组件，方便分类
 */
/**
 * 布局组件
 */
import Footer from './Footer';
import { SelectLang, SettingButton } from './RightContent';
import { AvatarDropdown, AvatarName } from './RightContent/AvatarDropdown';

/**
 * 从 base 模块重新导出公共组件
 */
export {
  getIconComponent,
  IconDisplay,
  RichTextEditor,
} from '@/modules/base/components';

export { AvatarDropdown, AvatarName, Footer, SelectLang, SettingButton };
