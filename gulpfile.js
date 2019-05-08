const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync'); // Подключаем Browser Sync

gulp.task('less', () => gulp.src('app/less/**/*.less') // Берем источник
  .pipe(less()) // Преобразуем less в CSS посредством gulp-less
  .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
  .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
);

gulp.task('browser-sync', function() { // Создаем таск browser-sync
  browserSync({ // Выполняем browserSync
      server: { // Определяем параметры сервера
          baseDir: 'app' // Директория для сервера - app
      },
      notify: false // Отключаем уведомления
  });
});

gulp.task('scripts', function() {
  return gulp.src(['app/js/common.js', 'app/libs/**/*.js'])
  .pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
  return gulp.src('app/*.html')
  .pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
  gulp.watch('app/less/**/*.less', gulp.parallel('less')); // Наблюдение за less файлами
  gulp.watch('app/*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
  gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('scripts')); // Наблюдение за главным JS файлом и за библиотеками
});
gulp.task('default', gulp.parallel('less', 'browser-sync', 'watch'));