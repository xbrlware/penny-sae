// Custom icons for JIT plot

// This is terrible hardcoding and should be changed ~ BKJ
var network_greenPerson  = new Image();
var network_yellowPerson = new Image();
var network_orangePerson = new Image();
var network_redPerson    = new Image();
var network_greyPerson   = new Image();

network_greenPerson.src  = 'img/green_person.png';
network_yellowPerson.src = 'img/yellow_person.png';
network_orangePerson.src = 'img/orange_person.png';
network_redPerson.src    = 'img/red_person.png';
network_greyPerson.src   = 'img/grey_person.png';

var network_greenBuilding  = new Image();
var network_yellowBuilding = new Image();
var network_orangeBuilding = new Image();
var network_redBuilding    = new Image();

network_greenBuilding.src  = 'img/green_building.png';
network_yellowBuilding.src = 'img/yellow_building.png';
network_orangeBuilding.src = 'img/orange_building.png';
network_redBuilding.src    = 'img/red_building.png';

function implementIcons() {
    $jit.RGraph.Plot.NodeTypes.implement({
        'image': {
            
                'render': function(node, canvas){
                    var entity_type = node.data['type']
                    var icon_size   = 5 * node.data['$dim'];
                    
                    var ctx = canvas.getCtx();
                    var pos = node.pos.getc(true);

                    var icon;
                    if(entity_type == 'owner' | entity_type == undefined | entity_type == 'Unknown' | entity_type == "NER" | entity_type == "entity"){
                        icon = window['network_' + node.data['$color'] + 'Person'];
                    } else if (entity_type == 'issuer' | entity_type == 'both') {
                        icon = window['network_' + node.data['$color'] + 'Building'];
                    } else {
                        console.log('icons.js: >>> unknown entity type!', entity_type);
                    }
                    
                    if(icon) {
                        ctx.drawImage(icon, pos.x - icon_size / 2, pos.y - icon_size / 2, icon_size, icon_size);    
                    }
                    
                },
                
                'contains': function(node,pos){ 
                    return this.nodeHelper.circle.contains(node.pos.getc(true), pos, node.getData('dim')); 
                } 
        }
    });
}