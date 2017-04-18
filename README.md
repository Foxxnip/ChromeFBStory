# Chrome FB Story
Chrome extension that lets you view your friends' Facebook Stories in the browser.

<img src="https://cloud.githubusercontent.com/assets/2003684/25114715/94c22c56-23b5-11e7-94a9-64c789e27963.png"/>
<img src="https://cloud.githubusercontent.com/assets/2003684/25114704/8271ee10-23b5-11e7-8b10-864913de7110.png"/>

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
