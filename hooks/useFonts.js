import * as Font from "expo-font";

export default useFonts = async () =>
  await Font.loadAsync({
    'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf'),
    'DisplayExtraBold': require('../assets/fonts/HelveticaNowDisplay-Black.otf'),
    'DisplayBlack': require('../assets/fonts/HelveticaNowDisplay-ExtraBold.otf'),
  });