<h1 align="center">
PokeApp
</h1>
<p align="center">
    <a href="https://github.com/marlonbelomarques/pokeapp">
    <img alt="pokeapp" src="./readme/images/icon.png" width="200px" />
  </a>
</p>
<p align="center">
  <a href="https://github.com/MarlonBeloMarques">
    <img alt="Made by Marlon Marques" src="https://img.shields.io/badge/made%20by-Marlon%20Marques-brightgreen">
  </a>
</p>

PokeApp has been tested and configured for IOS devices only.

Get access to a huge list of pokemons with images and characteristics and the best thing is, after loading the pokemons you don't need internet anymore to see your pokemons.

----

<p align="center">
    <img src="./readme/images/login.png" width="225" height="487" />
    <img src="./readme/images/home_ivysaur.png" width="225" height="487" />
    <img src="./readme/images/home_blastoise.png" width="225" height="487" />
</p>

----

This README will cover a little about the main tools used as well as running PokeApp locally.

* Prerequisites
* Configuration
* Build
* Contact

----
## Prerequisites

If you have no idea how to install React Native and run it locally, check this *[Get started](https://archive.reactnative.dev/docs/getting-started)*.

### Firebase

PokeApp uses Firebase Analytics, Crashlytics and Auth, if you have no idea how to create a Firebase account and configure it, *[Start here](https://rnfirebase.io/)*.

### CodePush

For you to configure Code Push you will need to create an account and configure your environment, to help you, you can *[Start here](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)*.

### Fastlane

To make the publishing and authoring process easier, you will need to set up your environment, check *[these steps](https://www.cloudbees.com/blog/react-native-developer-series-ios-and-android-fastlane-setup-and-certificates)*.

## Configuration
#### If you've gone through the prerequisites phase, then it's almost all ready, we just need to reinforce that it's all set up.

- In your project's Firebase Console, download the `GoogleService-Info.plist` file and add it to the root of the **ios** folder.
- Check the `.env.development` and `.env.production` files and add in **WEB_CLIENT_ID_GOOGLE** add your **key** which can be found in `GoogleService-Info.plist`.
- Still in `GoogleService-Info.plist`, get the key **REVERSED_CLIENT_ID** and add it to `Info.plist` in the **URL Types** area, in the **URL Schemes** field.
- With the CodePush key in hand, add inside your `Info.plist` a new key named **CodePushDeploymentKey** and the key you got.

Reinforcing what was done during the prerequisites, you should be able to configure your project without any problems.
## Build

## Contact

