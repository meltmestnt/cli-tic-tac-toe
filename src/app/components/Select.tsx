import { Box, Text, useFocusManager, useInput } from 'ink';
import React, { useEffect, useState } from 'react'
import SelectItem, { Item } from './SelectItem';
import figures from 'figures';

export type SelectProps = {
  items: Array<Item>;
  label: React.ReactNode;
  handleSelectItem: (item: Item) => void;
  disabled?: boolean;
  defaultValue?: string;
}

const Select = ({ items, label, handleSelectItem, disabled, defaultValue }: SelectProps) => {
  let val = null;
  if (Array.isArray(items) && items.length) {
    if (defaultValue) {
      val = items.find(item => item.value === defaultValue)?.id;
    }
    else {
      val = items[0]?.id;
    }
  }
  const [activeItem, setActiveItem] = useState<null | number>(val ?? null);
  const { enableFocus, focusNext, focusPrevious, focus } = useFocusManager();

  useEffect(() => {
    enableFocus();
  }, []);

  useInput((input, key) => {
    if (disabled) return;
    const currentFocused = items.findIndex(item => item.id === activeItem);
    if (key.upArrow) {
      const prevItem = currentFocused - 1;
      let focusableId = (prevItem < 0 ? items[items.length - 1]?.id : items[prevItem]?.id) || items[0]?.id;
      if (!focusableId) {
        return;
      };
      setActiveItem(focusableId);
      focus(focusableId.toString());
    }
    else if (key.downArrow) {
      const nextItem = currentFocused + 1;
      let focusableId = (nextItem > items.length - 1 ? items[0]?.id : items[nextItem]?.id) || items[items.length - 1]?.id;
      if (!focusableId) {
        return;
      };
      setActiveItem(focusableId);
      focus(focusableId.toString());
    }
    else if (key.return || key.rightArrow) {
      const selectedItem = items.find(item => item.id === activeItem);
      if (!selectedItem) return;
      if (selectedItem.onSelect) {
        return selectedItem.onSelect(selectedItem);
      }
      handleSelectItem(selectedItem);
    }
  });

  return (
    <Box flexDirection='column'>
      <Box alignItems='center'>
        <Text color="magentaBright" bold>
          {
            figures.pointer
          }
          &nbsp;
        </Text>
        <Text>
          {
            label
          }
        </Text>
      </Box>
      {
        items.map((item, index) => (
          <SelectItem disabled={disabled} key={item.id} isActive={activeItem === item.id} autoFocus={index === 0} item={item} />
        ))
      }
    </Box>
  )
}

export default Select