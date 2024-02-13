import './Header.scss';

import {
  ActionGroup,
  Button,
  ButtonType,
  ClipboardCopy,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  Form,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Level,
  LevelItem,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  PageSectionVariants,
  Radio,
  Stack,
  StackItem,
  TextArea,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { CheckIcon, ExclamationCircleIcon, PlusIcon, TimesIcon } from '@patternfly/react-icons';
import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { drawerExpandedAtom } from '../../state/drawerExpandedAtom';
import { lockedLayoutAtom } from '../../state/lockedLayoutAtom';
import { initialLayout, layoutAtom, prevLayoutAtom } from '../../state/layoutAtom';
import useCurrentUser from '../../hooks/useCurrentUser';

const Controls = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [customValue, setCustomValue] = React.useState('');
  const [customValueValidationError, setCustomValueValidationError] = React.useState('');
  const [checked, setChecked] = React.useState('console-default');
  const toggleLocked = useSetAtom(lockedLayoutAtom);
  const toggleOpen = useSetAtom(drawerExpandedAtom);
  const setPrevLayout = useSetAtom(prevLayoutAtom);
  const setLayout = useSetAtom(layoutAtom);
  const layout = useAtomValue(layoutAtom);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onCustomConfigSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!customValue) {
      setCustomValueValidationError('Input value is required.');
      return;
    }
    setLayout(JSON.parse(customValue));
    setIsOpen(false);
  };

  const onDefaultConfigSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLayout(initialLayout);
    setIsOpen(false);
  };

  return (
    <ToolbarGroup>
      <ToolbarItem spacer={{ default: 'spacerNone' }}>
        <ClipboardCopy isCode hoverTip="Copy current configuration string" clickTip="Configuration string copied to clipboard">
          {JSON.stringify(layout)}
        </ClipboardCopy>
      </ToolbarItem>
      <ToolbarItem spacer={{ default: 'spacerSm' }}>
        <Stack>
          <StackItem>
            <Dropdown
              isOpen={isOpen}
              activeItemId={0}
              onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
                  Config view: {checked}
                </MenuToggle>
              )}
            >
              <DropdownGroup label="Dashboard configuration" labelHeadingLevel="h3">
                <DropdownList>
                  <Form>
                    <DropdownItem>
                      <Radio
                        name="config"
                        id="default"
                        label="console-default"
                        value="console-default"
                        onClick={(e) => {
                          onToggleClick();
                          setChecked('console-default');
                          onDefaultConfigSubmit(e);
                        }}
                        checked={checked === 'console-default'}
                      ></Radio>
                    </DropdownItem>
                    <DropdownItem>
                      <Radio
                        name="config"
                        id="custom"
                        label="Custom configuration"
                        value="custom"
                        onClick={() => {
                          setChecked('custom');
                        }}
                        checked={checked === 'custom'}
                      ></Radio>
                      <TextArea
                        placeholder="Paste custom string"
                        required
                        onClick={() => {
                          setChecked('custom');
                        }}
                        onChange={(_event, value) => {
                          setCustomValue(value);
                        }}
                      ></TextArea>
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem
                            variant={customValueValidationError ? 'error' : 'default'}
                            {...(customValueValidationError && { icon: <ExclamationCircleIcon /> })}
                          >
                            {customValueValidationError}
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                      <ActionGroup hidden={checked !== 'custom'}>
                        <Button variant="plain" type={ButtonType.submit} onClick={onCustomConfigSubmit}>
                          <CheckIcon />
                        </Button>
                        <Button variant="plain" type={ButtonType.reset} onClick={() => setIsOpen(false)}>
                          <TimesIcon />
                        </Button>
                      </ActionGroup>
                    </DropdownItem>
                  </Form>
                </DropdownList>
              </DropdownGroup>
            </Dropdown>
          </StackItem>
        </Stack>
      </ToolbarItem>
      <ToolbarItem>
        <Button
          onClick={() => {
            toggleLocked((prev) => !prev);
            toggleOpen((prev) => !prev);
            setPrevLayout(layout);
          }}
          variant="secondary"
          icon={<PlusIcon />}
        >
          Add widgets
        </Button>
      </ToolbarItem>
    </ToolbarGroup>
  );
};

const Header = () => {
  const { currentUser } = useCurrentUser();
  const userName = currentUser?.first_name && currentUser?.last_name ? ` ${currentUser.first_name} ${currentUser.last_name}` : currentUser?.username;
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Level>
        <LevelItem>
          <Title headingLevel="h1" size="2xl">
            Hi{userName ? `, ${userName}` : '!'}
          </Title>
          <Title headingLevel="h2" size="2xl">
            Welcome to your Hybrid Cloud Console.
          </Title>
        </LevelItem>
        <LevelItem>
          <Toolbar>
            <ToolbarContent>
              <Controls />
            </ToolbarContent>
          </Toolbar>
        </LevelItem>
      </Level>
    </PageSection>
  );
};

export default Header;
