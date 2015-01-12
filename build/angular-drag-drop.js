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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);


	var Angular = __webpack_require__(1);

	module.exports =
	Angular.module("filearts.dragDrop", [
	])

	.factory("$dragging", [ function () {
	  var data = null;
	  var type = null;
	  
	  return {
	    getData: function () { return data; },
	    getType: function () { return type; },
	    setData: function (newData) { data = newData; return data; },
	    setType: function (newType) { type = newType; return type; },
	  };
	}])

	.directive("dragContainer", ["$parse", function ($parse) {
	  return {
	    restrict: "A",
	    require: "dragContainer",
	    controller: "DragContainerController",
	    controllerAs: "dragContainer",
	    link: function ($scope, $element, $attrs, dragContainer) {
	      dragContainer.init($element, $scope, {
	        onDragStart: $parse($attrs.onDragStart),
	        onDragEnd: $parse($attrs.onDragEnd),
	      });
	      
	      $element.on("dragstart", dragContainer.handleDragStart.bind(dragContainer));
	      $element.on("dragend", dragContainer.handleDragEnd.bind(dragContainer));
	      // $element.on("dragenter", dragContainer.handleDragEnter.bind(dragContainer));
	      
	      $scope.$watch($attrs.dragContainer, dragContainer.updateDragData.bind(dragContainer));
	      $attrs.$observe("mimeType", dragContainer.updateDragType.bind(dragContainer));
	      
	      $attrs.$set("draggable", true);
	    }
	  };
	}])

	.controller("DragContainerController", ["$dragging", function ($dragging) {
	  var dragContainer = this;
	  
	  dragContainer.init = function (el, scope, callbacks) {
	    dragContainer.el = el;
	    dragContainer.scope = scope;
	    dragContainer.callbacks = callbacks;
	  };
	  
	  dragContainer.handleDragStart = function (e) {
	    if (e.originalEvent) e = e.originalEvent;
	    
	    // console.log("handleDragStart", e);
	    
	    try {
	      e.dataTransfer.setData(dragContainer.type, dragContainer.data);
	    } catch (ex) {
	      // Fallback for IE.. YAY!
	      e.dataTransfer.setData("text", dragContainer.data);
	    }
	    e.dataTransfer.effectAllowed = "move";
	    e.dataTransfer.dropEffect = "move";
	    
	    dragContainer.el.addClass("drag-container-active");
	    dragContainer.dragging = true;
	    
	    $dragging.setData(dragContainer.data);
	    $dragging.setType(dragContainer.type);

	    if (dragContainer.callbacks.onDragStart) {
	      dragContainer.callbacks.onDragStart(dragContainer.scope, {$event: e});
	    }
	  };
	  
	  dragContainer.handleDragEnd = function (e) {
	    if (e.originalEvent) e = e.originalEvent;
	    
	    Angular.element(e.target).removeClass("drag-active");
	    
	    dragContainer.el.removeClass("drag-container-active");
	    dragContainer.dragging = false;
	    
	    $dragging.setData(null);
	    $dragging.setType(null);

	    if (dragContainer.callbacks.onDragEnd) {
	      dragContainer.callbacks.onDragEnd(dragContainer.scope, {$event: e});
	    }
	  };
	  
	  dragContainer.updateDragData = function (data) {
	    // console.log("dragContainer.updateDragData", data);
	    
	    dragContainer.data = data;
	    
	    if (dragContainer.dragging) $dragging.setData(dragContainer.data);
	  };
	  
	  dragContainer.updateDragType = function (type) {
	    // console.log("dragContainer.updateDragType", type);
	    
	    dragContainer.type = type || "text/x-drag-data";
	    
	    if (dragContainer.dragging) $dragging.setType(dragContainer.type);
	  };
	}])


	.directive("dropContainer", ["$document", "$parse", function ($document, $parse) {
	  return {
	    restrict: "A",
	    require: "dropContainer",
	    controller: "DropContainerController",
	    controllerAs: "dropContainer",
	    link: function ($scope, $element, $attrs, dropContainer) {
	      var bindTo = function (event) {
	        return function (e) {
	          return $scope.$apply(function() {
	            return dropContainer['handle' + event](e);
	          });
	        };
	      };
	      
	      var dragEnd = dropContainer.handleDragEnd.bind(dropContainer);
	      var handleDragEnter = bindTo('DragEnter');
	      var handleDragOver = bindTo('DragOver');
	      var handleDragLeave = bindTo('DragLeave');
	      var handleDrop = bindTo('Drop');
	      
	      
	      dropContainer.init($element, $scope, {
	        onDragEnter: $parse($attrs.onDragEnter),
	        onDragOver: $parse($attrs.onDragOver),
	        onDragLeave: $parse($attrs.onDragLeave),
	        onDrop: $parse($attrs.onDrop),
	      });
	      
	      $element.on("dragenter", handleDragEnter);
	      $element.on("dragover", handleDragOver);
	      $element.on("dragleave", handleDragLeave);
	      $element.on("drop", handleDrop);
	      
	      $scope.$watch($attrs.accepts, dropContainer.updateMimeTypes.bind(dropContainer));
	      
	      $document.on("dragend", dragEnd);
	      
	      $scope.$on("$destroy", function () {
	        $document.off("dragend", dragEnd);
	      });
	    }
	  };
	}])

	.controller("DropContainerController", ["$dragging", function ($dragging) {
	  var dropContainer = this;
	  var targets = {};
	  var validAnchors = "center top top-right right bottom-right bottom bottom-left left top-left".split(" ");
	  
	  dropContainer.init = function (el, scope, callbacks) {
	    dropContainer.el = el;
	    dropContainer.scope = scope;
	    dropContainer.callbacks = callbacks;
	    dropContainer.accepts = ["text/x-drag-data"];
	    
	    dropContainer.el.addClass("drop-container");
	  };
	  
	  dropContainer.addDropTarget = function (anchor, dropTarget) {
	    if (validAnchors.indexOf(anchor) < 0) throw new Error("Invalid anchor point " + anchor);
	    if (targets[anchor]) throw new Error("Duplicate drop targets for the anchor " + anchor);
	    
	    targets[anchor] = dropTarget;
	  };
	  
	  dropContainer.removeDropTarget = function (anchor) {
	    if (targets[anchor] && targets[anchor] === anchor) {
	      dropContainer.activeTarget = null;
	    }
	    
	    delete targets[anchor];
	  };
	  
	  dropContainer.updateMimeTypes = function (mimeTypes) {
	    if (!mimeTypes) mimeTypes = ["text/x-drag-data"];
	    if (!Angular.isArray(mimeTypes)) mimeTypes = [mimeTypes];
	    
	    // console.log("dropContainer.updateMimeTypes", mimeTypes);
	    
	    dropContainer.accepts = mimeTypes;
	  };
	  
	  dropContainer.updateDragTarget = function (e, skipUpdateTarget) {
	    if (e.originalEvent) e = e.originalEvent;
	    
	    var activeTarget = null;
	    var activeAnchor = null;
	    var minDistanceSq = Number.MAX_VALUE;
	    
	    var prevAnchor = dropContainer.activeAnchor;
	    var prevTarget = dropContainer.activeTarget;

	    if (!skipUpdateTarget) {
	      Angular.forEach(targets, function (dropTarget, anchor) {
	        var width = dropContainer.el[0].offsetWidth;
	        var height = dropContainer.el[0].offsetHeight;
	        var anchorX = width / 2;
	        var anchorY = height / 2;
	        
	        if (anchor.indexOf("left") >= 0) anchorX = 0;
	        if (anchor.indexOf("top") >= 0) anchorY = 0;
	        if (anchor.indexOf("right") >= 0) anchorX = width;
	        if (anchor.indexOf("bottom") >= 0) anchorY = height;
	  
	        var distanceSq = Math.pow(anchorX - e.offsetX, 2) + Math.pow(anchorY - e.offsetY, 2);
	        
	        if (distanceSq < minDistanceSq) {
	          activeAnchor = anchor;
	          activeTarget = dropTarget;
	          minDistanceSq = distanceSq;
	        }
	      });
	    }
	    
	    dropContainer.activeAnchor = activeAnchor;
	    dropContainer.activeTarget = activeTarget;
	    
	    var eventData = {
	      $event: e,
	      data: $dragging.getData(),
	      anchor: activeAnchor,
	      target: activeTarget,
	      prevAnchor: prevAnchor,
	      prevTarget: prevTarget,
	    };

	    if (prevTarget !== activeTarget) {
	      if (prevTarget) {
	        dropContainer.el.removeClass("drop-container-active-" + prevAnchor);
	        prevTarget.handleDragLeave(eventData);
	      }
	      
	      if (activeTarget) {
	        dropContainer.el.addClass("drop-container-active-" + activeAnchor);
	        activeTarget.handleDragEnter(eventData);
	      }
	    }
	    
	    return eventData;
	  };
	  
	  dropContainer.handleDragEnter = function (e) {
	    if (e.originalEvent) e = e.originalEvent;
	    
	    // console.log("handleDragEnter", e, dropContainer.accepts, $dragging.getType());
	    
	    if (!dropContainer.accepts || dropContainer.accepts.indexOf($dragging.getType()) >= 0) {
	      e.preventDefault();
	    } else {
	      return;
	    }
	    
	    var eventData = dropContainer.updateDragTarget(e);
	    
	    dropContainer.el.children().css({'pointer-events': 'none'});
	    dropContainer.el.addClass("drop-container-active");

	    if (dropContainer.callbacks.onDragEnter) {
	      dropContainer.callbacks.onDragEnter(dropContainer.scope, eventData);
	    }
	  };
	  
	  dropContainer.handleDragOver = function (e) {
	    if (e.originalEvent) e = e.originalEvent;
	    
	    // console.log("dropContainer.handleDragOver", e);

	    if (!dropContainer.accepts || dropContainer.accepts.indexOf($dragging.getType()) >= 0) {
	      e.preventDefault();
	    } else {
	      return;
	    }
	    
	    var eventData = dropContainer.updateDragTarget(e);
	    
	    if (eventData.target) {
	      eventData.target.handleDragOver(eventData);
	    }

	    if (dropContainer.callbacks.onDragOver) {
	      dropContainer.callbacks.onDragOver(dropContainer.scope, eventData);
	    }
	  };
	  
	  dropContainer.handleDragLeave = function (e) {
	    if (e.originalEvent) e = e.originalEvent;
	    
	    // console.log("dropContainer.handleDragLeave", e);

	    var eventData = dropContainer.updateDragTarget(e, true);
	    
	    dropContainer.el.children().css({'pointer-events': null});
	    dropContainer.el.removeClass("drop-container-active");

	    if (dropContainer.callbacks.onDragLeave) {
	      dropContainer.callbacks.onDragLeave(dropContainer.scope, eventData);
	    }
	  };
	  
	  dropContainer.handleDragEnd = function (e) {
	    if (e.originalEvent) e = e.originalEvent;
	    
	    // console.log("dropContainer.handleDragEnd", e);

	    dropContainer.updateDragTarget(e, true);    

	    dropContainer.el.children().css({'pointer-events': null});
	    dropContainer.el.removeClass("drop-container-active");
	  };
	  
	  dropContainer.handleDrop = function (e) {
	    if (e.originalEvent) e = e.originalEvent;
	    
	    // console.log("dropContainer.handleDrop", e);
	    
	    if (!dropContainer.accepts || dropContainer.accepts.indexOf($dragging.getType()) >= 0) {
	      e.preventDefault();
	    } else {
	      return;
	    }

	    var eventData = dropContainer.updateDragTarget(e);
	    
	    if (eventData.target) {
	      eventData.target.handleDrop(eventData);
	    }
	    
	    if (dropContainer.callbacks.onDrop) {
	      dropContainer.callbacks.onDrop(dropContainer.scope, eventData);
	    }
	    
	    this.handleDragEnd(e);
	  };
	}])

	.directive("dropTarget", ["$parse", function ($parse) {
	  return {
	    restrict: "A",
	    require: ["^dropContainer", "dropTarget"],
	    controller: "DropTargetController",
	    controllerAs: "dropTarget",
	    link: function ($scope, $element, $attrs, ctrls) {
	      var dropContainer = ctrls[0];
	      var dropTarget = ctrls[1];
	      var anchor = $attrs.dropTarget || "center";
	      var destroy = dropContainer.removeDropTarget.bind(dropContainer, anchor);
	      
	      $element.addClass("drop-target drop-target-" + anchor);
	      
	      dropTarget.init($element, $scope, {
	        onDragEnter: $parse($attrs.onDragEnter),
	        onDragOver: $parse($attrs.onDragOver),
	        onDragLeave: $parse($attrs.onDragLeave),
	        onDrop: $parse($attrs.onDrop),
	      });
	      
	      dropContainer.addDropTarget(anchor, dropTarget);
	      
	      $scope.$on("$destroy", destroy);
	    }
	  };
	}])


	.controller("DropTargetController", [function () {
	  var dropTarget = this;

	  dropTarget.init = function (el, scope, callbacks) {
	    dropTarget.el = el;
	    dropTarget.scope = scope;
	    dropTarget.callbacks = callbacks;
	  };
	  
	  dropTarget.handleDragEnter = function (eventData) {
	    // console.log("dropTarget.handleDragEnter", eventData);
	    
	    dropTarget.el.addClass("drop-target-active");
	    
	    if (dropTarget.callbacks.onDragEnter) {
	      dropTarget.callbacks.onDragEnter(dropTarget.scope, eventData);
	    }
	  };
	  
	  dropTarget.handleDragOver = function (eventData) {
	    // console.log("dropTarget.handleDragOver", eventData);
	    
	    if (dropTarget.callbacks.onDragOver) {
	      dropTarget.callbacks.onDragOver(dropTarget.scope, eventData);
	    }
	  };
	  
	  dropTarget.handleDragLeave = function (eventData) {
	    // console.log("dropTarget.handleDragLeave", eventData);
	    
	    dropTarget.el.removeClass("drop-target-active");
	    
	    if (dropTarget.callbacks.onDragLeave) {
	      dropTarget.callbacks.onDragLeave(dropTarget.scope, eventData);
	    }
	  };
	  
	  dropTarget.handleDrop = function (eventData) {
	    // console.log("dropTarget.handleDrop", eventData);
	    
	    if (dropTarget.callbacks.onDrop) {
	      dropTarget.callbacks.onDrop(dropTarget.scope, eventData);
	    }
	  };
	}])


	;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/home/filearts/workspace/angular-drag-drop/node_modules/css-loader/index.js!/home/filearts/workspace/angular-drag-drop/src/angular-drag-drop.css", function() {
			var newContent = require("!!/home/filearts/workspace/angular-drag-drop/node_modules/css-loader/index.js!/home/filearts/workspace/angular-drag-drop/src/angular-drag-drop.css");
			if(typeof newContent === 'string') newContent = [module.id, newContent, ''];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	exports.push([module.id, "[drag-container] {\n    -khtml-user-drag: element;\n    -webkit-user-drag: element;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    user-drag: element;\n    user-select: none;\n}\n\n[drop-container] {\n    position: relative;\n}\n\n[drop-target] {\n    position: absolute;\n    display: none;\n}\n[drop-target].drop-target-active {\n    display: block;\n    pointer-events: none;\n}\n\n.drop-target-center {\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n}\n\n.drop-target-top {\n    top: 0;\n    right: 0;\n    height: 50%;\n    left: 0;\n}\n\n.drop-target-top-right {\n    top: 0;\n    right: 0;\n    height: 50%;\n    width: 50%;\n}\n\n.drop-target-right {\n    top: 0;\n    right: 0;\n    bottom: 0;\n    width: 50%;\n}\n\n.drop-target-bottom-right {\n    height: 50%;\n    right: 0;\n    bottom: 0;\n    width: 50%;\n}\n\n.drop-target-bottom {\n    height: 50%;\n    right: 0;\n    bottom: 0;\n    left: 0;\n}\n\n.drop-target-bottom-left {\n    height: 50%;\n    width: 50%;\n    bottom: 0;\n    left: 0;\n}\n\n.drop-target-left {\n    top: 0;\n    right: 50%;\n    bottom: 0;\n    left: 0;\n}\n\n.drop-target-top-left {\n    top: 0;\n    width: 50%;\n    height: 50%;\n    left: 0;\n}", ""]);

/***/ },
/* 4 */
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
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();

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

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
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

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
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

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:stylesheet/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
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
		return list;
	}

/***/ }
/******/ ])
});
