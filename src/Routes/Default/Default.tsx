import { PageSection } from '@patternfly/react-core';
import AddWidgetDrawer from '../../Components/WidgetDrawer/WidgetDrawer';
import GridLayout from '../../Components/DnDLayout/GridLayout';
import { useAtomValue } from 'jotai';
import { lockedLayoutAtom } from '../../state/lockedLayoutAtom';
import Header from '../../Components/Header/Header';
import React from 'react';

const DefaultLocked = () => {
  const isLocked = useAtomValue(lockedLayoutAtom);
  return (
    <>
      <Header />
      <AddWidgetDrawer dismissible={false}>
        <PageSection>
          <GridLayout isLocked={isLocked} />
        </PageSection>
      </AddWidgetDrawer>
    </>
  );
};

export default DefaultLocked;
