import axios from 'axios';

const url = 'http://192.168.0.165:8000/error';

const error = async (e) => {
  try {
    const response = await axios.post(
      url,
      { error: e.message },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    console.log('error : ', response.data);
  } catch (error) {
    console.error('Error occurred while sending error data:', error);
  }
};

export default error;
