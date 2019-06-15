import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './select.scss';

const Select = ({ options, defaultValue = '', handleChange, name, invalids, label }) => {
  const defaultValueIndex = options.findIndex(option => option.value === defaultValue);
  const initialValue = defaultValueIndex >= 0 ? defaultValue : '';

  const [value, setValue] = useState(initialValue);
  const [valid, setValid] = useState(true);
  const [optionsShowing, setShowing] = useState(false);
  const [isActive, setActive] = useState(false);
  const [currentValuePosition, setPosition] = useState(null);

  useEffect(() => {
    setOptionIndex(defaultValue);

    const initialState = {
      [name]: {
        value: initialValue,
        valid: validate(initialValue),
      },
    };
    handleChange(initialState);
  }, []);

  useEffect(() => {
    const selectInvalid = invalids.find(invalid => invalid[name]);
    if (!!selectInvalid && selectInvalid.hasOwnProperty(name)) {
      setValid(false);
    }
  }, [invalids]);

  useEffect(() => {
    window.addEventListener('click', setShowing(false));
    window.removeEventListener('click', () => {});
  }, [isActive]);

  const setOptionIndex = value => {
    const optionIndex = options.findIndex(option => option.value === value);

    setPosition(optionIndex);
  };

  const handleClick = (e, option) => {
    e.preventDefault();
    setValue(option.value);
    setOptionIndex(option.value);
    setShowing(false);
    validateState(option.value);
    handleChange({
      [name]: { value: option.value, valid: validate(option.value) },
    });
  };

  const validate = value => {
    if (!!options.find(option => option.value === value)) {
      return true;
    } else {
      return false;
    }
  };

  const validateState = incomingValue => {
    if (!!options.find(option => option.value === incomingValue)) {
      return setValid(true);
    } else {
      return setValid(false);
    }
  };

  const handleKeyPress = e => {
    console.log(e.key);
    if (e.key === 'Enter') {
      setShowing(!optionsShowing);
    }
  };

  const handleOptions = () => {
    window.addEventListener('click', handleClickInside, false);
  };

  const handleClickInside = () => {
    setShowing(true);
    window.removeEventListener('click', handleClickInside, false);
  };

  return (
    <div
      className={`select ${!valid ? 'select--has-error' : ''} ${isActive ? 'select--active' : ''} ${
        value.length > 0 ? 'select--has-content' : ''
      }`}
      tabIndex='0'
      onFocus={() => {
        setActive(true);
      }}
      onBlur={e => {
        setActive(false);
      }}
      onKeyDown={e => handleKeyPress(e)}>
      <p className='select__label'>{label}</p>
      <div className='select__box' onClick={handleOptions}>
        <p>{value}</p>
      </div>
      <div className={`select__options ${optionsShowing ? 'select__options--showing' : ''}`}>
        {options.map((option, index) => (
          <button
            key={option.value}
            className={`select__option ${
              index === currentValuePosition ? 'select__option--active' : ''
            }`}
            onClick={e => handleClick(e, option)}>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  defaultValue: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  invalids: PropTypes.array.isRequired,
};

Select.defaultProps = {
  label: '',
};

export default Select;
