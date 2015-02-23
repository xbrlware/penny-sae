// Custom icons for JIT plot

var network_greenPerson  = new Image();
var network_yellowPerson = new Image();
var network_orangePerson = new Image();
var network_redPerson    = new Image();
var network_greyPerson    = new Image();

network_greenPerson.src  = 'img/green_person.png';
network_yellowPerson.src = 'img/yellow_person.png';
network_orangePerson.src = 'img/orange_person.png';
network_redPerson.src    = 'img/red_person.png';
network_greyPerson.src    = 'img/grey_person.png';

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
                    if(entity_type == 'owner' | entity_type == undefined | entity_type == 'Unknown' | entity_type == "NER" | entity_type == "entity"){
                        var person;
                        switch(node.data['$color']){
                            case 'green':
                                person = node.data['hidden'] == 0 ? window.network_greenPerson : window.network_greenPerson;
                                break;
                            case 'yellow':
                                person = node.data['hidden'] == 0 ? window.network_yellowPerson : window.network_yellowPerson;
                                break;
                            case 'orange':
                                person = node.data['hidden'] == 0 ? window.network_orangePerson : window.network_orangePerson;
                                break;
                            case 'red':
                                person = node.data['hidden'] == 0 ? window.network_redPerson : window.network_redPerson;
                                break;
                            case 'grey':
                                person = node.data['hidden'] == 0 ? window.network_greyPerson : window.network_greyPerson;
                                break;
                        }
                        var ctx = canvas.getCtx();
                        var pos = node.pos.getc(true);
                        ctx.drawImage(person, pos.x - icon_size / 2, pos.y - icon_size / 2, icon_size, icon_size);
                    } else if (entity_type == 'issuer' | entity_type == 'both') {
                        var building;
                        switch(node.data['$color']){
                            case 'green':
                                building = window.network_greenBuilding;
                                break;
                            case 'yellow':
                                building = window.network_yellowBuilding;
                                break;
                            case 'orange':
                                building = window.network_orangeBuilding;
                                break;
                            case 'red':
                                building = window.network_redBuilding;
                                break;
                        }
                        var ctx = canvas.getCtx();
                        var pos = node.pos.getc(true);
                        ctx.drawImage(building, pos.x - icon_size / 2, pos.y - icon_size / 2, icon_size, icon_size);
                    } else {
                        console.log('icons.js: >>> unknown entity type!', entity_type);
                    }
                },
                'contains': function(node,pos){ 
                    var npos = node.pos.getc(true); 
                    dim = node.getData('dim'); 
                    return this.nodeHelper.circle.contains(npos, pos, dim); 
                } 
        }
    });
}