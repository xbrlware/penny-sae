// web/js/app/icons.js

/* global $jit, Image */

// Custom icons for JIT plot

// This is terrible hardcoding and should be changed ~ BKJ

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

var networkGreenPerson = new Image();
var networkYellowPerson = new Image();
var networkOrangePerson = new Image();
var networkRedPerson = new Image();
var networkGreyPerson = new Image();

networkGreenPerson.src = 'img/green_person.png';
networkYellowPerson.src = 'img/yellow_person.png';
networkOrangePerson.src = 'img/orange_person.png';
networkRedPerson.src = 'img/red_person.png';
networkGreyPerson.src = 'img/grey_person.png';

var networkGreenBuilding = new Image();
var networkYellowBuilding = new Image();
var networkOrangeBuilding = new Image();
var networkRedBuilding = new Image();

networkGreenBuilding.src = 'img/green_building.png';
networkYellowBuilding.src = 'img/yellow_building.png';
networkOrangeBuilding.src = 'img/orange_building.png';
networkRedBuilding.src = 'img/red_building.png';

function implementIcons () { // eslint-disable-line no-unused-vars
  console.log('implementing icons');
  $jit.RGraph.Plot.NodeTypes.implement({
    'image': {
      'render': function (node, canvas) {
        var icon = window['network' + node.data['$color'].capitalize() + (node.data['is_issuer'] ? 'Building' : 'Person')];
        var iconSize = 5 * node.data['$dim'];
        var ctx = canvas.getCtx();
        var pos = node.pos.getc(true);

        ctx.drawImage(icon, pos.x - iconSize / 2, pos.y - iconSize / 2, iconSize, iconSize);
      },

      'contains': function (node, pos) {
        return this.nodeHelper.circle.contains(node.pos.getc(true), pos, node.getData('dim'));
      }
    }
  });
}
