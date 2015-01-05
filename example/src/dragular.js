require("./dragular.css");

var Angular = require("angular");

Angular.module("dragular", [
  require("angular-drag-drop").name,
])

.constant("GRID", 3)
.constant("IMAGE", "http://s1.ibtimes.com/sites/www.ibtimes.com/files/styles/v2_article_large/public/2011/10/26/180060-a-pomeranian-dressed-as-zorro-the-spanish-masked-swordsman-in-the-movi.jpg")
.constant("TILE_SIZE", 100)

.directive("dragularBoard", ["GRID", "TILE_SIZE", function (GRID, TILE_SIZE) {
  var linkFn = function ($scope, $element, $attrs, board) {
    $element.addClass("dr-board");
    
    $element.css({
      width: GRID * TILE_SIZE + "px",
      height: GRID * TILE_SIZE + "px",
    });
    
    board.init();
  };
  
  
  return {
    restrict: "A",
    controller: "BoardController",
    controllerAs: "board",
    require: "dragularBoard",
    link: linkFn,
  };

}])

.controller("BoardController", ["$rootElement", "$rootScope", "GRID", "IMAGE", "TILE_SIZE", function ($rootElement, $rootScope, GRID, IMAGE, TILE_SIZE) {
  var board = this;

  board.pieces = [];
  board.tiles = [];
  
  board.init = function () {
    
    var img = Angular.element(document.createElement("img"));
    
    // Source: http://stackoverflow.com/questions/21933043/split-an-image-using-javascript
    var getClippedRegion = function (image, x, y, width, height) {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      
      canvas.width = TILE_SIZE;
      canvas.height = TILE_SIZE;
      
      //                   source region         dest. region
      ctx.drawImage(image, x, y, width, height,  0, 0, TILE_SIZE, TILE_SIZE);
  
      return canvas;
    };
    
    var onImageLoaded = function (e) {
      var el = img[0];
      var size = Math.min(el.width, el.height);
      var tileSize = Math.floor(size / GRID);
      
      console.log("Image loaded", size);
      
      for (var x = 0; x < GRID; x++) {
        for (var y = 0; y < GRID; y++) {
          board.pieces[y * GRID + x] = y * GRID + x;
          board.tiles[y * GRID + x] = getClippedRegion(el, x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
      
      board.randomize(8);
      
      $rootScope.$digest();
    };
    
    img.css({display: "none"});
    img.on("load", onImageLoaded);
    img.attr("src", IMAGE);
    
    $rootElement.append(img);
    
  };
  
  board.posToIndex = function (posX, posY) {
    var pos = Angular.isObject(posX) ? posX : {
      x: posX,
      y: posY,
    };
    
    return pos.y * GRID + pos.x;
  };
  
  board.indexToPos = function (idx) {
    var y = Math.floor(idx / GRID);
    
    return {
      x: idx - y * GRID,
      y: y
    };
  };
  
  board.randomize = function (iterations) {
    var emptyIdx = board.pieces.indexOf(0);
    
    for (var i = 0; i < iterations; i++) {
      var moves = [];
      var emptyPos = board.indexToPos(emptyIdx);
      
      if (emptyPos.x > 0) moves.push({x: -1, y: 0});
      if (emptyPos.y > 0) moves.push({x: 0, y: -1});
      if (emptyPos.x < GRID) moves.push({x: 1, y: 0});
      if (emptyPos.y < GRID) moves.push({x: 0, y: 1});
      
      var moveIdx = Math.floor(Math.random() * moves.length);
      var move = moves[moveIdx];
      var targetIdx = board.posToIndex(emptyPos.x + move.x, emptyPos.y + move.y);
      var target = board.pieces[targetIdx];
      
      board.swap(emptyIdx, target);
      
      emptyIdx = targetIdx;
    }
    
    console.log(board.pieces);
  };
  
  board.isAdjacent = function (idxA, idxB) {
    return Math.abs(idxA - idxB) === GRID || Math.abs(idxA - idxB) === 1;
  };
  
  board.swap = function (emptyIdx, piece) {
    var pieceIdx = board.pieces.indexOf(piece);
    
    if (pieceIdx >= 0 && board.isAdjacent(emptyIdx, pieceIdx)) {
      board.pieces[emptyIdx] = piece;
      board.pieces[pieceIdx] = 0;
      
      return true;
    }
    console.log("swap", emptyIdx, pieceIdx, piece);
  };
  
}])

.directive("dragularTile", ["TILE_SIZE", function (TILE_SIZE) {
  var linkFn = function ($scope, $element, $attrs, ctls) {
    var board = ctls[0];
    var tile = ctls[1];
    
    var handleMouseEnter = function () {
      if (board.isAdjacent(board.pieces.indexOf($scope.tile), board.pieces.indexOf(0))) {
        $element.addClass("swappable");
      }
    };
    
    var handleMouseLeave = function () {
      $element.removeClass("swappable");
    };
    
    $element.addClass("dr-tile");
    $element.css({
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px",
    });
    
    $element.on("mouseenter", handleMouseEnter);
    $element.on("mouseleave", handleMouseLeave);
    
    $element.append(board.tiles[$scope.tile]);
  };
  
  return {
    restrict: "A",
    controller: "TileController",
    controllerAs: "tile",
    scope: {
      tile: "=dragularTile"
    },
    require: ["^dragularBoard", "dragularTile"],
    link: linkFn,
  };
}])

.controller("TileController", [ function () {
  var tile = this;
}])

.directive("dragularEmpty", ["TILE_SIZE", function (TILE_SIZE) {
  var linkFn = function ($scope, $element, $attrs, ctls) {
    var board = ctls[0];
    var empty = ctls[1];
    
    $element.addClass("dr-tile dr-tile-empty");
    $element.css({
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px",
    });
  };
  
  return {
    restrict: "A",
    controller: "TileController",
    controllerAs: "tile",
    scope: {
      tile: "=dragularEmpty"
    },
    require: ["^dragularBoard", "dragularEmpty"],
    link: linkFn,
  };
}])

;