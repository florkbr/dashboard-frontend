import { ReactGridLayoutProps, Responsive, WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';

import './GridLayout.css';
import GridTile, { ExtendedLayoutItem, SetWidgetAttribute } from './GridTile';
import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WidgetTypes } from '../Widgets/widgetTypes';
import { widgetDefaultHeight, widgetDefaultWidth, widgetMaxHeight, widgetMinHeight } from '../Widgets/widgetDefaults';
import { atom, useAtom, useAtomValue } from 'jotai';
import { currentDropInItemAtom } from '../../state/currentDropInItemAtom';
import { layoutAtom } from '../../state/layoutAtom';
import React from 'react';

const ResponsiveGridLayout = WidthProvider(Responsive);

const activeItemAtom = atom<string | undefined>(undefined);

function isWidgetType(type: string): type is WidgetTypes {
  return Object.values(WidgetTypes).includes(type as WidgetTypes);
}

const GridLayout = ({ isLocked = false }: { isLocked?: boolean }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [layout, setLayout] = useAtom(layoutAtom);
  const [activeItem, setActiveItem] = useAtom(activeItemAtom);
  const layoutRef = useRef<HTMLDivElement>(null);

  const currentDropInItem = useAtomValue(currentDropInItemAtom);
  const droppingItemTemplate: ReactGridLayoutProps['droppingItem'] = useMemo(() => {
    if (currentDropInItem) {
      return {
        i: '__dropping-elem__',
        w: widgetDefaultWidth[currentDropInItem],
        h: widgetDefaultHeight[currentDropInItem],
        widgetType: currentDropInItem,
        title: 'New title',
      };
    }
  }, [currentDropInItem]);

  const setWidgetAttribute: SetWidgetAttribute = (id, attributeName, value) => {
    setLayout((prev) => prev.map((item) => (item.i === id ? { ...item, [attributeName]: value } : item)));
  };

  const removeWidget = (id: string) => {
    setLayout((prev) => prev.filter((item) => item.i !== id));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop: ReactGridLayoutProps['onDrop'] = (_layout: any, layoutItem: any, event: { preventDefault: () => void }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (event as any).dataTransfer.getData('text');
    // fix placement order
    if (isWidgetType(data)) {
      const newWidget = {
        ...layoutItem,
        // w: layoutItem.x + layoutItem.w > 3 ? 1 : 3,
        // x: 4 % layoutItem.w,
        // x: layoutItem.x + layoutItem.w > 3 ? 3 : 0,
        h: widgetDefaultHeight[data],
        maxH: widgetMaxHeight[data],
        minH: widgetMinHeight[data],
        widgetType: data,
        i: `${data}#${Date.now() + Math.random()}`,
        title: 'New title',
      };
      setLayout((prev) =>
        prev.reduce<ExtendedLayoutItem[]>(
          (acc, curr) => {
            if (curr.x + curr.w > newWidget.x && curr.y + curr.h <= newWidget.y) {
              acc.push(curr);
            } else {
              // Wee need to push the current items down on the Y axis if they are supposed to be below the new widget
              acc.push({ ...curr, y: curr.y + curr.h });
            }

            return acc;
          },
          [newWidget]
        )
      );
    }
    event.preventDefault();
  };

  const activeLayout = useMemo(
    () =>
      layout.map((item) => ({
        ...item,
        locked: isLocked,
      })),
    [isLocked, layout]
  );

  const handleKeyboard = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      setActiveItem((prev) => {
        if (prev === id) {
          return undefined;
        }
        return id;
      });
    }
  };

  const handleArrows = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (!activeItem) {
        return;
      }

      const item = layout.find(({ i }) => i === activeItem);
      if (!item) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      if (e.code === 'ArrowUp') {
        setLayout((prev) =>
          prev.map((layoutItem) => {
            if (layoutItem.i === activeItem) {
              return {
                ...layoutItem,
                y: Math.max(layoutItem.y - 1, 0),
              };
            }
            return layoutItem;
          })
        );
      }

      if (e.code === 'ArrowDown') {
        setLayout((prev) =>
          prev.map((layoutItem) => {
            if (layoutItem.i === activeItem) {
              return {
                ...layoutItem,
                y: layoutItem.y + 1,
              };
            }
            return layoutItem;
          })
        );
      }

      if (e.code === 'ArrowLeft') {
        setLayout((prev) =>
          prev.map((layoutItem) => {
            if (layoutItem.i === activeItem) {
              return {
                ...layoutItem,
                x: Math.max(layoutItem.x - 1, 0),
              };
            }
            return layoutItem;
          })
        );
      }

      if (e.code === 'ArrowRight') {
        setLayout((prev) =>
          prev.map((layoutItem) => {
            if (layoutItem.i === activeItem) {
              return {
                ...layoutItem,
                x: layoutItem.x + 1,
              };
            }
            return layoutItem;
          })
        );
      }
    },
    [activeItem]
  );

  useEffect(() => {
    if (activeItem && layoutRef.current) {
      layoutRef.current.addEventListener('keydown', handleArrows);
    }
    return () => {
      layoutRef.current?.removeEventListener('keydown', handleArrows);
    };
  }, [activeItem]);

  return (
    // {/* relative position is required for the grid layout to properly calculate
    // child translation while dragging is in progress */}
    <div style={{ position: 'relative' }} ref={layoutRef}>
      <ResponsiveGridLayout
        className="layout"
        draggableHandle=".drag-handle"
        layouts={{ lg: activeLayout }}
        // autoSize={isLocked}
        // cols={4}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
        rowHeight={88}
        width={1200}
        isDraggable={!isLocked}
        isResizable={!isLocked}
        resizeHandles={['se']}
        // add droppping item default based on dragged template
        droppingItem={droppingItemTemplate}
        isDroppable={!isLocked}
        onDrop={onDrop}
        useCSSTransforms
        verticalCompact
        onLayoutChange={(newLayout: ExtendedLayoutItem[]) => {
          if (isLocked) {
            return;
          }
          setLayout(newLayout.filter(({ i }) => i !== '__dropping-elem__'));
        }}
      >
        {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          activeLayout.map(({ widgetType, title, ...rest }, index) => (
            <div
              key={rest.i}
              data-grid={rest}
              onKeyUp={(e) => handleKeyboard(e, rest.i)}
              tabIndex={index}
              style={{
                boxShadow: activeItem === rest.i ? '0 0 2px 2px #2684FF' : 'none',
                ...(activeItem === rest.i ? { outline: 'none' } : {}),
              }}
            >
              <GridTile
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                title={rest.i}
                widgetType={widgetType}
                // these will be dynamically calculated once the dimensions are calculated
                widgetConfig={{ ...rest, colWidth: 1200 / 4 }}
                setWidgetAttribute={setWidgetAttribute}
                removeWidget={removeWidget}
              >
                {rest.i}
              </GridTile>
            </div>
          ))
        }
      </ResponsiveGridLayout>
    </div>
  );
};

export default GridLayout;
