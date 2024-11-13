import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';

interface CustomDatePickerProps {
    value: Dayjs | null;
    label: string;
    onChange: (newValue: Dayjs | null) => void;
}

function CustomDatePicker({ value, label, onChange }: CustomDatePickerProps): JSX.Element {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={label}
                value={value}
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            border: 'none',
                        },
                    },
                }}
                onChange={(newValue) => onChange(newValue)}
                views={['year', 'month', 'day']}
                format="DD/MM/YYYY"
                slots={{
                    openPickerButton: () => null,
                    openPickerIcon: () => null,
                }}
            />
        </LocalizationProvider>
    );
};

export default CustomDatePicker;