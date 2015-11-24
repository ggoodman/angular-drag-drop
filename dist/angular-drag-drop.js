(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define(["angular"], factory);
	else if(typeof exports === 'object')
		exports["AngularDragDrop"] = factory(require("angular"));
	else
		root["AngularDragDrop"] = factory(root["angular"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Angular = __webpack_require__(1);

	__webpack_require__(2);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/less-loader/index.js!./angular-drag-drop.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/less-loader/index.js!./angular-drag-drop.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".drag-active .drop-container {\n  position: relative;\n}\n.drag-active .drop-container * {\n  pointer-events: none;\n}\n.drag-active .drop-container:before {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 9999;\n  content: \"\";\n}\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ])
});
;