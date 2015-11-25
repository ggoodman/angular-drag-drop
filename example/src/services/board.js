var Angular = require('angular');

module.exports = 'dragular.controller.board';

Angular.module(module.exports, [])

.factory('board', ['$document', '$q', function($document, $q) {
    var board = {};

    var loadImage = function(imgUrl) {
        var dfd = $q.defer();
        var img = new Image();

        var handleImageLoad = function(e) {
            dfd.resolve(img);
        };

        var handleImageError = function(e) {
            dfd.reject(e);
        };

        img.onload = handleImageLoad;
        img.onerror = handleImageError;
        img.crossOrigin = 'anonymous';
        img.src = imgUrl;

        return dfd.promise;
    };

    var createTiles = function(img) {
        var size = Math.min(img.width, img.height);
        var tileSize = Math.floor(size / board.grid);

        for (var x = 0; x < board.grid; x++) {
            for (var y = 0; y < board.grid; y++) {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                canvas.width = tileSize;
                canvas.height = tileSize;

                ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);

                board.tiles[y * board.grid + x] = canvas.toDataURL();
            }
        }

        return board.tiles;
    };


    board.init = function(imgUrl, grid, difficulty) {
        board.imgUrl = imgUrl;
        board.grid = grid || 3;
        board.difficulty = difficulty || 16;
        board.pieces = Array.apply(0, Array(board.grid * board.grid)).map(function(v, k) {
            return k;
        });
        board.tiles = Array.apply(0, Array(board.grid * board.grid));

        return loadImage(board.imgUrl)
            .then(createTiles)
            .then(board.shuffle.bind(board));
    };

    board.shuffle = function() {
        var possibleMoves = [];
        var lastSwap = -1;

        for (var i = 0; i < board.difficulty; i++) {
            var emptyIdx = board.pieces.indexOf(0);
            var emptyPos = board.indexToPos(emptyIdx);

            possibleMoves.length = 0;

            if (emptyPos.x > 0) possibleMoves.push(emptyIdx - 1);
            if (emptyPos.y > 0) possibleMoves.push(emptyIdx - board.grid);
            if (emptyPos.x < board.grid - 1) possibleMoves.push(emptyIdx + 1);
            if (emptyPos.y < board.grid - 1) possibleMoves.push(emptyIdx + board.grid);

            possibleMoves = possibleMoves.filter(function(targetIdx) {
                return targetIdx !== lastSwap;
            });

            var moveIdx = Math.floor(Math.random() * possibleMoves.length);
            var targetIdx = possibleMoves[moveIdx];

            if (targetIdx >= board.pieces.length || emptyIdx >= board.pieces.length) debugger;

            board.pieces[emptyIdx] = board.pieces[targetIdx];
            board.pieces[targetIdx] = 0;

            lastSwap = emptyIdx;
        }

        return board.pieces;
    };

    board.posToIndex = function(posX, posY) {
        var pos = Angular.isObject(posX) ? posX : {
            x: posX,
            y: posY,
        };

        return pos.y * board.grid + pos.x;
    };

    board.indexToPos = function(idx) {
        var x = idx % board.grid;
        var y = Math.floor(idx / board.grid);

        return {
            x: x,
            y: y
        };
    };

    board.isAdjacent = function(idxA, idxB) {
        return (Math.floor(idxA / board.grid) === Math.floor(idxB / board.grid) && Math.abs(idxA - idxB) === 1) || Math.abs(idxA - idxB) === board.grid;
    };

    board.swap = function(idxA, idxB) {
        if (!board.isAdjacent(idxA, idxB)) {
            return;
        }

        var tmp = board.pieces[idxA];

        board.pieces[idxA] = board.pieces[idxB];
        board.pieces[idxB] = tmp;

        return true;
    };

    return board;

}])

;