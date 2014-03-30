(function() {
  'use strict';

  var api = 'https://secure.tuhoojabotti.com/gallery/';

  angular.module('photo', ['ngResource', 'ngAnimate'])

  .controller('PhotoController', function ($scope, $resource) {
    var Photo = $resource(api + 'photo/:photoId', {photoId:'@id'},
      {
        'get':  { method: 'GET' },
        'save': { method: 'POST' },
        'all':  { method: 'GET', isArray: true, url: api + 'photos' }
      });

    $scope.photos = Photo.all();

  })

  .directive('runLayout', function ($timeout) {
    return function(scope, element, attrs) {
      if (scope.$last){
        // Do after rendering.
        $timeout(function () {
          layout(250);
        });
      }
    }
  });

  function getheight(images, width) {
    width -= images.length * 5;
    var h = 0;
    for (var i = 0; i < images.length; ++i) {
      h += images[i].dataset.width / images[i].dataset.height;
    }
    return width / h;
  }

  function setheight(images, height) {
    for (var i = 0; i < images.length; ++i) {
      var img = images[i];
      img.style.width = height * img.dataset.width / img.dataset.height + 'px';
      img.style.height = height + 'px';
      // Load smaller image.
      //$(images[i]).attr('src', $(images[i]).attr('src').replace(/w[0-9]+-h[0-9]+/, 'w' + $(images[i]).width() + '-h' + $(images[i]).height()));
    }
  }

  function resize(images, width) {
    setheight(images, getheight(images, width));
  }

  function layout(max_height) {
    var size = window.innerWidth - 10;
    var n = 0;
    var images = [].slice.call(document.querySelectorAll('.photo-container img'));
    w: while (images.length > 0) {
      for (var i = 1; i < images.length + 1; ++i) {
        var slice = images.slice(0, i);
        var h = getheight(slice, size);
        if (h < max_height) {
          setheight(slice, h);
          n++;
          images = images.slice(i);
          continue w;
        }
      }
      setheight(slice, Math.min(max_height, h));
      n++;
      break;
    }
  }

  window.addEventListener('resize', function () { layout(250); });
})();