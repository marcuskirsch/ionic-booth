# Ionic Booth

This is the repository of the Ionic Photo Booth App. We use Ionic 3 with Angular 4.

The app shows a photo gallery with pictures of a Dropbox folder. You can also take own pictures that will be shown at the slideshow.

To use the app you need the [dropbox-booth](https://github.com/marcuskirsch/dropbox-booth). This server takes the communication with Dropbox. When you start your app at first time it will download all images from a defined Dropbox folder. Afterwards, all the pictures are stored in the local memory.

Other people can also upload pictures to the defined Dropbox-Folder. For this purpose, the users must call an URL that is stored in the app with their browser. Then the user will be forwarded to a page with an image upload function. If an image has been uploaded, the app will be notified via websockets and  download the image.

## Getting Started

To get started, clone this repo, and run `npm install` in the root directory. After this run `ionic serve`. This will start the dev server and open your browser at `http://localhost:8100/`.

## Communication with Dropbox Booth

If the app should communicate with the Dropbox Booth, you need to configure the `HOST` constant at `sync.ts`. For example you start the server on your local machine `HOST = 'http://localhost:5000'`.

