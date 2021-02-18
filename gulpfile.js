const {src, dest, parallel, series, watch} = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const notify = require('gulp-notify')
const sourceMaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const autoPrefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const mediaGroup = require('gulp-group-css-media-queries')
const fileInclude = require('gulp-file-include')
const iconFont = require('gulp-iconfont')
const svgSprite = require('gulp-svg-sprite')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
const uglify = require('gulp-uglify-es').default
const del = require('del')
const resizeImg = require('resize-img')
const zip = require('gulp-zip')

const webpackStream = require('webpack-stream')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


// From build icon fonts
const runTimestamp = Math.round(Date.now()/1000)

// Project name
const projectName = require('./package.json').name

// Bases directory
const dirs = {
    dev: './src',
    prod: './dist',
}

// Paths
const paths = {
    from: {
        html: `${dirs.dev}/views/**/[^_]*.html`,
        scss: `${dirs.dev}/scss/**/*.scss`,
        js: {
            all: `${dirs.dev}/scrips/**/*.js`,
            main: `${dirs.dev}/scrips/main.js`,
        },
        img: {
            all: `${dirs.dev}/static/img/**/*.{jpg,png,svg,gif,ico,webp}`,
            svg: `${dirs.dev}/static/**/*.svg`,
            jpg: `${dirs.dev}/static/img/**/*.jpg`,
            jpeg: `${dirs.dev}/static/img/**/*.jpeg`,
            png: `${dirs.dev}/static/img/**/*.png`,
            gif: `${dirs.dev}/static/img/**/*.gif`,
            ico: `${dirs.dev}/static/img/**/*.ico`,
            webp: `${dirs.dev}/static/img/**/*.webp`,
        },
        fonts: {
            all: `${dirs.dev}/static/fonts/**/*.{ttf,eot,woff,woff2}`,
            ttf: `${dirs.dev}/static/fonts/**/*.ttf`,
            eot: `${dirs.dev}/static/fonts/**/*.eot`,
            woff: `${dirs.dev}/static/fonts/**/*.woff`,
            woff2: `${dirs.dev}/static/fonts/**/*.woff2`,
        }
    },
    to: {
        html: `${dirs.prod}/`,
        css: `${dirs.prod}/css/`,
        js: `${dirs.prod}/js/`,
        img: `${dirs.prod}/static/img/`,
        fonts: `${dirs.prod}/static/fonts/`,
    },
    live: {
        html: `${dirs.dev}/**/*.html`,
        scss: `${dirs.dev}/scss/**/*.scss`,
        js: {
            all: `${dirs.dev}/scrips/**/*.js`,
            main: `${dirs.dev}/scrips/main.js`,
        },
        img: `${dirs.dev}/static/img/**/*.{jpg,png,svg,gif,ico,webp}`,
        fonts: `${dirs.dev}/static/fonts/**/*.{woff, woff2}`,
    },
}

// UIKIT paths
const UIKITpaths = {
    from: {
        scss:  `${dirs.dev}/ui/**/*.scss`,
        js: {
            all: `${dirs.dev}/ui/js/**/*.js`,
            main: `${dirs.dev}/ui/ui.js`
        },
        iocns: `${dirs.dev}/ui/source/iocns/*`,
    },
    to: {
        css: `${dirs.prod}/ui/css/`,
        js: `${dirs.prod}/ui/js/`,
        iocns: `${dirs.prod}/ui/source/iocns/`,
    },
    live: {
        scss:  `${dirs.dev}/ui/**/*.scss`,
        js:  `${dirs.dev}/ui/**/*.js`,
        source: `${dirs.dev}/ui/source/icons/*`
    }
}

// SPSKIT style
const UIKITstyles = () => {
    return src(UIKITpaths.from.scss)
        .pipe(sourceMaps.init())
        .pipe(sass.sync().on('error', notify.onError()))
        .pipe(mediaGroup())
        .pipe(dest(UIKITpaths.to.css))
        .pipe(rename(
            {
                suffix: '.min'
            }
        ))
        .pipe(autoPrefixer( 
            ["last 15 version", "> 1%", "ie 9", "ie 8", "ie 7"], 
            {
                cascade: true
            }
        ))
        .pipe(cleanCSS(
            {
                level: 2
            }
        ))
        .pipe(sourceMaps.write('.'))
        .pipe(dest(UIKITpaths.to.css))
        .pipe(browserSync.stream())
}

// SPSKIT scripts
const UIKITscripts = () => {
    return src(`${UIKITpaths.from.js.main}`)
        .pipe(webpackStream({
            output: {
                filename: 'ui.js'
            },
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env']
                                }
                            }
                        ]
                    }
                ]
            }
        }))
        .pipe(sourceMaps.init())
        .pipe(dest(UIKITpaths.to.js))
        .pipe(uglify().on('error: ', notify.onError()))
        .pipe(rename(
            {
                suffix: '.min'
            }
        ))
        .pipe(sourceMaps.write('.'))
        .pipe(dest(UIKITpaths.to.js))
        .pipe(browserSync.stream())
}

// Live server
const server = () => {
    browserSync.init({
        server: {
            baseDir: dirs.prod,
        },
        host: 3000,
        notify: false,

    })
}

// Views file
const html = () => {
    return src(paths.from.html)
        .pipe(fileInclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(dest(paths.to.html))
        .pipe(browserSync.stream())
}

// Fonts
const fonts = () => {
    return src([
        paths.from.fonts.woff,
        paths.from.fonts.woff2
    ])
        .pipe(dest(paths.to.fonts))
}

// Convert fonts
const convertFonts = () => {
    src(paths.from.fonts.ttf)
        .pipe(ttf2woff())
        .pipe(dest('./src/static/fonts'))
    return src(paths.from.fonts.ttf)
        .pipe(ttf2woff2())
        .pipe(dest('./src/static/fonts'))
}

// Styles file
const styles = () => {
    return src(['./src/styles/**/*.scss', './node_modules'])
        .pipe(sourceMaps.init())
        .pipe(sass.sync().on('error', notify.onError()))
        .pipe(mediaGroup())
        .pipe(dest(paths.to.css))
        .pipe(rename(
            {
                suffix: '.min'
            }
        ))
        .pipe(autoPrefixer( 
            ["last 15 version", "> 1%", "ie 9", "ie 8", "ie 7"], 
            {
                cascade: true
            }
        ))
        .pipe(cleanCSS(
            {
                level: 2
            }
        ))
        .pipe(sourceMaps.write('.'))
        .pipe(dest(paths.to.css))
        .pipe(browserSync.stream())
}

// Scripts
const scripts = () => {
    return src(`./src/scripts/main.js`)
        .pipe(webpackStream({
            output: {
                filename: 'main.js'
            },
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env']
                                }
                            }
                        ]
                    }
                ]
            }
        }))
        .pipe(sourceMaps.init())
        .pipe(dest(paths.to.js))
        .pipe(uglify().on('error: ', notify.onError()))
        .pipe(rename(
            {
                suffix: '.min'
            }
        ))
        .pipe(sourceMaps.write('.'))
        .pipe(dest(paths.to.js))
        .pipe(browserSync.stream())
}

// Images
const images = () => {
    return src(paths.from.img.all)
        .pipe(dest(paths.to.img))
}

// Clean directory
const clean = () => {
    return del(dirs.prod)
}

// Sprite svg
const sprite = () => {
    return src(paths.from.img.svg)
        .pipe(svgSprite({
            mode: {
				stack: {
					sprite: './sprite/sprite.svg',
					example: true
				}
			}
        }))
        .pipe(dest(paths.to.img))
}

// Icon fonts
const createIcon = () => {
    return src(['./src/static/icons/*.svg'])
    .pipe(iconFont({
      fontName: 'iconic', // required
      prependUnicode: true, // recommended option
      formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
      timestamp: runTimestamp, // recommended to get consistent builds when watching files
    }))
      .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g.
        console.log(glyphs, options)
      })
    .pipe(dest('./dist/static/iconsfont/'))
}

// Create favicons
const createFavicons = () => {
    const devices = [
        { 'apple-touch-icon': [57, 60, 72, 76, 114, 120, 144, 152, 180]},
        { 'android-icon': [192]},
        {'favicon': [32, 96, 16]},
    ]
    devices.forEach(type => {
        const name = Object.keys(type)[0]
        type[name].forEach(size => {
            resizeImg(
                fs.readFileSync(`${dirs.dev}`), 
                { width: size, height: size })
            .then(buffer => {
                fs.writeFileSync(
                    `./src/static/img/common/${name}-${size}x${size}.png`, 
                    buffer)
            })
        })
    })
}

// Packing to zip archive
const toZip = () => {
	return src(`${dirs.prod}/*`)
		.pipe(zip(`${projectName}.zip`))
		.pipe(dest('./'))
}


// Watching files
const resourcesWatch = () => {
    watch([paths.live.html], html)
    watch(['./src/styles/**/*.scss'], styles)
    watch([paths.live.img], images)
    watch([paths.live.fonts], fonts)
    watch(['./src/scripts/**/*.js'], scripts)
    watch([UIKITpaths.live.js], UIKITscripts)
    watch([UIKITpaths.live.scss], UIKITstyles)
}

// Common building
const build = series(clean, parallel(UIKITstyles, UIKITscripts, styles, scripts, fonts, images, html), server)
const watching = parallel(build, resourcesWatch)

// Exports
exports.toZip = toZip
exports.createFavicons = createFavicons
exports.convertFonts = convertFonts
exports.fonts = fonts
exports.sprite = sprite
exports.createIcon = createIcon
exports.images = images
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.UIKITstyles = UIKITstyles
exports.UIKITscripts = UIKITscripts
exports.watching = watching
exports.default = watching
