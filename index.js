var ex = new Vue ({
    el: '.ploshadkaAntenn',
    data: {
        dataJSON: {},
        arr: {},
        obj1: [],
        name: '...',
        siteAddress: [],
        siteNumber: '...',
        latitude: '...',
        longitude: '...',
        bsName: '...',
        heightATM: '0',
        heightMount: '0',
        bs: 0,
        idDots: '0',
        antenns: [],
        gValue: [],
        threeSectorAmount: 1,
        tiltAngle: '0.0',
        azimuth: '0.0',
        mountHeight: '0.0',
        sectorNum: '...',
        newAntenns: []
    },
    methods: {
        select: function(event) {
            for (let i=0; i < (document.getElementsByClassName('svg').length); i++){
                document.getElementsByClassName('svg')[i].style.opacity = '1';
                document.getElementsByClassName('svg')[i].setAttribute('d', 'M 10 70 H 70 70 L 39 19 Q 10 36 10 70');
                this.tiltAngle = '0.0';
                this.azimuth = '0.0';
                this.mountHeight = '0.0';
                this.sectorNum = '...';
            }
            const id = event.currentTarget.id;
            this.idDots = id;
            for (let i=0; i < (document.getElementsByClassName('dot').length); i++) {
                if (document.getElementsByClassName('dot')[i]['id'] == id) {
                    document.getElementsByClassName('dot')[i].style.opacity = '1';
                } else {
                    document.getElementsByClassName('dot')[i].style.opacity = '0.3';
                }
            }
            this.bsName = this.dataJSON[id].name;
            //BS=changing coverType, save generations
            this.gValue = []
            for (let j=0; j<Object.keys(this.dataJSON[id].resourceCharacteristic).length; j++) {
                        switch(this.dataJSON[id].resourceCharacteristic[j].name){
                            case 'coverType':
                                switch(this.dataJSON[id].resourceCharacteristic[j].value){
                                    case 'INDOOR':
                                        document.getElementById('iconsPlace').style.backgroundImage = 'url(svg/home.svg)';
                                        break;
                                    case 'OUTDOOR':
                                        document.getElementById('iconsPlace').style.backgroundImage = 'url(svg/sun.svg)';
                                        break;
                                }
                                break;
                            case 'cabinetType':
                                this.gValue = this.dataJSON[id].resourceCharacteristic[j].value;
                                break;
                        }
                }
            //Generations
            for(h in this.gValue){
                document.getElementById(this.gValue[h]).style.backgroundColor = 'black';
            }
            //BS=save sectors
            this.antenns = []
            for (let r=0; r<Object.keys(this.dataJSON[id].resourceRelationship).length; r++){
                for (let i in this.arr['Antenna_RAN']) {
                    if(this.dataJSON[id].resourceRelationship[r].id == this.arr['Antenna_RAN'][i][1]) {
                        this.antenns.push(this.arr['Antenna_RAN'][i][0]);
                        this.heightMount = this.dataJSON[this.arr['Antenna_RAN'][i][0]].resourceCharacteristic[0].value;
                    }
                }
            }
            this.threeSectorAmount = parseInt(this.antenns.length/3);
            let numberSectors = parseInt(this.antenns.length/6);
            const ostatoc = this.antenns.length%6
            if (ostatoc != 0) {numberSectors++};
            this.newAntenns = []
            for (let b=0; b<numberSectors; b++){
                this.newAntenns.push(this.antenns.slice(b*6, (b+1)*6))
            }
            this.$nextTick(function() {
                for (i in this.antenns){
                    document.getElementsByClassName('svg')[i].setAttribute('id', i);
                }
            });
            
            //AMC+BS=changing constructionType, height, groundingType
            for (let k=0; k<Object.keys(this.dataJSON[id].resourceRelationship).length; k++){
                for (let i in this.arr['AMC']) {
                    if (this.dataJSON[id].resourceRelationship[k].id == this.arr['AMC'][i][1]){
                        amcID = this.arr['AMC'][i][0];
                        for (let w=0; w<Object.keys(this.dataJSON[amcID].resourceCharacteristic).length; w++){
                            switch (this.dataJSON[amcID].resourceCharacteristic[w].name){
                                case 'constructionType':
                                    switch(this.dataJSON[amcID].resourceCharacteristic[w].value) {
                                        case 'REINFORCED_CONCRETE':
                                            document.getElementById('antennaIMG').setAttribute('src', 'svg/antennOneLeg.svg');
                                            break;
                                        case 'IRON':
                                            document.getElementById('antennaIMG').setAttribute('src', 'svg/antennaThreeLegs.svg');
                                            break;
                                    }
                                    break;
                                case 'height':
                                    this.heightATM = this.dataJSON[amcID].resourceCharacteristic[w].value;
                                    break;
                                case 'groundingType':
                                    switch(this.dataJSON[amcID].resourceCharacteristic[w].value) {
                                        case 'BUILDING':
                                            document.getElementById('groundIMG').setAttribute('src', 'svg/roof.svg');
                                            break;
                                        case 'GROUND':
                                            document.getElementById('groundIMG').setAttribute('src', 'svg/grunt.svg');
                                            break;
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
            this.$nextTick(function() {
                //take away antenn borders
                for (let i=0; i < (document.getElementsByClassName('svg').length); i++){
                    document.getElementsByClassName('antenns')[i].style.border = 'none';
                }
                //calculate place of sectors height
                let top = 585 - (((this.heightMount * 100)/this.heightATM)*545)/100;
                for (let p=0; p<this.newAntenns.length; p++) {
                    document.getElementsByClassName('placeHeight')[p].style.top = top+'px';
                    top += 585/this.newAntenns.length;
                }
                //colorize sectors
                if (typeof(document.getElementsByClassName('antenns')) != 'undefined'){
                    let colors = [];
                    const col = ['#00C65C','#FFB932', '#BAB9FF', '#FF5981', '#D7D7D7', '#8186FF', '#CBFFB9', '#8EFFEB', '#FF8C8C', '#00C65C', '#A46F64', '#B68BC1']
                    for (let i=0; i < this.threeSectorAmount; i++){
                        for (j in col) {
                            colors.push(col[j]);
                        }
                    }
                for (i in this.antenns){
                    document.getElementsByClassName('svg')[i].setAttribute('fill', colors[i]);
                    document.getElementsByClassName('antenns')[i].style.backgroundColor = colors[i];
                }
            }
        })
        },
        
        selectSector: function(event) {
            const id = event.currentTarget.id;
            this.sectorNum = parseInt(id)+1;
            //take away all highlits
            for (let i=0; i < (document.getElementsByClassName('svg').length); i++){
                if (document.getElementsByClassName('svg')[i].style.opacity == '0.5') {
                        document.getElementsByClassName('svg')[i].setAttribute('d', 'M 10 70 H 70 70 L 39 19 Q 10 36 10 70');
                        document.getElementsByClassName('svg')[i].style.opacity = '1';
                }
            }
            //highlite chosen sector
            for (let i=0; i < (document.getElementsByClassName('svg').length); i++){
                if (document.getElementsByClassName('svg')[i]['id'] == id) {
                    document.getElementsByClassName('svg')[i].setAttribute('d', 'M 5 70 H 70 70 L 34 16 Q 5 33 5 70');
                    document.getElementsByClassName('svg')[i].style.opacity = '1';
                    document.getElementsByClassName('antenns')[i].style.border = '1px solid black';
                } else {
                    document.getElementsByClassName('svg')[i].setAttribute('d', 'M 10 70 H 70 70 L 39 19 Q 10 36 10 70');
                    document.getElementsByClassName('svg')[i].style.opacity = '0.5';
                    document.getElementsByClassName('antenns')[i].style.border = 'none';
                }
            }
            const antennID = this.antenns[id];
            for (let j=0; j<Object.keys(this.dataJSON[antennID].resourceCharacteristic).length;j++){
                switch(this.dataJSON[antennID].resourceCharacteristic[j].name){
                    case 'tiltAngle':
                        this.tiltAngle = this.dataJSON[antennID].resourceCharacteristic[j].value;
                        break;
                    case 'azimuth':
                        this.azimuth = this.dataJSON[antennID].resourceCharacteristic[j].value;
                        break;
                    case 'mountHeight':
                        this.mountHeight = this.dataJSON[antennID].resourceCharacteristic[j].value;
                        break;
                }
            }
        },
        setID: function(r) {
            return (parseInt(r)-this.antenns[0])
        }
    },
    computed: {
        readJSON() {
            const a = this.obj1;
            for (let i=0; i < Object.keys(this.dataJSON).length; i++) {  
                //create array for eazy novigate
                let n = this.dataJSON[i].type;
                if (typeof (this.arr[n]) == "undefined"){
                    this.arr[n] = new Array();
                    m = [i, this.dataJSON[i].id]
                    this.arr[n].push(m);
                } else if (typeof (this.arr[n]) == "object"){
                    m = [i, this.dataJSON[i].id]
                    this.arr[n].push(m);
                }
                //information about place
                if (this.dataJSON[i].type == 'Site') {
                    this.name = this.dataJSON[i].name;
                    for (let n=0; n<Object.keys(this.dataJSON[i].resourceCharacteristic).length; n++) {
                        switch(this.dataJSON[i].resourceCharacteristic[n].name){
                            case 'siteAddress':
                                this.siteAddress = this.dataJSON[i].resourceCharacteristic[n].value.split(', ')
                                break;
                            case 'siteNumber':
                                this.siteNumber = this.dataJSON[i].resourceCharacteristic[n].value;
                                break;
                            case 'latitude':
                                this.latitude = this.dataJSON[i].resourceCharacteristic[n].value;
                                break;
                            case 'longitude':
                                this.longitude = this.dataJSON[i].resourceCharacteristic[n].value;
                                break;
                        }
                    };
                    this.dataJSON[i].resourceCharacteristic[1].value;
                }
            }
            n = typeof(this.arr["BaseStation"])
            if (typeof(this.arr["BaseStation"]) !== 'undefined') {
                this.bs = this.arr["BaseStation"].length;
            }
        },
        bsDots() {
            return(this.bs)
            }
    },
    mounted() {
        var self = this
        $.getJSON('site.json', function(dataJSON) {
            self.dataJSON = dataJSON;
    })  
    }
})
