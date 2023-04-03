import React, { useState } from 'react';
import styled from '@emotion/styled';
import { availableLocations } from './../utils/helpers';

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  outline: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;
    font-size: 14px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;


const WeatherSetting = ({cityName, handleCurrentCityChange, handleCurrentPageChange}) => {
  // 把 cityName 當成 locationName 這個 state 的預設值，因為 <input value={locationName}>，因此當使用者一進到此頁面時，地區的表單欄位就會是使用者當前的地區
  const [locationName, setLocationName] = useState(cityName)

  const handleChange = (e) => {
    setLocationName(e.target.value)
  }

  const handleSave = () => {
    console.log(`儲存的地區資訊為 : ${locationName}`)
    handleCurrentCityChange(locationName)
    handleCurrentPageChange('WeatherCard')
    localStorage.setItem('cityName', locationName)
  }

  // const inputLocationRef = useRef(null)

  // const handleSave = () => {
  //   console.log('value', inputLocationRef.current.value)
  // }

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      {/* 在 HTML 的 <label> 中，使用的是 for 屬性，而在 React JSX 中，為了避免和 JavaScript 的 for 關鍵字衝突，因此會使用 htmlFor，例如，<label htmlFor="location"> */}
      <StyledLabel htmlFor="location">地區</StyledLabel>
      {/* 使用 onChange 事件來監聽使用者輸入的資料，並且當事件觸發時呼叫 handleChange */}
      {/*  ref={inputLocationRef} defaultValue="台南市" */}
      <StyledSelect id="location" name="location" onChange={handleChange} value={locationName}>
        {/* 定義可以選擇的地區選項 */}
        {availableLocations.map(({cityName}) => (
          <option value={cityName} key={cityName}>
            {cityName}
          </option>
        ))}
      </StyledSelect>

      <ButtonGroup>
        <Back onClick={() => handleCurrentPageChange('WeatherCard')}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting