import React, { useState, useEffect, useMemo } from "react"
// import logo from './logo.svg';
import styled from "@emotion/styled"
import { ThemeProvider } from "@emotion/react"
import { getMoment, findLocation } from './utils/helpers'
import WeatherCard from './views/WeatherCard'
import useWeatherAPI from './hooks/useWeatherAPI'
import WeatherSetting from './views/WeatherSetting'

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AUTHORIZATION_KEY = 'CWB-3E6D5DF8-4577-4394-B13E-C7F9EF3F18AF'

function App() {
  //  從 localStorage 取出先前保存的地區，若沒有保存過則給予預設值
  const storageCity = localStorage.getItem('cityName') || '臺北市'
  const [currentCity, setCurrentCity] = useState(storageCity)
  const [currentTheme, setCurrentTheme] = useState("light")
  const [currentPage, setCurrentPage] = useState('WeatherCard')

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage)
  }

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity)
  }
  

  // 找出每支 API 需要帶入的 locationName
  // 這行也同樣可以用上 useMemo 的概念，只要 currentCity 沒有改變的情況下，即使元件重新轉譯，也不需要重新取值
  const currentLocation =  useMemo( () => findLocation(currentCity),[currentCity])

  const { cityName, locationName, sunriseCityName } = currentLocation

  const moment = useMemo(() => getMoment(sunriseCityName),[sunriseCityName])

   const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY
  })

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  },[moment])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container> 
         {/* STEP 2：利用條件轉譯的方式決定要呈現哪個元件 */}
         {/* 當 && 前面的值為true時，就取後面的那個值  */}
         {currentPage === 'WeatherCard' && (
           <WeatherCard 
            cityName={cityName}
             weatherElement={weatherElement}
             moment={moment}
             // 直接把'函式'傳進去
             fetchData={fetchData}
             handleCurrentPageChange={handleCurrentPageChange}
           />  
         )}
         {currentPage === 'WeatherSetting' && <WeatherSetting cityName={cityName} handleCurrentPageChange={handleCurrentPageChange} handleCurrentCityChange={handleCurrentCityChange} />}
      </Container>
    </ThemeProvider>
  )
}

export default App
