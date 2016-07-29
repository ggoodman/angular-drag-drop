require("./dragular.css");

var Angular = require("angular");

Angular.module("dragular", [
    require("angular-drag-drop"),

    require("controllers/game"),
]);