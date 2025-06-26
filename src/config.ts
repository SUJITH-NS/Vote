// Configuration for different environments
interface Config {
  apiUrl: string;
}

// Local development
const devConfig: Config = {
  apiUrl: 'http://localhost:4000',
};

// Production environment
const prodConfig: Config = {
  apiUrl: import.meta.env.PROD
    ? 'https://your-backend-url.onrender.com' // Replace with your actual Render URL
    : 'http://localhost:4000'
};

// Export the appropriate config based on environment
export const config: Config =
  import.meta.env.PROD ? prodConfig : devConfig;