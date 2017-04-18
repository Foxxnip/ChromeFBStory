# Chrome FB Story
Chrome extension that lets you view your friends' Facebook Stories in the browser.

<img src="https://cloud.githubusercontent.com/assets/2003684/25078697/52a9ecda-22ea-11e7-91e4-ad333ab0904e.png"/>
<img src="https://cloud.githubusercontent.com/assets/2003684/25078698/52aa1796-22ea-11e7-997e-d930fc985cf9.png"/>

### Installing Dependencies ###

```
git clone https://github.com/CaliAlec/ChromeFBStory.git

cd ChromeFBStory
npm install
npm install -g gulp

```

### Running and Developing ###

In order to run the extension locally, follow the steps below.

* In the root directory, run:

```
gulp watch

```
* A /build folder will be generated. Visit chrome://extensions/ in your browser, enable Developer mode, and drag the build folder onto the page to install the extension.

* Every time you make a change in the code, the build folder will be regenerated on the fly, but you must go back to chrome://extensions/ and reload the extension to see any changes.

# License

MIT

## Legal

This project is in no way affiliated with, authorized, maintained, sponsored or endorsed by Facebook or any of its affiliates or subsidiaries. This is an independent project that utilizes Facebook's unofficial API. Use at your own risk.