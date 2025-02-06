

# Commands to setup project
## dependencies
```shell
npm install @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
npm install @react-native-async-storage/async-storage
npm install react-native-keyboard-aware-scroll-view
npm install @react-native-picker/picker

yarn add axios
```

## expo commands

```shell
expo init time-it
cd time-it
yarn ios
yarn andorid
```

## deploy to expo

```shell
eas build -p android --profile development
# Create eas.json if it doesn't exist\ncat > eas.json << EOL\n{\n  "build": {\n    "preview": {\n      "android": {\n        "buildType": "apk"\n      }\n    },\n    "production": {\n      "android": {\n        "buildType": "apk"\n      }\n    }\n  }\n}\nEOL
eas build -p android --profile production
```


```shell
expo publish
```

# troubleshoot
```shell
npx expo-doctor
npx expo install --check
```


## Errors
#### CommandError: Required property 'ios.bundleIdentifier' is not found in the project app.json. This is required to open the app.
To add app.json
```json
"ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.highlydistinguish.time-it"
    },
```

#### CommandError: No development build (com.highlydistinguish.time-it) for this project is installed. Please make and install a development build on the device first.

```shell
eas build -p ios --profile development
```


# not working
```shell
eas run:ios
```
To view more error logs, try building the app with Xcode directly, by opening /Users/todd.zhang/dev/ws/todd/mobile/time-it/ios/timeit.xcworkspace.

Command line invocation:
    /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild -workspace /Users/todd.zhang/dev/ws/todd/mobile/time-it/ios/timeit.xcworkspace -configuration Debug -scheme timeit -destination id=155D1B89-2D15-43A0-8E4D-C710A3D67801

User defaults from command line:
    IDEPackageSupportUseBuiltinSCM = YES



2024-12-20 13:55:42.287 xcodebuild[63117:20716031]  DVTDeviceOperation: Encountered a build number "" that is incompatible with DVTBuildVersion.
2024-12-20 13:55:46.063 xcodebuild[63117:20715952] [MT] DVTDeviceOperation: Encountered a build number "" that is incompatible with DVTBuildVersion.
2024-12-20 13:55:46.063 xcodebuild[63117:20715952] [MT] DVTDeviceOperation: Encountered a build number "" that is incompatible with DVTBuildVersion.
2024-12-20 13:55:47.222 xcodebuild[63117:20715952] Writing error result bundle to /var/folders/vm/yxthgzn14djcm8zqvgbb7d080000gp/T/ResultBundle_2024-20-12_13-55-0047.xcresult
xcodebuild: error: Unable to find a destination matching the provided destination specifier:
                { id:155D1B89-2D15-43A0-8E4D-C710A3D67801 }

        Ineligible destinations for the "timeit" scheme:
                { platform:iOS, id:dvtdevice-DVTiPhonePlaceholder-iphoneos:placeholder, name:Any iOS Device, error:iOS 18.2 is not installed. To use with Xcode, first download and install the platform }