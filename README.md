# Simple Project Start
A starting point for a simple project with gulp workflow for SCSS, ES6 (no webpack), and HTML. Includes a responsive navbar and flexbox grid. Starting files for a responsive, frontend project.

## Gulp Tasks
gulp (default task): 
* js | transpiles to es5, minimizes, renames, and creates a sourcemap
* scss | autoprefixes, renames w/.min, minimizes
* html | minimizes html
* fonts | moves fonts to dist folder

gulp build:
* deletes the dist folder
* runs all tasks from gulp
* minimizes images

gulp live:
* starts browsersync then watches scss, js, img, html, and font files
* use this to view changes as you make them (serves from dist folder)