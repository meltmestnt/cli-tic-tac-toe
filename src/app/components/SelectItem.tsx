import { Box, Text, useFocus } from 'ink';
import React from 'react'
import figures from 'figures';

export type Item = {
  id: number;
  label: React.ReactNode;
  value: any;
  onSelect?: (item: Item) => void;
}

export type SelectItemProps = {
  item: Item;
  isActive?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

const SelectItem = ({ item, autoFocus = false, isActive, disabled }: SelectItemProps) => {
  let textProps = {};
  const { isFocused } = useFocus({ autoFocus: autoFocus, isActive: !disabled, id: item.id.toString() });
  if ((typeof isActive === 'undefined' && isFocused) || isActive) {
      textProps = {
        color: 'yellow',
        inverse: true,
      }
  }
  return (
    <Box alignItems='center' paddingLeft={0.5}>
      <Text color={isActive ? "yellowBright" : "whiteBright"} bold>
        {
          figures.pointer
        }
        &nbsp;
      </Text>
      <Text {...textProps}>
        {
          item.label
        }
      </Text>
    </Box>
  )
}

export default SelectItem