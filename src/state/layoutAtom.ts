import { atom } from 'jotai';
import { ExtendedLayoutItem } from '../Components/DnDLayout/GridTile';
import { WidgetTypes } from '../Components/Widgets/widgetTypes';
import { widgetDefaultHeight, widgetDefaultWidth, widgetMaxHeight, widgetMinHeight } from '../Components/Widgets/widgetDefaults';

const initialLayout = [
  { title: 'Widget 1', i: 'LargeWidget#lw1', x: 0, y: 0 },
  { title: 'Widget 1', i: 'LargeWidget#lw2', x: 0, y: 1 },
  { title: 'Widget 1', i: 'LargeWidget#lw3', x: 0, y: 2 },
  { title: 'Widget 1', i: 'MediumWidget#mw1', x: 4, y: 2 },
  { title: 'Widget 1', i: 'SmallWidget#sw1', x: 4, y: 0 },
  { title: 'Widget 1', i: 'SmallWidget#sw2', x: 4, y: 1 },
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

export const layoutAtom = atom<ExtendedLayoutItem[]>(initialLayout);

export const prevLayoutAtom = atom<ExtendedLayoutItem[]>(initialLayout);
