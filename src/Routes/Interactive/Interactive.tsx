import { PageSection } from '@patternfly/react-core';
import AddWidgetDrawer from '../../Components/DnDLayout/AddWidgetDrawer';
import Controls from '../../Components/DnDLayout/Controls';
import GridLayout from '../../Components/DnDLayout/GridLayout';
import React from 'react';

const Interactive = () => {
  return (
    <>
      <Controls />
      <AddWidgetDrawer>
        <PageSection>
          <GridLayout />
        </PageSection>
      </AddWidgetDrawer>
    </>
  );
};

export default Interactive;
