import axios from 'axios';

const newsApi = axios.create({
  baseURL: 'https://api.mediastack.com/v1',
  params: {
    access_key: import.meta.env.VITE_MEDIASTACK_API_KEY,
    languages: 'en'
  }
});

const weatherApi = axios.create({
  baseURL: 'https://api.weatherapi.com/v1',
  params: {
    key: import.meta.env.VITE_WEATHER_API_KEY
  }
});

export const fetchNews = async (category: string = 'general') => {
  try {
    const response = await newsApi.get('/news', {
      params: {
        categories: category,
        limit: 100
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news');
  }
};

export const fetchWeather = async (city: string = 'London') => {
  try {
    const response = await weatherApi.get('/current.json', {
      params: {
        q: city
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error('Failed to fetch weather');
  }
};