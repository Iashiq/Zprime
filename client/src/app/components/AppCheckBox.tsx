import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  disabled?: boolean; // Make disabled prop optional
}

const AppCheckBox: React.FC<Props> = ({ label, disabled, ...props }) => {
  const { field } = useController(props); // Use props directly
  const [checked, setChecked] = useState(!!field.value);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    field.onChange(event); // Update form value
  };

  return (
    <FormControlLabel 
      control={
        <Checkbox
          checked={checked}
          onChange={handleCheckboxChange}
          color="secondary"
          disabled={disabled} // Use disabled prop here
        />
      }
      label={label}
    />
  );
};

export default AppCheckBox;
