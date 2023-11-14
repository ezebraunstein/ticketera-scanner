import 'dotenv/config';

export default {
    expo: {
        name: 'scanner-app',
        slug: 'scanner-app',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'My.App',
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#FFFFFF',
            },
            package: 'My.App',
        },
        web: {
            favicon: './assets/favicon.png',
        },
        extra: {
            REACT_APP_ACCESS_KEY: process.env.REACT_APP_ACCESS_KEY,
            REACT_APP_SECRET_ACCESS_KEY: process.env.REACT_APP_SECRET_ACCESS_KEY,
            eas: {
                projectId: "667abad9-b81c-49d9-9d65-1aa50284d4a5"
            }
        }
    }
}
