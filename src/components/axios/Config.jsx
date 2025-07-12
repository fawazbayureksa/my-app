import './ProgressBar.css';

const Config = (customHeaders = {}, params = null) => {
  return {
    headers: {
      'Content-Type': 'application/json', // default for JSON requests
      Accept: 'application/json',
      ...customHeaders,
    },
    ...(params && { params }),
  };
};


export const ErrorHandler = (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            // handleLogout()
        }
    }
}
export default Config;