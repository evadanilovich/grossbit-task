import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { Input } from './components/Input/Input';
import { Select } from './components/Select/Select';
import { Currency } from './model/types/currency';
import { getCurrentDate } from './utils/getDate';
import { ReactComponent as ArrowIcon } from './assets/arrow.svg';

const apiKey = 'ec22c97db1c5e9caa3f39f8ea6bd12fe';
const options = [Currency.USD, Currency.EUR, Currency.GBP];

const reservedInfo = {
    'success': true,
    'terms': 'https:\/\/currencylayer.com\/terms',
    'privacy': 'https:\/\/currencylayer.com\/privacy',
    'change': true,
    'start_date': '2024-01-19',
    'end_date': '2024-01-20',
    'source': 'USD',
    'quotes': {
        'USDUSD': {
            'start_rate': 1,
            'end_rate': 1,
            'change': 0,
            'change_pct': 0
        },
        'USDEUR': {
            'start_rate': 0.916204,
            'end_rate': 0.916204,
            'change': 0,
            'change_pct': 0
        },
        'USDGBP': {
            'start_rate': 0.787154,
            'end_rate': 0.787154,
            'change': 0,
            'change_pct': 0
        }
    }
};

function App() {
    const [valueFrom, setValueFrom] = useState('1');
    const [valueTo, setValueTo] = useState('');
    const [isInputFromFocus, setIsInputFromFocus] = useState(false);
    const [isInputToFocus, setIsInputToFocus] = useState(false);

    const [currencyFrom, setCurrencyFrom] = useState<Currency>(Currency.USD);
    const [currencyTo, setCurrencyTo] = useState<Currency>(Currency.EUR);

    const [date, setDate] = useState<string | null>(null);
    const [oneCoin, setOneCoin] = useState<string | null>(null);

    const initRates: Record<Currency, number | undefined> = {
        [Currency.USD]: 1,
        [Currency.EUR]: undefined,
        [Currency.GBP]: undefined,
    };

    const [exchangeRates, setExchangeRates] = useState(initRates);

    const performConversion = (amount?: string, toCurrency?: number, fromCurrency?: number) => {
        if (amount == '') {
            return '0';
        }

        if (amount && toCurrency && fromCurrency) {
            const value = Number(amount) * (toCurrency / fromCurrency);

            if (Number.isNaN(value)) {
                return;
            }
            return value.toFixed(4).replace(/\.?0+$/, '');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://apilayer.net/api/change?access_key=${apiKey}&currencies=USD,EUR,GBP`);
                const info = await response.json();

                // Если запросы по API превысят лимит
                const data = info.success ? info : reservedInfo;

                if (data) {
                    const EUR = data.quotes.USDEUR.start_rate;
                    const GBP = data.quotes.USDGBP.start_rate;
                    setExchangeRates({ ...initRates, [Currency.EUR]: EUR, [Currency.GBP]: GBP });
                }
            } catch (e) {
                console.log('An error occurred');
            }
        };

        fetchData();
        setDate(getCurrentDate());
    }, []);

    const countOneCoin = () => {
        const oneCoin = performConversion('1', exchangeRates[currencyTo], exchangeRates[currencyFrom]);
        if (oneCoin) {
            setOneCoin(oneCoin);
        }
    };

    useEffect(() => {
        countOneCoin();

        const result = performConversion(valueFrom, exchangeRates[currencyTo], exchangeRates[currencyFrom]);
        if (result) {
            setValueTo(result);
        }
    }, [exchangeRates]);

    useEffect(() => {
        const result = performConversion(valueFrom, exchangeRates[currencyTo], exchangeRates[currencyFrom]);
        if (result || result === '0') {
            setValueTo(result);
        }

        countOneCoin();
    }, [currencyTo, currencyFrom]);

    const onChangeSelectFrom = useCallback((value: string) => {
        setCurrencyFrom(value as Currency);
    }, []);

    const onChangeSelectTo = useCallback((value: string) => {
        setCurrencyTo(value as Currency);
    }, []);

    const onChangeInputValueFrom = useCallback((value: string) => {
        setValueFrom(value);
    }, []);

    const onChangeInputValueTo = useCallback((value: string) => {
        setValueTo(value);
    }, []);

    const onSetFocusInputFrom = useCallback(() => {
        setIsInputFromFocus(prev => !prev);
    }, []);

    const onSetFocusInputTo = useCallback(() => {
        setIsInputToFocus(prev => !prev);
    }, []);

    useEffect(() => {
        if (isInputFromFocus) {
            const valueTo = performConversion(valueFrom, exchangeRates[currencyTo], exchangeRates[currencyFrom]);
            if (valueTo) {
                setValueTo(valueTo);
            }
        }
    }, [valueFrom]);

    useEffect(() => {
        if (isInputToFocus) {
            const valueFrom = performConversion(valueTo, exchangeRates[currencyFrom], exchangeRates[currencyTo]);
            if (valueFrom) {
                setValueFrom(valueFrom);
            }
        }
    }, [valueTo]);

    return (
        <section className={'mainSection'}>
            <div className="form">
                <div className={'inputField'}>
                    <Input value={valueFrom} setValue={onChangeInputValueFrom} setFocus={onSetFocusInputFrom} />
                    <Select options={options} value={currencyFrom} onChange={onChangeSelectFrom} />
                </div>
                <ArrowIcon className={'icon'} />
                <div className={'inputField'}>
                    <Input value={valueTo} setValue={onChangeInputValueTo} setFocus={onSetFocusInputTo} />
                    <Select options={options} value={currencyTo} onChange={onChangeSelectTo} />
                </div>
            </div>

            <p className={'text'}>1 {currencyFrom} = {oneCoin} {currencyTo}</p>
            <p className={'subtext'}>Даннные носят ознакомительный характер {date}</p>
        </section>
    );
}

export default App;
