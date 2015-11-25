var Angular = require('angular');

module.exports = 'dragular.controller.game';

Angular.module(module.exports, [
    require('services/board'),
])

.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}])

.controller('GameController', ['$location', '$scope', 'board', function($location, $scope, board) {
    var game = this;
    var defaultImgUrl = 'http://s1.ibtimes.com/sites/www.ibtimes.com/files/styles/v2_article_large/public/2011/10/26/180060-a-pomeranian-dressed-as-zorro-the-spanish-masked-swordsman-in-the-movi.jpg';
    var params = $location.search();
    var clearWinListener;

    var watchForWin = function() {
        if (clearWinListener) clearWinListener();

        clearWinListener = $scope.$watchCollection('game.board.pieces', function(pieces) {
            if (pieces.reduce(function(winning, pieceNum, pieceIdx) {
                    return winning && pieceNum === pieceIdx;
                }, true)) {
                alert('You won in ' + game.moves + ' moves at difficulty ' + game.board.difficulty + '!');

                init();
            }
        });
    };

    var init = function() {
        game.moves = 0;

        game.board.init(params.img || defaultImgUrl, parseInt(params.grid, 10) || 4, parseInt(params.difficulty, 10) || 30)
            .then(watchForWin);
    };

    game.board = board;

    game.move = function(idxA, idxB) {
        if (game.board.swap(idxA, idxB)) game.moves++;
    };

    init();
}])

;