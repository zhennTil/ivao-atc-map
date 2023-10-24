import { Slider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "../modules/utils/utils";

const SLIDER_DAYS_RANGE = 7;
const HOURS_PER_DAY = 24;
const MAX = SLIDER_DAYS_RANGE*HOURS_PER_DAY;

interface DateSliderProps {
    onChange: (start: Date, end: Date) => void;
}

const DateSlider = (props: DateSliderProps) => {
    const { onChange } = props;
    const [ loadedDate ] = useState<Date>(() => {
        const date = new Date();
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);
        return date;
    });
    const dateValue = useCallback((n: number) => {
        const date = new Date(loadedDate);
        date.setUTCDate(date.getUTCDate() + n / HOURS_PER_DAY);
        date.setUTCHours(date.getUTCHours() + n % HOURS_PER_DAY)
        return date;
    }, []);
    const formatter = useCallback((n: number) => {
        return formatDateTime(dateValue(n));
    }, []);

    const [ value, setValue ] = useState<number[]>([MAX-HOURS_PER_DAY, MAX]);
    useEffect(() => {
        onChange?.(dateValue(MAX-value[1]), dateValue(MAX-value[0]));
    }, [value]);

    return <Slider
          sx={{height: 500}}
          orientation="vertical"
          max={MAX}
          value={value}
          scale={(n) => MAX-n}
          onChange={(_, n) => setValue(n as number[])}
          valueLabelFormat={formatter}
          valueLabelDisplay='on'/>
}

export default DateSlider;