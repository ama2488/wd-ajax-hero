$(document).ready(() => {
  let movies = [];

  const renderMovies = function () {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.Title,
      });

      $title.tooltip({ delay: 50 }).text(movie.Title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.Poster,
        alt: `${movie.Poster} Poster`,
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.imdbID}`);
      $plot.text('Plot Synopsis');
      $plot.addClass('.modal-trigger');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.imdbID);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.Title);
      const $movieYear = $('<h6>').text(`Released in ${movie.Year}`);
      const $modalText = $('<p>').text(movie.Plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal({ top: 200, overlay: 0.4, closeButton: '.modal_close' });
    }
  };

  $('form').on('submit', (e) => {
    e.preventDefault();
    if ($('#search').val() !== '') {
      movies = [];
      const movie = ($('#search').val());
      const $httpReq = $.getJSON(`https://www.omdbapi.com/?s=${movie}`);

      $httpReq.done((data) => {
        if ($httpReq.status !== 200) {
          return;
        }
        for (let i = 0; i < data.Search.length; i++) {
          const $plotReq = $.getJSON(`https://www.omdbapi.com/?i=${data.Search[i].imdbID}&plot=full`);
          $plotReq.done((data) => {
            if ($plotReq.status !== 200) {
              return;
            }
            movies.push(data);
            renderMovies();
          });
        }
      });
    }
  });
});
