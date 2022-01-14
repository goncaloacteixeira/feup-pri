import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Grid, Typography } from "@mui/material";

function valuetext(value) {
  return `${value}°C`;
}

const minDistance = 10;

export default function ValueSlider({onChange, start, end}) {
  const [value, setValue] = React.useState([start, end]);

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue([clamped - minDistance, clamped]);
      }
    } else {
      setValue(newValue);
    }
  };

  React.useEffect(() => onChange(value[0], value[1]), [value]);

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="body1">
            {value[0]} to {value[1]}
        </Typography>
      </Grid>
      <Grid px={1} item>
        <Slider
          getAriaLabel={() => "Minimum distance shift"}
          value={value}
          min={start}
          step={1}
          max={end}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          disableSwap
        />
      </Grid>
    </Grid>
  );
}
