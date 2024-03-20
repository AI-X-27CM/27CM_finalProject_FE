import axios from 'axios';

const url = 'http://192.168.0.165:8000/error';

const error = async (e) => {
  let now = new Date();
  let kortime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const errorData = {
    error: e,
    date: kortime,
  };

  try {
    const response = await axios.post(url, errorData, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('error : ', response.data);
  } catch (error) {
    console.error('Error occurred while sending error data:', error);
  }
};

export default error;
