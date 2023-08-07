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
            ACCESS_KEY: process.env.ACCESS_KEY,
            SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
        }
    }
}
