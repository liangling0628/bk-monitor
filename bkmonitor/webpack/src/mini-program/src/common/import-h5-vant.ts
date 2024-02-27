import {
  Button,
  IndexBar,
  IndexAnchor,
  Cell,
  NavBar,
  Icon,
  Tab,
  Tabs,
  Collapse,
  CollapseItem,
  Dialog,
  Search,
  DropdownItem,
  DropdownMenu,
  Skeleton,
  RadioGroup,
  Radio,
  DatetimePicker,
  Popup,
  Picker,
  Field,
} from 'vant';
import { App } from 'vue';
export const useVantH5Component = (app: App) => {
  app.component(Button.name, Button);
  app.component(IndexBar.name, IndexBar);
  app.component(IndexAnchor.name, IndexAnchor);
  app.component(Cell.name, Cell);
  app.component(NavBar.name, NavBar);
  app.component(Icon.name, Icon);
  app.component(Tab.name, Tab);
  app.component(Tabs.name, Tabs);
  app.component(Collapse.name, Collapse);
  app.component(CollapseItem.name, CollapseItem);
  app.component(Dialog.Component.name, Dialog.Component);
  app.component(Search.name, Search);
  app.component(DropdownMenu.name, DropdownMenu);
  app.component(DropdownItem.name, DropdownItem);
  app.component(Skeleton.name, Skeleton);
  app.component(RadioGroup.name, RadioGroup);
  app.component(Radio.name, Radio);
  app.component(DatetimePicker.name, DatetimePicker);
  app.component(Popup.name, Popup);
  app.component(Picker.name, Picker);
  app.component(Field.name, Field);
};
