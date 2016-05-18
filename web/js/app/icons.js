// web/js/app/icons.js

/* global $jit, Image */

// Custom icons for JIT plot

// This is terrible hardcoding and should be changed ~ BKJ
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

function implementIcons () {  // eslint-disable-line no-unused-vars
  $jit.RGraph.Plot.NodeTypes.implement({
    'image': {
      'render': function (node, canvas) {
        var entityType = node.data['type'];
        var iconSize = 5 * node.data['$dim'];

        var ctx = canvas.getCtx();
        var pos = node.pos.getc(true);

        var isPerson = entityType === 'owner' | entityType === undefined | entityType === 'Unknown' | entityType === 'NER' | entityType === 'entity';

        var icon;

        if (isPerson) {
          icon = window['network_' + node.data['$color'] + 'Person'];
        } else if (entityType === 'issuer' | entityType === 'both') {
          icon = window['network_' + node.data['$color'] + 'Building'];
        } else {
          console.log('icons.js :: unknown entity type!', entityType);
        }

        if (icon) {
          ctx.drawImage(icon, pos.x - iconSize / 2, pos.y - iconSize / 2, iconSize, iconSize);
        }
      },

      'contains': function (node, pos) {
        return this.nodeHelper.circle.contains(node.pos.getc(true), pos, node.getData('dim'));
      }
    }
  });
}
