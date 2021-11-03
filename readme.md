
# Training

1. cd storefront_reference_architecture
* `npm i`
* `npm run compile:scss` - Compiles all .scss files into CSS.
* `npm run compile:js` - Compiles all .js files and aggregates them.
* `npm run compile:fonts` - Copies all needed font files. Usually, this only has to be run once.

2. cd training
* `npm run webpack:dev` - Compiles all .scss/js files with watcher.
* or:
* `npm run webpack:prod` - Compiles all .scss/js files without watcher.
