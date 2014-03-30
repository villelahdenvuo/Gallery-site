// layout images
$(function () {

HEIGHTS = [];

function getheight(images, width) {
  width -= images.length * 5;
  var h = 0;
  for (var i = 0; i < images.length; ++i) {
    h += $(images[i]).data('width') / $(images[i]).data('height');
  }
  return width / h;
}

function setheight(images, height) {
  HEIGHTS.push(height);
  for (var i = 0; i < images.length; ++i) {
    $(images[i]).css({
      width: height * $(images[i]).data('width') / $(images[i]).data('height'),
      height: height
    });
    $(images[i]).attr('src', $(images[i]).attr('src').replace(/w[0-9]+-h[0-9]+/, 'w' + $(images[i]).width() + '-h' + $(images[i]).height()));
  }
}

function resize(images, width) {
  setheight(images, getheight(images, width));
}

function run(max_height) {
  var size = window.innerWidth - 50;

  var n = 0;
  var images = $('.photo-container img');
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

window.addEventListener('resize', function () { run(250); });
$(function () { run(250); });

});

(function() {
  'use strict';

  angular.module('gallery', [
    'http-auth-interceptor',
    'login',
    'rating'
  ])

  .controller('GalleryController', function ($scope) {
    $scope.logged = false;
    $scope.name = '';

    $scope.$on('event:auth-loginRequired', function() {
      $scope.logged = false;
      console.log('show modal');
      $('#login').modal('show');
    });

    $scope.$on('event:auth-loginConfirmed', function() {
      $scope.logged = true;
      console.log('logged in!');
      $('#login').modal('hide');
      FB.api('/me', function(response) {
        $scope.name = response.name;
        $scope.$digest();
      });
    });

    $scope.$on('event:auth-loginCancelled', function() {
      $scope.logged = false;
      console.log('login cancelled!');
      $scope.name = '';
      $scope.$digest();
    });
  });

})();