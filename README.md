

# Commands to setup project

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
