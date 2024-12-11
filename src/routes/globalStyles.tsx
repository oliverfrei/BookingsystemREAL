import { MantineTheme } from '@mantine/core';
import { DatePickerStylesNames } from '@mantine/dates';

export const datePickerStyles = (theme: MantineTheme) => ({
  input: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #845EF7',
    borderRadius: '4px',
  },
  dropdown: {
    backgroundColor: '#2c2f33',
    color: '#fff',
  },
}) as Partial<Record<DatePickerStylesNames, React.CSSProperties>>; // Angiv korrekt type her
