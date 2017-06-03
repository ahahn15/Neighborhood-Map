# Neighborhood Map project
*Project #5 of the Udacity Front End Developer Nanodegree*

This project required developing a single-page application featuring a map of a favorite neighborhood.

Features include:
- A Google Maps view with map markers to identify popular locations
- a search function to easily discover these locations
- a listview to support simple browsing of all locations
- integration with an additional third-party API to provide information about each locations
- a responsive UI

## The Site

The website is hosted on Github pages:
[https://ahahn15.github.io/Performance-Optimization/](https://ahahn15.github.io/Performance-Optimization/)

This site uses the KnockoutJS framework to implement observables, event handlers, filters, and to handle other state changes. It uses the Google Maps API along with markers and infowindows, and the Wikimedia API to access Wikipedia content for each location. All API calls are made asynchronously with appropriate error handling.

## The Build

The project uses Gulp to minify CSS, HTML, and JS files.

### Install Gulp

`npm install -g gulp`

### Run Gulp
- `gulp`
The default Grunt command runs the uglify, imagemin, htmlmin, and cssmin tasks. Details are below.

- `grunt uglify`
Minifies all JavaScript files in src/ and saves to dist/.
More [here](https://github.com/gruntjs/grunt-contrib-uglify)

- `grunt imagemin`
Compresses all .png and .jpg images in src/ and saves to dist/.
More [here](https://github.com/gruntjs/grunt-contrib-imagemin)

### Publish changes
The GitHub Pages site is configured to be built from the gh-pages branch, so in order to see changes applied, the dist directory should be pushed to that branch:

`git subtree push --prefix dist origin gh-pages`
