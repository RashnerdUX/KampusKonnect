import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface UniSelectProps {
  value: string;
  onChange: (value: string) => void;
  universities: string[];
  label?: string;
  fullWidth?: boolean;
}

export function UniSelect({ 
  value, 
  onChange, 
  universities, 
  label = "University",
  fullWidth = true 
}: UniSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>All Universities</em>
        </MenuItem>
        {universities.map((uni) => (
          <MenuItem key={uni} value={uni}>
            {uni}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}