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
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000'
};

// Export the appropriate config based on environment
export const config: Config =
  import.meta.env.PROD ? prodConfig : devConfig;