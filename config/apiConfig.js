const API_URL = 'http://192.168.0.165:8000';
const API_ENDPOINTS = {
  LOGIN: `${API_URL}/login`, // 로그인 API
  ADD_USER: `${API_URL}/addUser`, // 회원가입 API
  RECORD: `${API_URL}/api`, // 녹음 파일 보내는 API
  MODEL_GPT: `${API_URL}/gpt`, // GPT 모델 API
  SRT_RECORD: `${API_URL}/start`, // DETECT(통화) 시작 API
  END_RECORD: `${API_URL}/end`, // 통화 종료 API
};

export default API_ENDPOINTS;
