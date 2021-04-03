
let project_folder = 'online-zoo'; // require('path').basename(__dirname)
let source_forder = "src";

var gr = require('gulp-rename');
let fs = require('fs');
var pathNode = require('path');

let path = {
    build:{
        html:`${project_folder}/pages/`,
        css: `${project_folder}/pages/`,
        js:`${project_folder}/pages/`,
        img:`${project_folder}/assets/images/`,
        fonts:`${project_folder}/assets/fonts/`,
        lib:`${project_folder}/assets/lib/`
    },
    src:{
        html:[`${source_forder}/*.html`, `!${source_forder}/_*.html`],
        css: [`${source_forder}/scss/*.scss`, `!${source_forder}/_*.scss`],
        js:[`${source_forder}/js/*.js`],
        img:`${source_forder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
        fonts:`${source_forder}/fonts/*.ttf`,
        lib:`${source_forder}/lib/**/*.*`
    },
    watch:{
        html:`${source_forder}/**/*.html`,
        css: `${source_forder}/scss/**/*.scss`,
        js:`${source_forder}/js/**/*.js`,
        img:`${source_forder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
        lib:`${source_forder}/lib/**/*.*`
    },
    clean:`./${project_folder}/`
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2');
    fonter = require('gulp-fonter');

function browserSync(params){
    browsersync.init({
        server:{
            baseDir: `./${project_folder}/`
        },
        port: 3000,
        notify: false
    })
}

function html(){
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(gr(function(file) {
            file.dirname = pathNode.join(file.dirname, file.basename);
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}


function css(){
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(gr(function(file) {
            file.dirname = pathNode.join(file.dirname, file.basename);
        }))
        // .pipe(webpcss())
        .pipe(dest(path.build.css))
        // .pipe(clean_css())
        // .pipe(
        //     rename({
        //         extname: '.min.css'
        //     })
        // )
        // .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js(){
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(gr(function(file) {
            file.dirname = pathNode.join(file.dirname, file.basename);
        }))
        .pipe(dest(path.build.js))
        // .pipe(
        //     rename({
        //         extname: '.min.js'
        //     })
        // )
        // .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images(){
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts(){
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

function lib(){
    return src(path.src.lib)
        .pipe(dest(path.build.lib))
        .pipe(browsersync.stream())
}

function watchFiles(){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.lib], lib);
}

function clean(){
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, lib))
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.lib = lib;
exports.build = build;
exports.watch = watch;
exports.default = watch;
