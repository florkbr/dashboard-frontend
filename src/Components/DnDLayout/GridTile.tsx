import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownList,
  Icon,
  MenuToggle,
  MenuToggleElement,
  Tooltip,
} from '@patternfly/react-core';
import { CompressIcon, EllipsisVIcon, ExpandIcon, GripVerticalIcon, MinusCircleIcon } from '@patternfly/react-icons';
import React, { Fragment, useMemo, useState } from 'react';
import clsx from 'clsx';

import './GridTile.css';
import { Layout } from 'react-grid-layout';
import { WidgetTypes } from '../Widgets/widgetTypes';
import widgetMapper from '../Widgets/widgetMapper';

export type ExtendedLayoutItem = Layout & {
  widgetType: WidgetTypes;
  title: string;
  locked?: boolean;
};

export type SetWidgetAttribute = <T extends string | number | boolean>(id: string, attributeName: keyof ExtendedLayoutItem, value: T) => void;

export type GridTileProps = React.PropsWithChildren<{
  widgetType: WidgetTypes;
  title: string;
  setIsDragging: (isDragging: boolean) => void;
  isDragging: boolean;
  setWidgetAttribute: SetWidgetAttribute;
  widgetConfig: Layout & {
    colWidth: number;
    locked?: boolean;
  };
  removeWidget: (id: string) => void;
}>;

const GridTile = ({ widgetType, title, isDragging, setIsDragging, setWidgetAttribute, widgetConfig, removeWidget }: GridTileProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Component = widgetMapper[widgetType] || Fragment;

  const dropdownItems = useMemo(() => {
    const isMaximized = widgetConfig.h === widgetConfig.maxH;
    const isMinimized = widgetConfig.h === widgetConfig.minH;
    return (
      <>
        <DropdownItem
          isDisabled={isMaximized}
          onClick={() => {
            setWidgetAttribute(widgetConfig.i, 'h', widgetConfig.maxH ?? widgetConfig.h);
            setIsOpen(false);
          }}
          icon={<ExpandIcon />}
        >
          Maximize height
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            setWidgetAttribute(widgetConfig.i, 'h', widgetConfig.minH ?? widgetConfig.h);
            setIsOpen(false);
          }}
          isDisabled={isMinimized}
          icon={<CompressIcon />}
        >
          Minimize height
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            removeWidget(widgetConfig.i);
          }}
          icon={
            <Icon status="danger">
              <MinusCircleIcon />
            </Icon>
          }
        >
          Remove
        </DropdownItem>
      </>
    );
  }, [widgetConfig.minH, widgetConfig.maxH, widgetConfig.h, widgetConfig.i, setWidgetAttribute]);

  const headerActions = (
    <>
      <Dropdown
        popperProps={{
          appendTo: document.body,
        }}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            isExpanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            variant="plain"
            aria-label="Card title inline with images and actions example kebab toggle"
          >
            <EllipsisVIcon aria-hidden="true" />
          </MenuToggle>
        )}
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      >
        <DropdownList>{dropdownItems}</DropdownList>
      </Dropdown>
      <Tooltip content={<p>Move widget</p>}>
        <Icon
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          className={clsx('drag-handle', {
            dragging: isDragging,
          })}
        >
          <GripVerticalIcon style={{ fill: '#6a6e73' }} />
        </Icon>
      </Tooltip>
    </>
  );

  const titleWidth = useMemo(
    // 88px is the width of the actions container
    // 48px is the width padding on the card title
    // 16px is the width of the left padding on the actions handle
    () => `calc(${widgetConfig.colWidth * widgetConfig.w}px - 48px${widgetConfig.locked ? '' : ' - 88px - 16px'})`,
    [widgetConfig.colWidth, widgetConfig.w, widgetConfig.locked]
  );
  return (
    <Card className="grid-tile">
      <CardHeader actions={{ actions: widgetConfig.locked ? undefined : headerActions }}>
        <CardTitle
          style={{
            userSelect: isDragging ? 'none' : 'auto',
            width: titleWidth,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Component></Component>
      </CardBody>
    </Card>
  );
};

export default GridTile;
