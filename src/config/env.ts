// interface ImportMetaEnv {
//     readonly VITE_API_BASE_URL: string;
//     readonly VITE_APP_NAME?: string
// }

// interface ImportMeta {
//     readonly env: ImportMetaEnv;
// }

const env = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    appName: import.meta.env.VITE_APP_NAME,
}

export default env;