import React, { ChangeEvent, memo, useMemo } from 'react';
import './Select.css';
import { Currency } from '../../model/types/currency';

export interface SelectOption {
    value: string,
    content: string,
}

interface SelectProps {
    // options?: SelectOption[];
    options?: Currency[];
    value?: string;
    onChange?: (value: string) => void;
}

export const Select = memo((props: SelectProps) => {
    const { options, value, onChange } = props;

    const optionsList = useMemo(() => {
        return options?.map((opt) => {
            return <option value={opt} key={opt}>{opt}</option>;
        });
    }, [options]);

    const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
    };

    return (
        <div>
            <select value={value} onChange={onChangeHandler} className={'select'}>
                {optionsList}
            </select>
        </div>
    );
});