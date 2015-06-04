require("./angular-drag-drop.css");


var Angular = require("angular");

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

.factory("$dragData", [ function () {
  function DragData () {
    this.data = null;
    this.type = null;
  }
  
  DragData.prototype.clearData = function (e) {
    var eventData = {
      $data: this.data,
      $type: this.type,
    };
    
    this.data = null;
    this.type = null;
    
    return eventData;
  };
  
  DragData.prototype.testDrag = function (e, acceptsTypes, acceptsCb) {
    var accepted = true;
    
    if (acceptsTypes) {
      if ('string' === typeof acceptsTypes) acceptsTypes = [acceptsTypes];
      
      accepted = (acceptsTypes.indexOf(this.type) >= 0);
    }
    
    if (acceptsCb) {
      accepted = acceptsCb(e, this.data, this.type);
    }
    
    if (accepted) {
      e.preventDefault();
      
    }
  };
  
  DragData.prototype.setData = function (e, data, type) {
    if (e.originalEvent) e = e.originalEvent;
    
    var eventData = {
      $data: data,
      $type: type || "application/x-plunker-drag-data",
    };
    
    this.data = eventData.$data;
    this.type = eventData.$type;
    
    try {
      e.dataTransfer.setData(this.type, this.data);
    } catch (__) {
      // Fallback for IE.. YAY!
      e.dataTransfer.setData("text", this.data);
    }
    
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.dropEffect = "move";
    
    console.log("setData", eventData);
    
    return eventData;
  };
  
  return new DragData();
}])

.directive("dragContainer", ["$dragData", function ($dragData) {
  return {
    restrict: "A",
    require: "dragContainer",
    scope: true,
    controller: "DragContainerController",
    controllerAs: "dragContainer",
    bindToController: {
      data: "=dragContainer",
      dataType: "@",
      onDragStart: "&",
      onDragEnd: "&",
    },
    link: function ($scope, $element, $attrs, dragContainer) {
      $element.on("dragstart", function (e) {
        var eventData = $dragData.setData(e, dragContainer.data, dragContainer.type);
        
        dragContainer.onDragStart(eventData);
        
        $element.addClass("drag-container-active");
        $scope.$broadcast("dragStart", eventData);
      });
      
      $element.on("dragstart", function (e) {
        var eventData = $dragData.clearData(e);
        
        dragContainer.onDragEnd(eventData);
        
        $element.removeClass("drag-container-active");
        $scope.$broadcast("dragEnd", eventData);
      });

      // Make the element draggable      
      $attrs.$set("draggable", true);
    }
  };
}])

.controller("DragContainerController", ["$scope", "$dragData", function ($scope, $dragData) {
  var dragContainer = this;
  
}])

.directive("dropContainer", ["$document", "$dragData", "$parse", function ($document, $dragData, $parse) {
  return {
    restrict: "A",
    require: "dropContainer",
    scope: false,
    controller: "DropContainerController",
    controllerAs: "dropContainer",
    bindToController: {
      onDragEnter: "&",
      onDragOver: "&",
      onDragLeave: "&",
      onDragEnd: "&",
      onDrop: "&",
      accept: "&",
      acceptsTypes: "="
    },
    link: function ($scope, $element, $attrs, dropContainer) {
      var handleDragEnd = function (e) {
        
      };
      
      $element.on("dragenter", function (e) {
        var eventData = $dragData.testDrag(e, dropContainer.acceptTypes, dropContainer.accept);
        
        if (eventData) {
          dropContainer.onDragEnter(eventData);
          
          $element.removeClass("drop-container-active");
          $scope.$broadcast("dragEnter", eventData);
        }
      });
      
      $element.on("dragover", function (e) {
        var eventData = $dragData.testDrag(e, dropContainer.acceptTypes, dropContainer.accept);
        
        if (eventData) {
          dropContainer.onDragEnter(eventData);
          
          $element.removeClass("drop-container-active");
          $scope.$broadcast("dragEnter", eventData);
        }
      });
      
      $element.on("dragleave", function (e) {
        
      });
      
      $element.on("drop", function (e) {
        
      });
      
      $document.on("dragend", handleDragEnd);
      
      $scope.$on("$destroy", function () {
        $document.off("dragend", handleDragEnd);
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