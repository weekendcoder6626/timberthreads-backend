// This is to set the type for process.env
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT: string;
        MONGO_USER: string;
        MONGO_PASSWORD: string;
        MONGO_APPNAME: string;
        JWT_SECRET_KEY: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}