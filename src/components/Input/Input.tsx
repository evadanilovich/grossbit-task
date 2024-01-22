import { ChangeEvent, memo } from 'react';
import './Input.css'

interface FormInputProps {
    value: string;
    setValue: (value: string) => void;
    setFocus: () => void;
}

export const Input = memo((props: FormInputProps) => {
    const { value, setValue, setFocus } = props;

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const onFocusHandler = () => {
        setFocus();
    };

    return (
        <label className="form-control">
            <input onChange={onChangeHandler} onFocus={onFocusHandler} onBlur={onFocusHandler}
                   type="text" placeholder="Type here" className={"input"} value={value} />
        </label>
    );
});
