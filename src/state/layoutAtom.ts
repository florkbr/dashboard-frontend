import { atomWithLocalStorage } from './localStorageHelperAtom';
import { ExtendedLayoutItem } from '../Components/DnDLayout/GridTile';
import { WidgetTypes } from '../Components/Widgets/widgetTypes';
import { widgetDefaultHeight, widgetDefaultWidth, widgetMaxHeight, widgetMinHeight } from '../Components/Widgets/widgetDefaults';
import { isEqual } from 'lodash';

export const initialLayout: ExtendedLayoutItem[] = [
  { title: 'Widget 1', i: 'LargeWidget#lw1', x: 0, y: 0, static: true },
  { title: 'Widget 1', i: 'LargeWidget#lw2', x: 0, y: 1, static: true },
  { title: 'Widget 1', i: 'LargeWidget#lw3', x: 0, y: 2, static: true },
  { title: 'Widget 1', i: 'MediumWidget#mw1', x: 4, y: 2, static: true },
  { title: 'Widget 1', i: 'SmallWidget#sw1', x: 4, y: 0, static: true },
  { title: 'Widget 1', i: 'SmallWidget#sw2', x: 4, y: 1, static: true },
].map((item) => {
  const [widgetType] = getWidgetDefaultSettings(item.i);
  return {
    ...item,
    w: widgetDefaultWidth[widgetType],
    h: widgetDefaultHeight[widgetType],
    maxH: widgetMaxHeight[widgetType],
    minH: widgetMinHeight[widgetType],
    widgetType,
  };
});

function getWidgetDefaultSettings(id: string): [WidgetTypes, string] {
  const [widgetType, i] = id.split('#');
  // we will need some type guards here and schema validation to remove unknown widgets
  return [widgetType as WidgetTypes, i];
}

export function isDefaultLayout(layout: ExtendedLayoutItem[]) {
  return isEqual(initialLayout, layout);
}

export const layoutAtom = atomWithLocalStorage<ExtendedLayoutItem[]>('insights-active-layout', initialLayout);

export const prevLayoutAtom = atomWithLocalStorage<ExtendedLayoutItem[]>('insights-prev-layout', initialLayout);
