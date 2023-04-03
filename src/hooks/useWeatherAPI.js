 import { useState, useEffect, useCallback } from "react"
 
 const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
    // 留意這裡加上 return 直接把 fetch API 回傳的 Promise 再回傳出去，以便後續在 async function 中可以使用
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
    )
      .then((response) => response.json())
      .then((data) => {
        // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
        const locationData = data.records.location[0]
        // STEP 2：將風速（WDSD）和氣溫（TEMP）的資料取出
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["WDSD", "TEMP"].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue
            }

            return neededElements
          },
          {}
        )
        
        // 把取得的資料內容回傳出去，而不是在這裡 setWeatherElement
        return {
          locationName: locationData.locationName,
          windSpeed: weatherElements.WDSD,
          temperature: weatherElements.TEMP,
          observationTime: locationData.time.obsTime,
        }
      })
  }

  const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
    // 留意這裡加上 return 直接把 fetch API 回傳的 Promise 再回傳出去，以便後續在 async function 中可以使用
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.location[0]

        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            // 只保留需要用到的「天氣現象」、「降雨機率」和「舒適度」
            if(['Wx','PoP','CI'].includes(item.elementName)) {
              // 這支 API 會回傳未來 36 小時的資料，這裡只需要取出最近 12 小時的資料，因此使用 item.time[0]
              neededElements[item.elementName] = item.time[0].parameter
            }

            return neededElements
          }, {}
        )
        // 把取得的資料內容回傳出去，而不是在這裡 setWeatherElement
        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          // 舒適度
          comfortability: weatherElements.CI.parameterName
        }
      })
  }

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {

   const [weatherElement, setWeatherElement] = useState({
    locationName: "",
    description: "",
    windSpeed: 0,
    temperature:0,
    rainPossibility: 0,
    observationTime: new Date(),
    comfortability: '',
    weatherCode: 0,
    isLoading: true,
  })

  const fetchData = useCallback(async () => {
    // 在開始拉取資料前，先把 isLoading 的狀態改成 true
      setWeatherElement((prevState) => ({
        ...prevState,
        isLoading: true,
      }));

      // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
      // 直接透過陣列的解構賦值來取出 Promise.all 回傳的資料
      const [currentWeather, weatherForecast] = await Promise.all([fetchCurrentWeather({ authorizationKey, locationName }),fetchWeatherForecast({ authorizationKey, cityName })])

      // 把取得的資料透過物件的解構賦值放入
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      })
    // 在 useCallback 中要記得把變數放入 dependencies array 中，以確保這些資料改變時，能夠得到最新的 fetchData 方法
  },[authorizationKey, cityName, locationName])

  // 使用 useCallback 後，只要 useEffect 中的 dependencies 沒有改變，它回傳的 fetchData 就可以指稱到同一個函式。再把這個 fetchData 放到 useEffect 的 dependencies 後，就不會重新呼叫 useEffect 內的函式
  // 只有在一些情況下，例如當 useEffect 的 dependencies 陣列會需要相依於某個函式時，開發者可以透過 useCallback 來把這個函式保存下來，以避免這個函式在元件重新轉譯後又是「新的」，進而導致 useEffect 每次都會重新執行的情況。
  useEffect(() => {
    fetchData()
  },[fetchData])
  
  return [weatherElement, fetchData]

}



export default useWeatherAPI