var Angular = require('angular');

require('./angular-drag-drop.less');

module.exports = 'filearts.dragDrop';

var mod = Angular.module(module.exports, []);


mod.factory('dragContext', ['$rootElement', function($rootElement) {
    var context = {};

    return reset();

    function reset() {
        return Angular.extend(context, {
            data: null,
            reset: reset,
            start: start,
        });
    }

    function start(data) {
        context.data = data;

        return data;
    }
}]);

mod.run(['$rootElement', '$timeout', function ($rootElement, $timeout) {
    $rootElement[0].addEventListener('dragend', onDragEnd, true);
    $rootElement[0].addEventListener('drop', onDrop, true);
    
    
    function onDragEnd(event) {
        clearDragActive();
    }
    
    function onDrop(event) {
        clearDragActive();
    }
    
    function clearDragActive() {
        $timeout(function () {
            $rootElement.removeClass('drag-active');
        });
    }
}]);

mod.directive('dragContainer', ['$rootElement', '$parse', '$timeout', 'dragContext', function($rootElement, $parse, $timeout, dragContext) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            var onDragStart = $attrs.onDragStart ? $parse($attrs.onDragStart) : null;
            var onDragEnd = $attrs.onDragEnd ? $parse($attrs.onDragEnd) : null;

            $attrs.$addClass('drag-container');

            $scope.$watch($attrs.dragContainer, function(draggable) {
                $attrs.$set('draggable', typeof draggable === 'undefined' || draggable);
            });

            $element.on('dragstart', handleDragStart);
            $element.on('dragend', handleDragEnd);

            function handleDragStart(e) {
                $timeout(function () {
                    $rootElement.addClass('drag-active');
                }, 0, false);
                
                dragContext.start($attrs.dragData ? $scope.$eval($attrs.dragData) : $element);
                $element.addClass('drag-container-active');
                
                if (onDragStart) {
                    var locals = {
                        $event: e,
                        $dragData: dragContext.data,
                    };

                    $scope.$apply(function() {
                        onDragStart($scope, locals);
                    });
                }
            }

            function handleDragEnd(e) {
                $timeout(function() {
                    $rootElement.removeClass('drag-active');
                }, 0, false);

                dragContext.reset();
                $element.removeClass('drag-container-active');

                if (onDragEnd) {
                    var locals = {
                        $event: e,
                        $dragData: dragContext.data,
                    };


                    $scope.$apply(function() {
                        onDragEnd($scope, locals);
                    });
                }
                
                if (dragContext.lastTarget) {
                    dragContext.lastTarget.$attrs.$removeClass('drag-over');
                }
            }
        }
    };
}]);

mod.directive('dropContainer', ['$document', '$parse', '$window', 'dragContext', function($document, $parse, $window, dragContext) {
    return {
        restrict: 'A',
        require: 'dropContainer',
        controller: 'DropContainerController',
        controllerAs: 'dropContainer',
        link: function($scope, $element, $attrs, dropContainer) {
            var acceptsFn = $attrs.dropAccepts ? $parse($attrs.dropAccepts) : function($scope, locals) {
                return typeof locals.$dragData !== 'undefined';
            };
            var onDragEnter = $attrs.onDragEnter ? $parse($attrs.onDragEnter) : null;
            var onDragOver = $attrs.onDragOver ? $parse($attrs.onDragOver) : null;
            var onDragLeave = $attrs.onDragLeave ? $parse($attrs.onDragLeave) : null;
            var onDrop = $attrs.onDrop ? $parse($attrs.onDrop) : null;

            $attrs.$addClass('drop-container');

            $element.on('dragover', handleDragOver);
            $element.on('dragenter', handleDragEnter);
            $element.on('dragleave', handleDragLeave);
            $element.on('drop', handleDrop);

            function handleDragEnter(e) {
                if (dragContext.lastTarget && dragContext.lastTarget !== $element) {
                    dragContext.lastTarget.$attrs.$removeClass('drag-over');
                }

                dragContext.lastTarget = {
                    $attrs: $attrs,
                    $element: $element,
                };

                var locals = {
                    $event: e,
                    $dragData: dragContext.data,
                };

                if (acceptsFn($scope, locals)) {
                    e.preventDefault();

                    $attrs.$addClass('drag-over');

                    if (onDragEnter) {
                        $scope.$apply(function() {
                            onDragEnter($scope, locals);
                        });
                    }
                }
            }

            function handleDragOver(e) {
                var locals = {
                    $event: e,
                    $dragData: dragContext.data,
                };

                if (acceptsFn($scope, locals)) {
                    e.preventDefault();

                    var pos = offset($element);

                    $attrs.$addClass('drag-over');

                    var minDistanceSq = Number.MAX_VALUE;
                    var width = pos.width;
                    var height = pos.height;
                    var x = e.pageX - pos.left;
                    var y = e.pageY - pos.top;
                    var closestTarget = dropContainer.lastTarget;

                    Angular.forEach(dropContainer.targets, function(dropTarget, anchor) {
                        var anchorX = width / 2;
                        var anchorY = height / 2;

                        if (anchor.indexOf("left") >= 0) anchorX = width * 1 / 4;
                        if (anchor.indexOf("top") >= 0) anchorY = height * 1 / 4;
                        if (anchor.indexOf("right") >= 0) anchorX = width * 3 / 4;
                        if (anchor.indexOf("bottom") >= 0) anchorY = height * 3 / 4;

                        var distanceSq = Math.pow(anchorX - x, 2) + Math.pow(anchorY - y, 2);

                        if (distanceSq < minDistanceSq) {
                            closestTarget = dropTarget;
                            minDistanceSq = distanceSq;
                        }
                    });

                    $scope.$apply(function() {
                        if (onDragOver) {
                            onDragOver($scope, locals);
                        }
    
                        if (!closestTarget) return;
    
                        if (closestTarget !== dropContainer.lastTarget) {
                            if (dropContainer.lastTarget) {
                                $attrs.$removeClass('drop-container-' + dropContainer.lastTarget.anchor);
                            }
    
                            $attrs.$addClass('drop-container-' + closestTarget.anchor);
    
                            if (dropContainer.lastTarget) {
                                dropContainer.lastTarget.handleDragLeave(e, locals);
                            }
    
                            closestTarget.handleDragEnter(e, locals);
    
                            dropContainer.lastTarget = closestTarget;
                        }
    
                        closestTarget.handleDragOver(e);
                    });
                }
            }

            function handleDragLeave(e) {
                $attrs.$removeClass('drag-over');

                var locals = {
                    $event: e,
                    $dragData: dragContext.data,
                };

                $scope.$apply(function() {
                    if (onDragLeave) {
                        onDragLeave($scope, locals);
                    }
    
                    if (dropContainer.lastTarget) {
                        dropContainer.lastTarget.handleDragLeave(e, locals);
                    }
    
                    if (dropContainer.lastTarget) {
                        $attrs.$removeClass('drop-container-' + dropContainer.lastTarget.anchor);
    
                        dropContainer.lastTarget = null;
                    }
                });
            }

            function handleDrop(e) {
                if (dragContext.lastTarget) {
                    dragContext.lastTarget.$attrs.$removeClass('drag-over');
                }

                var locals = {
                    $event: e,
                    $dragData: dragContext.data,
                };

                if (acceptsFn($scope, locals)) {

                    e.preventDefault();
                    dragContext.reset();

                    $scope.$apply(function() {
                        if (onDrop) {
                            onDrop($scope, locals);
                        }
    
                        if (dropContainer.lastTarget) {
                            dropContainer.lastTarget.handleDrop(e, locals);
                        }
                    });
                }

                if (dropContainer.lastTarget) {
                    $attrs.$removeClass('drop-container-' + dropContainer.lastTarget.anchor);
                }

                dropContainer.lastTarget = null;
            }
        }
    };

    // Source: https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js
    function getRawNode(elem) {
        return elem[0] || elem;
    }

    // Source: https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js
    function offset(elem) {
        elem = getRawNode(elem);

        var elemBCR = elem.getBoundingClientRect();
        return {
            width: Math.round(Angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
            height: Math.round(Angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
            top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
            left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
        };
    }
}]);

mod.controller('DropContainerController', [function() {
    var dropContainer = this;
    var validAnchors = 'center top top-right right bottom-right bottom bottom-left left top-left'
        .split(' ');

    dropContainer.targets = {};
    dropContainer.lastTarget = null;

    dropContainer.attach = function(dropTarget) {
        var anchor = dropTarget.anchor;

        if (validAnchors.indexOf(anchor) < 0) {
            throw new Error('Invalid drop target anchor `' + anchor + '`.');
        }

        dropContainer.targets[anchor] = dropTarget;

        return dropTarget;
    };

    dropContainer.detach = function(dropTarget) {
        var anchor = dropTarget.anchor;

        if (validAnchors.indexOf(anchor) < 0) {
            throw new Error('Invalid drop target anchor `' + anchor + '`.');
        }

        if (!dropContainer.targets[anchor] === dropTarget) {
            throw new Error('The indicated drop target is not attached at ' + 'the anchor `' + anchor + '`.');
        }

        delete dropContainer.targets[anchor];

        return dropTarget;
    };
}]);

mod.directive('dropTarget', ['$parse', 'dragContext', function($parse, dragContext) {
    return {
        restrict: 'A',
        require: ['^dropContainer', 'dropTarget'],
        scope: true,
        bindToController: {
            anchor: '@dropTarget',
        },
        controller: Angular.noop,
        controllerAs: 'dropTarget',
        link: function($scope, $element, $attrs, ctls) {
            var dropContainer = ctls[0];
            var dropTarget = ctls[1];

            $attrs.$addClass('drop-target');

            dropTarget.$attrs = $attrs;
            dropTarget.$scope = $scope;

            $attrs.$addClass('drop-target drop-target-' + dropTarget.anchor);

            dropContainer.attach(dropTarget);

            var onDragEnter = dropTarget.$attrs.onDragEnter ? $parse(dropTarget.$attrs.onDragEnter) : Angular.noop;
            var onDragLeave = dropTarget.$attrs.onDragLeave ? $parse(dropTarget.$attrs.onDragLeave) : Angular.noop;
            var onDragOver = dropTarget.$attrs.onDragOver ? $parse(dropTarget.$attrs.onDragOver) : Angular.noop;
            var onDrop = dropTarget.$attrs.onDrop ? $parse(dropTarget.$attrs.onDrop) : Angular.noop;

            dropTarget.handleDragEnter = function(e, locals) {
                onDragEnter(dropTarget.$scope, locals);
            };

            dropTarget.handleDragLeave = function(e, locals) {
                onDragLeave(dropTarget.$scope, locals);
            };

            dropTarget.handleDragOver = function(e, locals) {
                onDragOver(dropTarget.$scope, locals);
            };

            dropTarget.handleDrop = function(e, locals) {
                onDrop(dropTarget.$scope, locals);
            };

            $scope.$on('$destroy', function() {
                dropContainer.detach(dropTarget);
            });
        }
    };
}]);
