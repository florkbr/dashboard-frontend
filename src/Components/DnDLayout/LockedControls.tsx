import {
  Button,
  Divider,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  Level,
  LevelItem,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { OptimizeIcon } from '@patternfly/react-icons';
import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { drawerExpandedAtom } from '../../state/drawerExpandedAtom';
import { lockedLayoutAtom } from '../../state/lockedLayoutAtom';
import { layoutAtom, prevLayoutAtom } from '../../state/layoutAtom';

const UnlockDashboard = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleLocked = useSetAtom(lockedLayoutAtom);
  const toggleOpen = useSetAtom(drawerExpandedAtom);
  const setPrevLayout = useSetAtom(prevLayoutAtom);
  const layout = useAtomValue(layoutAtom);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ToolbarGroup>
      <ToolbarItem>
        <Stack>
          <StackItem>
            <Dropdown
              isOpen={isOpen}
              activeItemId={0}
              onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
                  Edit dashboard
                </MenuToggle>
              )}
            >
              <DropdownGroup>
                <DropdownList>
                  <DropdownItem
                    icon={<OptimizeIcon />}
                    onClick={() => {
                      toggleLocked((prev) => !prev);
                      toggleOpen((prev) => !prev);
                      setPrevLayout(layout);
                    }}
                  >
                    Customize mode
                  </DropdownItem>
                </DropdownList>
              </DropdownGroup>
              <Divider />
              <DropdownGroup label="Configuration" labelHeadingLevel="h3">
                <DropdownList>
                  <DropdownItem>admin-default</DropdownItem>
                  <DropdownItem isActive>development-default</DropdownItem>
                  <DropdownItem>Custom view config</DropdownItem>
                </DropdownList>
              </DropdownGroup>
            </Dropdown>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component="small">
                Current view:{' '}
                <span
                  style={{
                    borderBottom: '1px dotted #000',
                  }}
                >
                  admin-default
                </span>
              </Text>
            </TextContent>
          </StackItem>
        </Stack>
      </ToolbarItem>
    </ToolbarGroup>
  );
};

const EditDashboard = () => {
  const setDrawerExpanded = useSetAtom(drawerExpandedAtom);
  const toggleLocked = useSetAtom(lockedLayoutAtom);
  const setLayout = useSetAtom(layoutAtom);
  const prevLayout = useAtomValue(prevLayoutAtom);
  return (
    <ToolbarGroup>
      <ToolbarItem
        style={{
          height: 36,
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
        }}
      >
        <Button
          variant="primary"
          onClick={() => {
            setDrawerExpanded(false);
            toggleLocked(true);
          }}
        >
          Save changes and close
        </Button>
      </ToolbarItem>
      <ToolbarItem>
        <Button
          variant="link"
          onClick={() => {
            toggleLocked(true);
            setDrawerExpanded(false);
            setLayout(prevLayout);
          }}
        >
          Close without saving
        </Button>
      </ToolbarItem>
    </ToolbarGroup>
  );
};

const LockedControls = () => {
  const isLocked = useAtomValue(lockedLayoutAtom);
  return (
    <PageSection className="pf-v5-u-pb-0" variant={PageSectionVariants.light}>
      <Level>
        <LevelItem>
          <Title headingLevel="h1" size="2xl">
            Hi, Ned Username
          </Title>
          <Title headingLevel="h2" size="2xl">
            Welcome to your Hybrid Cloud Console.
          </Title>
        </LevelItem>
        <LevelItem>
          <Toolbar>
            <ToolbarContent>{isLocked ? <UnlockDashboard /> : <EditDashboard />}</ToolbarContent>
          </Toolbar>
        </LevelItem>
      </Level>
    </PageSection>
  );
};

export default LockedControls;
