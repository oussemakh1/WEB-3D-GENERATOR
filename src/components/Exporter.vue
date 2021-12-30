<template>
      <form @submit.prevent="this.createScene()">
                <input  type="range" min="1" max="50" id="input" v-model="extrusionInput" />
                <input  type="number" placeholder="cstLongeur"  v-model="cstLongeur" />
                <input  type="number" placeholder="cstLargeur"  v-model="cstLargeur" />
                <input  type="number" placeholder="cstHauteur"  v-model="cstHauteur" />
                <input  type="number"  placeholder="cstMaterialThickness" v-model="cstMaterialThickness" />
                <input  type="number" placeholder="cstTab" v-model="cstTab" />
                <button type="submit" >Model01</button>
        </form>
    <div id="scene">

                
                
    </div>

</template>

<script>
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { setupScene } from "./scene";
export default {

    data() {
        return {
            fillMaterial : new THREE.MeshBasicMaterial({ color: "#F3FBFB" }),
            stokeMaterial : new THREE.LineBasicMaterial({
                    color: "#00A5E6",
            }),
            cstLongeur: 300,
            cstLargeur:150,
            cstHauteur:200,
            cstMaterialThickness:10,
            cstTab:20,
            i: 0,
            makerjs: require("makerjs"),
            extrusionInput: 2,
            main_svg: String,
            top_svg: String,
            left_svg: String,
            right_svg: String,
            front_svg: String,
            back_svg: String,
            svg: String,
            setupTheMain: Function,
            app: Document,
            extrusionInputDOM: Document,
            objectCount:0,
            
 

        }
    },
   
    mounted: function () {
          this.app = document.querySelector("#scene");
              
    },
     watch: {
            extrusionInput: function (val) {
                this.extrusionInput = val;
                console.log('extrusion ! ' + this.extrusionInput);
            },
            cstLongeur:  function (val) {
                this.cstLongeur = val;
                console.log(this.cstLongeur);
            },
            cstLargeur:function (val) {
                this.cstLargeur = val;
            },
            cstHauteur:function (val) {
                this.cstHauteur = val;
            },
            cstMaterialThickness:function (val) {
                this.cstMaterialThickness = val;
            },
            cstTab:function (val) {
                this.cstTab = val;
            },

    },
    methods: {

            renderSVGMain (extrusion, svg)  {
                const loader = new SVGLoader();
                const svgData = loader.parse(svg);
                const svgGroup = new THREE.Group();
                const updateMap = [];
            
                svgGroup.scale.y *= -1;
                svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);
            
                shapes.forEach((shape) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(shape, {
                    depth: extrusion,
                    bevelEnabled: false,
                    });
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                    const mesh = new THREE.Mesh(meshGeometry, this.fillMaterial);
                    const lines = new THREE.LineSegments(linesGeometry, this.stokeMaterial);
            
                    updateMap.push({ shape, mesh, lines });
                    svgGroup.add(mesh, lines);
                });
                });
            
             const box = new THREE.Box3().setFromObject(svgGroup);
                const size = box.getSize(new THREE.Vector3());
                const yOffset = size.y / -2;
                const xOffset = size.x / -2;
                const zOffset  = size.z / -2;
                // Offset all of group's elements, to center them
                svgGroup.children.forEach((item) => {
               
                });
                
               var listOfSvg =Object.entries(svgGroup.children);
                 // offset mainFace 
               var mainFace = listOfSvg[1];
                var accessMainFace = mainFace[1]
                accessMainFace.position.x = 0;
	            accessMainFace.position.y = 1000;
	            accessMainFace.position.z = 0;
                accessMainFace.rotation.x =( Math.Pi/2);
                console.log(accessMainFace);
                svgGroup.position.x = -(this.cstLongeur/2);
                svgGroup.position.y = -(this.cstLargeur/2);
                svgGroup.position.z=-(this.cstHauteur/2);

               /* // offset topFace 
                var topFace = listOfSvg[3];
                var accesstopFace = topFace[1];
                accesstopFace.position.x =  (this.cstLongeur / 2);
	            accesstopFace.position.y =  (this.cstLargeur /2)
	            accesstopFace.position.z = (this.cstHauteur / 2)
                accesstopFace.rotation.x =( Math.Pi/2);
               */

               /*  // offset leftFace 
                var leftFace = listOfSvg[5];
                var accessleftFace = leftFace[1]
                accessleftFace.position.x =  (this.cstLongeur / 2);
	            accessleftFace.position.y =  (this.cstHauteur /2)
                accessleftFace.rotation.y = Math.Pi/2


                // offset rightFace 
                var rightFace = listOfSvg[7];
                var accessrightFace = rightFace[1]
                accessrightFace.position.x =  -(this.cstLongeur / 2);
	            accessrightFace.position.y =  -(this.cstHauteur /2)
	            accessrightFace.position.z = -(extrusion / 2)
                accessrightFace.rotation.y = Math.Pi/2;


                // offset frontFace 
                var frontFace = listOfSvg[9];
                var accessfrontFace = frontFace[1]
                accessfrontFace.position.x =  -(this.cstLongeur / 2);
	            accessfrontFace.position.y =  -(this.cstHauteur /2)
	            accessfrontFace.position.z =  (extrusion / 2)


                // offset backFace 
                var backFace  = listOfSvg[11];
                var accessbackFace  = backFace[1]
                accessbackFace.position.x =  -(this.cstLongeur / 2);
	            accessbackFace.position.y =  -(this.cstHauteur /2)
	            accessbackFace.position.z =- (extrusion / 2)*/
                
                svgGroup.rotateX(-Math.PI / 2);
            
                return {
                object: svgGroup,
                update(extrusion) {
                    updateMap.forEach((updateDetails) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(
                        updateDetails.shape,
                        {
                        depth: extrusion,
                        bevelEnabled: false,
                        }
                    );
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
            
                    updateDetails.mesh.geometry.dispose();
                    updateDetails.lines.geometry.dispose();
                    updateDetails.mesh.geometry = meshGeometry;
                    updateDetails.lines.geometry = linesGeometry;
                    });
                },
               
                };
            },
             renderSVGTop (extrusion, svg)  {
                const loader = new SVGLoader();
                const svgData = loader.parse(svg);
                const svgGroup = new THREE.Group();
                const updateMap = [];
            
                svgGroup.scale.y *= -1;
                svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);
            
                shapes.forEach((shape) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(shape, {
                    depth: extrusion,
                    bevelEnabled: false,
                    });
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                    const mesh = new THREE.Mesh(meshGeometry, this.fillMaterial);
                    const lines = new THREE.LineSegments(linesGeometry, this.stokeMaterial);
            
                    updateMap.push({ shape, mesh, lines });
                    svgGroup.add(mesh, lines);
                });
                });
            
             const box = new THREE.Box3().setFromObject(svgGroup);
                const size = box.getSize(new THREE.Vector3());
                const yOffset = size.y / -2;
                const xOffset = size.x / -2;
                const zOffset  = size.z / -2;
                // Offset all of group's elements, to center them
                svgGroup.children.forEach((item) => {
               
                });
                
                 // offset mainFace 
              
                svgGroup.position.x = (this.cstLongeur/2);
                svgGroup.position.y = (this.cstLargeur/2);
                svgGroup.position.z=(this.cstHauteur/2);

               /* // offset topFace 
                var topFace = listOfSvg[3];
                var accesstopFace = topFace[1];
                accesstopFace.position.x =  (this.cstLongeur / 2);
	            accesstopFace.position.y =  (this.cstLargeur /2)
	            accesstopFace.position.z = (this.cstHauteur / 2)
                accesstopFace.rotation.x =( Math.Pi/2);
               */

               /*  // offset leftFace 
                var leftFace = listOfSvg[5];
                var accessleftFace = leftFace[1]
                accessleftFace.position.x =  (this.cstLongeur / 2);
	            accessleftFace.position.y =  (this.cstHauteur /2)
                accessleftFace.rotation.y = Math.Pi/2


                // offset rightFace 
                var rightFace = listOfSvg[7];
                var accessrightFace = rightFace[1]
                accessrightFace.position.x =  -(this.cstLongeur / 2);
	            accessrightFace.position.y =  -(this.cstHauteur /2)
	            accessrightFace.position.z = -(extrusion / 2)
                accessrightFace.rotation.y = Math.Pi/2;


                // offset frontFace 
                var frontFace = listOfSvg[9];
                var accessfrontFace = frontFace[1]
                accessfrontFace.position.x =  -(this.cstLongeur / 2);
	            accessfrontFace.position.y =  -(this.cstHauteur /2)
	            accessfrontFace.position.z =  (extrusion / 2)


                // offset backFace 
                var backFace  = listOfSvg[11];
                var accessbackFace  = backFace[1]
                accessbackFace.position.x =  -(this.cstLongeur / 2);
	            accessbackFace.position.y =  -(this.cstHauteur /2)
	            accessbackFace.position.z =- (extrusion / 2)*/
                
                svgGroup.rotateX(-Math.PI / 2);
            
                return {
                object: svgGroup,
                update(extrusion) {
                    updateMap.forEach((updateDetails) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(
                        updateDetails.shape,
                        {
                        depth: extrusion,
                        bevelEnabled: false,
                        }
                    );
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
            
                    updateDetails.mesh.geometry.dispose();
                    updateDetails.lines.geometry.dispose();
                    updateDetails.mesh.geometry = meshGeometry;
                    updateDetails.lines.geometry = linesGeometry;
                    });
                },
               
                };
            },  
          

         

            frontFace(longeur, largeur, hauteur, tab, thickness) {
                // define nbrTabTopLine, nbrFingerTopLine, and fingerLengthTopLine for top Line
                var iteration = 3;
                var l = longeur;
                while (l - 2 * tab > 2 * tab) {
                    iteration += 2;
                    l -= 2 * tab;
                }
                var nbrTabTopLine = iteration - (iteration - 1) / 2;
                var nbrFingerTopLine = nbrTabTopLine - 1;
                var fingerLengthTopLine = (longeur - nbrTabTopLine * tab) / nbrFingerTopLine;
                var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
                // init frontface
                var mainModel = { models: {}, paths: {} };
                var ox = thickness,
                    oy = 0,
                    dx = 0,
                    dy = 0,
                    pathIndicator = 0;
                var i = 0;
                // top line;
                for (i = 0; i < upsAndDownTopLine / 2; i++) {
                    if (i + 1 > upsAndDownTopLine / 2) {
                    mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [longeur - thickness, 0]);
                    pathIndicator++;
                    } else {
                    if (i % 2 == 0) {
                        // going right
                        dx += fingerLengthTopLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going down
                        dy = -thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right with tab
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx += tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = 0;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                    }
                }
                // define nbrTabRightLine, nbrFingerRightLine, and fingerLengthRightLine for Right Line
                iteration = 3;
                l = hauteur;
                while (l - 2 * tab > 2 * tab) {
                    iteration += 2;
                    l -= 2 * tab;
                }
                var nbrTabRightLine = iteration - (iteration - 1) / 2;
                var nbrFingerRightLine = nbrTabRightLine - 1;
                var fingerLengthRightLine = (hauteur - nbrTabRightLine * tab) / nbrFingerRightLine;
                var upsAndDownRightLine = 2 * (nbrFingerRightLine + nbrTabRightLine) - 1;
                // right line
                ox = longeur - thickness;
                oy = 0;
                dx = longeur - thickness;
                dy = 0;
                for (i = 0; i < upsAndDownRightLine / 2; i++) {
                    if (i + 1 > upsAndDownRightLine / 2) {
                    mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [longeur - thickness, -hauteur]);
                    pathIndicator++;
                    } else {
                    if (i % 2 == 0) {
                        // going down
                        dy -= tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going right
                        dx = longeur;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy -= fingerLengthRightLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = longeur - thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                    }
                }
                // bottom line
                ox = longeur - thickness;
                oy = -hauteur;
                dx = longeur;
                dy = -hauteur;
                for (i = 0; i < upsAndDownTopLine / 2; i++) {
                    if (i + 1 > upsAndDownTopLine / 2) {
                    mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [thickness, -hauteur]);
                    pathIndicator++;
                    } else {
                    if (i % 2 == 0) {
                        // going left
                        dx -= tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going up
                        dy += thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx -= fingerLengthTopLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -hauteur;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                    }
                }
                // left line
                ox = thickness;
                oy = -hauteur;
                dx = thickness;
                dy = -hauteur;
                for (i = 0; i < upsAndDownRightLine / 2; i++) {
                    if (i > upsAndDownRightLine / 2) {
                    mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [thickness, -thickness]);
                    pathIndicator++;
                    } else {
                    if (i % 2 == 0) {
                        // going up
                        dy += tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going left
                        dx = 0;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy += fingerLengthRightLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                    }
                }
                // return main array
                return mainModel;
            },

            backFace(longeur, largeur, hauteur, tab, thickness) {
                // define nbrTabTopLine, nbrFingerTopLine, and fingerLengthTopLine for top Line
                var iteration = 3;
                var l = longeur;
                while (l - 2 * tab > 2 * tab) {
                    iteration += 2;
                    l -= 2 * tab;
                }
                var nbrTabTopLine = iteration - (iteration - 1) / 2;
                var nbrFingerTopLine = nbrTabTopLine - 1;
                var fingerLengthTopLine = (longeur - nbrTabTopLine * tab) / nbrFingerTopLine;
                var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
                // init frontface
                var mainModel = { models: {}, paths: {} };
                var ox = thickness,
                    oy = 0,
                    dx = 0,
                    dy = 0,
                    pathIndicator = 0;
                // top line;
                var i = 0;
                for (i = 0; i < upsAndDownTopLine / 2; i++) {
                    if (i + 1 > upsAndDownTopLine / 2) {
                    mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [longeur - thickness, 0]);
                    pathIndicator++;
                    } else {
                    if (i % 2 == 0) {
                        // going right
                        dx += fingerLengthTopLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going down
                        dy = -thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right with tab
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx += tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = 0;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                    }
                }
                // define nbrTabRightLine, nbrFingerRightLine, and fingerLengthRightLine for Right Line
                iteration = 3;
                l = hauteur;
                while (l - 2 * tab > 2 * tab) {
                    iteration += 2;
                    l -= 2 * tab;
                }
                var nbrTabRightLine = iteration - (iteration - 1) / 2;
                var nbrFingerRightLine = nbrTabRightLine - 1;
                var fingerLengthRightLine = (hauteur - nbrTabRightLine * tab) / nbrFingerRightLine;
                var upsAndDownRightLine = 2 * (nbrFingerRightLine + nbrTabRightLine) - 1;
                // right line
                ox = longeur - thickness;
                oy = 0;
                dx = longeur - thickness;
                dy = 0;
                for (i = 0; i < upsAndDownRightLine / 2; i++) {
                    if (i + 1 > upsAndDownRightLine / 2) {
                    mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [longeur - thickness, -hauteur]);
                    pathIndicator++;
                    } else {
                    if (i % 2 == 0) {
                        // going down
                        dy -= tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going right
                        dx = longeur;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy -= fingerLengthRightLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = longeur - thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                    }
                }
                // bottom line
                ox = longeur - thickness;
                oy = -hauteur;
                dx = longeur;
                dy = -hauteur;
                for (i = 0; i < upsAndDownTopLine / 2; i++) {
                    if (i + 1 > upsAndDownTopLine / 2) {
                    mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [thickness, -hauteur]);
                    pathIndicator++;
                    } else {
                    if (i % 2 == 0) {
                        // going left
                        dx -= tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going up
                        dy += thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx -= fingerLengthTopLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -hauteur;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                    }
                }
                // left line
                ox = thickness;
                oy = -hauteur;
                dx = thickness;
                dy = -hauteur;
                for (i = 0; i < upsAndDownRightLine / 2; i++) {
                    if (i > upsAndDownRightLine / 2) {
                    mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [thickness, -thickness]);
                    pathIndicator++;
                    } else {
                    if (i % 2 == 0) {
                        // going up
                        dy += tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going left
                        dx = 0;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy += fingerLengthRightLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                    }
                }
                // return main array
                return mainModel;
            },

            mainFace(longeur, largeur, hauteur, tab, thickness) {
                    // define nbrTabTopLine, nbrFingerTopLine, and fingerLengthTopLine for top Line
                    var iteration = 3;
                    var l = longeur;
                    while (l - 2 * tab > 2 * tab) {
                        iteration += 2;
                        l -= 2 * tab;
                    }
                    var nbrTabTopLine = iteration - (iteration - 1) / 2;
                    var nbrFingerTopLine = nbrTabTopLine - 1;
                    var fingerLengthTopLine = (longeur - nbrTabTopLine * tab) / nbrFingerTopLine;
                    var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
                    var sum = fingerLengthTopLine * nbrFingerTopLine + nbrTabTopLine * tab;
                    // init model
                    var mainModel = { models: {}, paths: {} };
                    var ox = thickness,
                        oy = -thickness,
                        dx = 0,
                        dy = -thickness,
                        pathIndicator = 0;
                    /*
                        mainModel.paths[pathIndicator] = new makerjs.paths.Line(
                        [thickness, -thickness],
                        [fingerLengthTopLine, -thickness]
                        );
                        pathIndicator++;
                    */
                    // top side;
                    for (var i = 0; i < upsAndDownTopLine / 2; i++) {
                        if (i > upsAndDownTopLine / 2 - 1) {
                        // last tab-thickness
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [longeur - thickness, dy]);
                        pathIndicator++;
                        } else {
                        if (i % 2 == 0) {
                            dx += tab;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        } else {
                            // going up
                            dy = 0;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going right with fingersize
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dx += fingerLengthTopLine;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going down
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dy = -thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // set new values
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        }
                        }
                    }
                    // define nbrTabRightLine, nbrFingerRightLine, and fingerLengthRightLine for Right Side
                    iteration = 3;
                    l = largeur;
                    while (l - 2 * tab > 2 * tab) {
                        iteration += 2;
                        l -= 2 * tab;
                    }
                    var nbrTabRightLine = iteration - (iteration - 1) / 2;
                    var nbrFingerRightLine = nbrTabRightLine - 1;
                    var fingerLengthRightLine = (largeur - nbrTabRightLine * tab) / nbrFingerRightLine;
                    var upsAndDownRightLine = 2 * (nbrFingerRightLine + nbrTabRightLine) - 1;

                    // right side
                    ox = longeur - thickness;
                    oy = -thickness;
                    dx = longeur - thickness;
                    dy = 0;
                    for (i = 0; i < upsAndDownRightLine / 2; i++) {
                        if (i > upsAndDownRightLine / 2 - 1) {
                        // last tab-thickness
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, -largeur + thickness]);
                        pathIndicator++;
                        } else {
                        if (i % 2 == 0) {
                            // going down
                            dy -= tab;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        } else {
                            // going left
                            dx = longeur;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going down with fingersize
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dy -= fingerLengthRightLine;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going right
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dx = longeur - thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // set new values
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        }
                        }
                    }
                    // bottom side
                    ox = longeur - thickness;
                    oy = -largeur + thickness;
                    dx = longeur;
                    dy = -largeur + thickness;

                    for (i = 0; i < upsAndDownTopLine / 2; i++) {
                        if (i > upsAndDownTopLine / 2 - 1) {
                        // last tab-thickness
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [thickness, -largeur + thickness]);
                        pathIndicator++;
                        } else {
                        if (i % 2 == 0) {
                            // going left
                            dx -= tab;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        } else {
                            // going down
                            dy -= thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going left with fingersize
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dx -= fingerLengthTopLine;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going up
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dy = -largeur + thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // set new values
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        }
                        }
                    }
                    // left side

                    ox = thickness;
                    oy = -largeur + thickness;
                    dx = thickness;
                    dy = -largeur;
                    for (i = 0; i < upsAndDownRightLine / 2; i++) {
                        if (i > upsAndDownRightLine / 2 - 1) {
                        // last tab-thickness
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [thickness, -thickness]);
                        pathIndicator++;
                        } else {
                        if (i % 2 == 0) {
                            // going up
                            dy += tab;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        } else {
                            // going left
                            dx = 0;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going up with fingersize
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dy += fingerLengthRightLine;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going right
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dx = thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // set new values
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        }
                        }
                    }
                    return mainModel;
            },

            leftFace(longeur, largeur, hauteur, tab, thickness) {
                    // define nbrTabTopLine, nbrFingerTopLine, and fingerLengthTopLine for top Line
                    var iteration = 3;
                    var l = hauteur;
                    while (l - 2 * tab > 2 * tab) {
                        iteration += 2;
                        l -= 2 * tab;
                    }
                    var nbrTabTopLine = iteration - (iteration - 1) / 2;
                    var nbrFingerTopLine = nbrTabTopLine - 1;
                    var fingerLengthTopLine = (hauteur - nbrTabTopLine * tab) / nbrFingerTopLine;
                    var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
                    var sum = fingerLengthTopLine * nbrFingerTopLine + nbrTabTopLine * tab;
                    // init frontface
                    var mainModel = { models: {}, paths: {} };
                    var ox = 0,
                        oy = 0,
                        dx = 0,
                        dy = 0,
                        pathIndicator = 0;
                    // top line;
                    for (var i = 0; i < upsAndDownTopLine / 2; i++) {
                        if (i % 2 == 0) {
                        dx += tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        } else {
                        // going down
                        dy = -thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx += fingerLengthTopLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = 0;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        }
                    }
                    // define nbrTabRightLine, nbrFingerRightLine, and fingerLengthRightLine for Right Line
                    iteration = 3;
                    l = largeur;
                    while (l - 2 * tab > 2 * tab) {
                        iteration += 2;
                        l -= 2 * tab;
                    }
                    var nbrTabRightLine = iteration - (iteration - 1) / 2;
                    var nbrFingerRightLine = nbrTabRightLine - 1;
                    var fingerLengthRightLine = (largeur - nbrTabRightLine * tab) / nbrFingerRightLine;
                    var upsAndDownRightLine = 2 * (nbrFingerRightLine + nbrTabRightLine) - 1;
                    // right line
                    ox = hauteur;
                    oy = 0;
                    dx = hauteur;
                    dy = 0;
                    for (i = 0; i < upsAndDownRightLine / 2; i++) {
                        if (i % 2 == 0) {
                        // going down
                        dy -= tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        } else {
                        // going left
                        dx = hauteur - thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy -= fingerLengthRightLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = hauteur;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        }
                    }
                    // bottom line
                    ox = hauteur;
                    oy = -largeur;
                    dx = hauteur;
                    dy = -largeur;
                    for (i = 0; i < upsAndDownTopLine / 2; i++) {
                        if (i % 2 == 0) {
                        // going left
                        dx -= tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        } else {
                        // going up
                        dy += thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx -= fingerLengthTopLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -largeur;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        }
                    }
                    // left line
                    ox = 0;
                    oy = -largeur;
                    dx = 0;
                    dy = -largeur;
                    for (i = 0; i < upsAndDownRightLine / 2; i++) {
                        if (i % 2 == 0) {
                        // going up
                        dy += tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        } else {
                        // going right
                        dx = thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy += fingerLengthRightLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = 0;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        }
                    }
                    return mainModel;
            },

            rightFace(longeur, largeur, hauteur, tab, thickness) {
                    // define nbrTabTopLine, nbrFingerTopLine, and fingerLengthTopLine for top Line
                    var iteration = 3;
                    var l = hauteur;
                    while (l - 2 * tab > 2 * tab) {
                        iteration += 2;
                        l -= 2 * tab;
                    }
                    var nbrTabTopLine = iteration - (iteration - 1) / 2;
                    var nbrFingerTopLine = nbrTabTopLine - 1;
                    var fingerLengthTopLine = (hauteur - nbrTabTopLine * tab) / nbrFingerTopLine;
                    var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
                    var sum = fingerLengthTopLine * nbrFingerTopLine + nbrTabTopLine * tab;
                    // init frontface
                    var mainModel = { models: {}, paths: {} };
                    var ox = 0,
                        oy = 0,
                        dx = 0,
                        dy = 0,
                        pathIndicator = 0;
                    // top line;
                    for (var i = 0; i < upsAndDownTopLine / 2; i++) {
                        if (i % 2 == 0) {
                        dx += tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        } else {
                        // going down
                        dy = -thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx += fingerLengthTopLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = 0;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        }
                    }
                    // define nbrTabRightLine, nbrFingerRightLine, and fingerLengthRightLine for Right Line
                    iteration = 3;
                    l = largeur;
                    while (l - 2 * tab > 2 * tab) {
                        iteration += 2;
                        l -= 2 * tab;
                    }
                    var nbrTabRightLine = iteration - (iteration - 1) / 2;
                    var nbrFingerRightLine = nbrTabRightLine - 1;
                    var fingerLengthRightLine = (largeur - nbrTabRightLine * tab) / nbrFingerRightLine;
                    var upsAndDownRightLine = 2 * (nbrFingerRightLine + nbrTabRightLine) - 1;
                    // right line
                    ox = hauteur;
                    oy = 0;
                    dx = hauteur;
                    dy = 0;
                    for (i = 0; i < upsAndDownRightLine / 2; i++) {
                        if (i % 2 == 0) {
                        // going down
                        dy -= tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        } else {
                        // going left
                        dx = hauteur - thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy -= fingerLengthRightLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = hauteur;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        }
                    }
                    // bottom line
                    ox = hauteur;
                    oy = -largeur;
                    dx = hauteur;
                    dy = -largeur;
                    for (i = 0; i < upsAndDownTopLine / 2; i++) {
                        if (i % 2 == 0) {
                        // going left
                        dx -= tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        } else {
                        // going up
                        dy += thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx -= fingerLengthTopLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -largeur;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        }
                    }
                    // left line
                    ox = 0;
                    oy = -largeur;
                    dx = 0;
                    dy = -largeur;
                    for (i = 0; i < upsAndDownRightLine / 2; i++) {
                        if (i % 2 == 0) {
                        // going up
                        dy += tab;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        } else {
                        // going right
                        dx = thickness;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy += fingerLengthRightLine;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = 0;
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        }
                    }
                    return mainModel;
            },

            topFace(longeur, largeur, hauteur, tab, thickness) {
                    // define nbrTabTopLine, nbrFingerTopLine, and fingerLengthTopLine for top Line
                    var iteration = 3;
                    var l = longeur;
                    while (l - 2 * tab > 2 * tab) {
                        iteration += 2;
                        l -= 2 * tab;
                    }
                    var nbrTabTopLine = iteration - (iteration - 1) / 2;
                    var nbrFingerTopLine = nbrTabTopLine - 1;
                    var fingerLengthTopLine = (longeur - nbrTabTopLine * tab) / nbrFingerTopLine;
                    var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
                    var sum = fingerLengthTopLine * nbrFingerTopLine + nbrTabTopLine * tab;
                    // init model
                    var mainModel = { models: {}, paths: {} };
                    var ox = thickness,
                        oy = -thickness,
                        dx = 0,
                        dy = -thickness,
                        pathIndicator = 0;
                    /*
                        mainModel.paths[pathIndicator] = new makerjs.paths.Line(
                        [thickness, -thickness],
                        [fingerLengthTopLine, -thickness]
                        );
                        pathIndicator++;
                    */
                    // top side;
                    for (var i = 0; i < upsAndDownTopLine / 2; i++) {
                        if (i > upsAndDownTopLine / 2 - 1) {
                        // last tab-thickness
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [longeur - thickness, dy]);
                        pathIndicator++;
                        } else {
                        if (i % 2 == 0) {
                            dx += tab;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        } else {
                            // going up
                            dy = 0;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going right with fingersize
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dx += fingerLengthTopLine;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going down
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dy = -thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // set new values
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        }
                        }
                    }
                    // define nbrTabRightLine, nbrFingerRightLine, and fingerLengthRightLine for Right Side
                    iteration = 3;
                    l = largeur;
                    while (l - 2 * tab > 2 * tab) {
                        iteration += 2;
                        l -= 2 * tab;
                    }
                    var nbrTabRightLine = iteration - (iteration - 1) / 2;
                    var nbrFingerRightLine = nbrTabRightLine - 1;
                    var fingerLengthRightLine = (largeur - nbrTabRightLine * tab) / nbrFingerRightLine;
                    var upsAndDownRightLine = 2 * (nbrFingerRightLine + nbrTabRightLine) - 1;

                    // right side
                    ox = longeur - thickness;
                    oy = -thickness;
                    dx = longeur - thickness;
                    dy = 0;
                    for (i = 0; i < upsAndDownRightLine / 2; i++) {
                        if (i > upsAndDownRightLine / 2 - 1) {
                        // last tab-thickness
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, -largeur + thickness]);
                        pathIndicator++;
                        } else {
                        if (i % 2 == 0) {
                            // going down
                            dy -= tab;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        } else {
                            // going left
                            dx = longeur;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going down with fingersize
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dy -= fingerLengthRightLine;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going right
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dx = longeur - thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // set new values
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        }
                        }
                    }
                    // bottom side
                    ox = longeur - thickness;
                    oy = -largeur + thickness;
                    dx = longeur;
                    dy = -largeur + thickness;

                    for (i = 0; i < upsAndDownTopLine / 2; i++) {
                        if (i > upsAndDownTopLine / 2 - 1) {
                        // last tab-thickness
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [thickness, -largeur + thickness]);
                        pathIndicator++;
                        } else {
                        if (i % 2 == 0) {
                            // going left
                            dx -= tab;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        } else {
                            // going down
                            dy -= thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going left with fingersize
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dx -= fingerLengthTopLine;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going up
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dy = -largeur + thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // set new values
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        }
                        }
                    }
                    // left side

                    ox = thickness;
                    oy = -largeur + thickness;
                    dx = thickness;
                    dy = -largeur;
                    for (i = 0; i < upsAndDownRightLine / 2; i++) {
                        if (i > upsAndDownRightLine / 2 - 1) {
                        // last tab-thickness
                        mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [thickness, -thickness]);
                        pathIndicator++;
                        } else {
                        if (i % 2 == 0) {
                            // going up
                            dy += tab;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        } else {
                            // going left
                            dx = 0;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going up with fingersize
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dy += fingerLengthRightLine;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // going right
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                            dx = thickness;
                            mainModel.paths[pathIndicator] = new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                            // set new values
                            pathIndicator++;
                            ox = dx;
                            oy = dy;
                        }
                        }
                    }
                    return mainModel;
            },
           
            createScene () {
                         const scene= this.deleteOldScene;
                         if(this.objectCount  > 0) {
                             var oldObject = scene.getObjectByName("model"+this.objectCount);
                             scene.remove(oldObject);
                         }
                        this.extrusionInputDOM = document.querySelector("#input");
                            this.main_svg = this.main;
                            this.top_svg = this.top;
                            this.left_svg = this.left;
                           this.right_svg = this.right;
                           this.front_svg = this.front;
                           this.back_svg = this.back;
                            this.svg = `
                                    <svg>
                                     `+ this.main_svg
                                        +`
                                            `+ this.top_svg
                                        +`
                                    
                                       
                                         
                                    </svg>

                                    `;
                                    console.log('main svg : ' + this.main_svg);
                            const { object, update } = this.renderSVGMain(this.extrusionInput, this.svg);
                            this.objectCount++;
                            object.name = "model"+this.objectCount;
                       
                            const { objectTop } = this.renderSVGTop(this.extrusionInput, this.top_svg);

                            scene.add(object);
                            scene.add(objectTop);

                              const helper = new THREE.GridHelper( 160, 10 );
                        helper.rotation.x = Math.PI / 2;
                        scene.add( helper );
                            this.extrusionInputDOM.addEventListener("input", () => {
                                update(Number(this.extrusionInput));
                            })
            },
           

    },
    
    computed: {
        front () {
            return this.makerjs.exporter.toSVG(this.frontFace(this.cstLongeur, this.cstLargeur, this.cstHauteur, this.cstTab, this.cstMaterialThickness));
        },

        back () {
            return this.makerjs.exporter.toSVG(this.backFace(this.cstLongeur, this.cstLargeur, this.cstHauteur, this.cstTab, this.cstMaterialThickness));
        },

        main () {
            return this.makerjs.exporter.toSVG(this.mainFace(this.cstLongeur, this.cstLargeur, this.cstHauteur, this.cstTab, this.cstMaterialThickness));
        },

        left () {
            return this.makerjs.exporter.toSVG(this.leftFace(this.cstLongeur, this.cstLargeur, this.cstHauteur, this.cstTab, this.cstMaterialThickness));
        },

        right () {
            return this.makerjs.exporter.toSVG(this.rightFace(this.cstLongeur, this.cstLargeur, this.cstHauteur, this.cstTab, this.cstMaterialThickness));
        },

        top () {
            return this.makerjs.exporter.toSVG(this.topFace(this.cstLongeur, this.cstLargeur, this.cstHauteur, this.cstTab, this.cstMaterialThickness));
        },
         
          deleteOldScene () {
               const scene = setupScene(this.app);
                return scene;

            },
        
       

    },
   

}
</script>
