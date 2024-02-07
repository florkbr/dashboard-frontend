import { PageSection } from '@patternfly/react-core';
import AddWidgetDrawer from '../../Components/DnDLayout/AddWidgetDrawer';
import GridLayout from '../../Components/DnDLayout/GridLayout';
import { useAtomValue } from 'jotai';
import { lockedLayoutAtom } from '../../state/lockedLayoutAtom';
import LockedControls from '../../Components/DnDLayout/LockedControls';
import React from 'react';

const DefaultLocked = () => {
  const isLocked = useAtomValue(lockedLayoutAtom);
  return (
    <>
      <LockedControls />
      <AddWidgetDrawer dismissible={false}>
        <PageSection>
          <GridLayout isLocked={isLocked} />
        </PageSection>
      </AddWidgetDrawer>
    </>
  );
};

export default DefaultLocked;
