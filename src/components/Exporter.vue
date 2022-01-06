<template>
    <form @submit.prevent="this.createScene()">
        <input
            type="number"
      
            id="input"
            v-model="extrusionInput"
        />
        <input type="number" placeholder="cstLongeurX" v-model="cstLongeur" />
        <input type="number" placeholder="cstLargeurY" v-model="cstLargeur" />
        <input type="number" placeholder="cstHauteurZ" v-model="cstHauteur" />
        
        <input type="number" placeholder="cstTab" v-model="cstTab" />
        <button type="submit">Model01</button>
    </form>
    <button @click="this.btnSVGExportClick()">Download</button>

    <div id="scene"></div>
</template>

<script>
import * as THREE from "three";
import "three/examples/jsm/renderers/Projector";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { setupScene } from "./scene";
import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
    data() {
        return {
           
            cstLongeur: 150,
            cstLargeur: 100,
            cstHauteur: 50,
            cstMaterialThickness: 5,
            cstTab: 10,
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
            app: Document,
            extrusionInputDOM: Document,
            objectCount: 0,
            scene: this.createNewScene,
            camera: this.camera,
            animate: Function,
            
            fillMaterial: new THREE.MeshBasicMaterial({
                color: "#F3FBFB",
                side: THREE.DoubleSide,
                depthWrite: true,
            }),
            stokeMaterial: new THREE.LineBasicMaterial({
                color: "#00A5E6",
                linewidth: this.extrusionInput,
            }),
        };
    },
    mounted: function () {
        this.app = document.querySelector("#scene");
    },
    watch: {
        extrusionInput: function (val) {
            this.extrusionInput = val;
            console.log("extrusion ! " + this.cstMaterialThickness);
        },
        cstLongeur: function (val) {
            this.cstLongeur = val;
            console.log(this.cstLongeur);
        },
        cstLargeur: function (val) {
            this.cstLargeur = val;
        },
        cstHauteur: function (val) {
            this.cstHauteur = val;
        },
     
        cstTab: function (val) {
            this.cstTab = val;
        },
    },
    methods: {
        renderSVGMain(extrusion, svg, scene) {
            const loader = new SVGLoader();
            const svgData = loader.parse(svg);
            const svgGroup = new THREE.Group();
            const updateMap = [];
            svgGroup.scale.y *= -1;
            svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);
                shapes.forEach((shape) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(
                        shape,
                        {
                            depth: extrusion,
                            bevelEnabled: false,
                        }
                    );
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                    const mesh = new THREE.Mesh(
                        meshGeometry,
                        this.fillMaterial
                    );
                    const lines = new THREE.LineSegments(
                        linesGeometry,
                        this.stokeMaterial
                    );
                    updateMap.push({ shape, mesh, lines });
                    svgGroup.add(mesh, lines);
                });
            });
            svgGroup.width = this.cstLargeur;
            svgGroup.height = this.cstLargeur;
            svgGroup.position.x = -(this.cstLongeur / 2);
            svgGroup.position.y = -(this.cstHauteur / 2);
            svgGroup.position.z = -(this.cstLargeur / 2);
            svgGroup.rotation.x = -(Math.PI / 2);
              if(this.objectCount > 0) {
                scene.remove(scene.getObjectByName( "main", true ));
            }

            scene.add(svgGroup);
            this.objectCount++;

            svgGroup.name ="main";
            return {
                object: svgGroup,
                updateMain(extrusion) {
                    updateMap.forEach((updateDetails) => {
                        const meshGeometry = new THREE.ExtrudeBufferGeometry(
                            updateDetails.shape,
                            {
                                depth: extrusion,
                                bevelEnabled: false,
                            }
                        );
                        const linesGeometry = new THREE.EdgesGeometry(
                            meshGeometry
                        );
                        updateDetails.mesh.geometry.dispose();
                        updateDetails.lines.geometry.dispose();
                        updateDetails.mesh.geometry = meshGeometry;
                        updateDetails.lines.geometry = linesGeometry;
                    });
                },
            };
        },

        renderSVGTop(extrusion, svg, scene) {
            const loader = new SVGLoader();
            const svgData = loader.parse(svg);
            const svgGroup = new THREE.Group();
            const updateMap = [];

            svgGroup.scale.y *= -1;
            svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);

                shapes.forEach((shape) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(
                        shape,
                        {
                            depth: extrusion,
                            bevelEnabled: false,
                        }
                    );
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                    const mesh = new THREE.Mesh(
                        meshGeometry,
                        this.fillMaterial
                    );
                    const lines = new THREE.LineSegments(
                        linesGeometry,
                        this.stokeMaterial
                    );

                    updateMap.push({ shape, mesh, lines });
                    svgGroup.add(mesh, lines);
                });
            });

            svgGroup.position.x = -(this.cstLongeur / 2);
            svgGroup.position.y = this.cstHauteur / 2;
            svgGroup.position.z = this.cstLargeur / 2;

            svgGroup.rotation.x = Math.PI / 2;
              if(this.objectCount > 0) {
                scene.remove(scene.getObjectByName( "top", true ));
            }

            scene.add(svgGroup);
            this.objectCount++;

            svgGroup.name ="top";

            return {
                object: svgGroup,
                updateTop(extrusion) {
                    updateMap.forEach((updateDetails) => {
                        const meshGeometry = new THREE.ExtrudeBufferGeometry(
                            updateDetails.shape,
                            {
                                depth: extrusion,
                                bevelEnabled: false,
                            }
                        );
                        const linesGeometry = new THREE.EdgesGeometry(
                            meshGeometry
                        );

                        updateDetails.mesh.geometry.dispose();
                        updateDetails.lines.geometry.dispose();
                        updateDetails.mesh.geometry = meshGeometry;
                        updateDetails.lines.geometry = linesGeometry;
                    });
                },
            };
        },

        renderSVGLeft(extrusion, svg, scene) {
            const loader = new SVGLoader();
            const svgData = loader.parse(svg);
            const svgGroup = new THREE.Group();
            const updateMap = [];

            svgGroup.scale.y *= -1;
            svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);

                shapes.forEach((shape) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(
                        shape,
                        {
                            depth: extrusion,
                            bevelEnabled: false,
                        }
                    );
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                    const mesh = new THREE.Mesh(
                        meshGeometry,
                        this.fillMaterial
                    );
                    const lines = new THREE.LineSegments(
                        linesGeometry,
                        this.stokeMaterial
                    );

                    updateMap.push({ shape, mesh, lines });
                    svgGroup.add(mesh, lines);
                });
            });

            svgGroup.position.x = -(this.cstLongeur / 2);
            svgGroup.position.y = -(this.cstHauteur / 2);
            svgGroup.position.z = this.cstLargeur / 2;

            svgGroup.rotation.z = Math.PI / 2;
            svgGroup.rotation.y = Math.PI / 2;
            
            if(this.objectCount > 0) {
                scene.remove(scene.getObjectByName( "left", true ));
            }

            scene.add(svgGroup);
            this.objectCount++;

            svgGroup.name ="left";
           
            return {
                object: svgGroup,
                updateLeft(extrusion) {
                    updateMap.forEach((updateDetails) => {
                        const meshGeometry = new THREE.ExtrudeBufferGeometry(
                            updateDetails.shape,
                            {
                                depth: extrusion,
                                bevelEnabled: false,
                            }
                        );
                        const linesGeometry = new THREE.EdgesGeometry(
                            meshGeometry
                        );

                        updateDetails.mesh.geometry.dispose();
                        updateDetails.lines.geometry.dispose();
                        updateDetails.mesh.geometry = meshGeometry;
                        updateDetails.lines.geometry = linesGeometry;
                    });
                },
            };
        },

        renderSVGRight(extrusion, svg, scene) {
            const loader = new SVGLoader();
            const svgData = loader.parse(svg);
            const svgGroup = new THREE.Group();
            const updateMap = [];

            svgGroup.scale.y *= -1;
            svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);

                shapes.forEach((shape) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(
                        shape,
                        {
                            depth: extrusion,
                            bevelEnabled: false,
                        }
                    );
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                    const mesh = new THREE.Mesh(
                        meshGeometry,
                        this.fillMaterial
                    );
                    const lines = new THREE.LineSegments(
                        linesGeometry,
                        this.stokeMaterial
                    );

                    updateMap.push({ shape, mesh, lines });
                    svgGroup.add(mesh, lines);
                });
            });

            svgGroup.position.x =
                this.cstLongeur / 2 - this.cstMaterialThickness;
            svgGroup.position.y = -(this.cstHauteur / 2);
            svgGroup.position.z = this.cstLargeur / 2;

            svgGroup.rotation.z = Math.PI / 2;
            svgGroup.rotation.y = Math.PI / 2;

            if(this.objectCount > 0) {
                scene.remove(scene.getObjectByName( "right", true ));
            }

            scene.add(svgGroup);
            this.objectCount++;

            svgGroup.name ="right";
            return {
                object: svgGroup,
                updateRight(extrusion) {
                    updateMap.forEach((updateDetails) => {
                        const meshGeometry = new THREE.ExtrudeBufferGeometry(
                            updateDetails.shape,
                            {
                                depth: extrusion,
                                bevelEnabled: false,
                            }
                        );
                        const linesGeometry = new THREE.EdgesGeometry(
                            meshGeometry
                        );

                        updateDetails.mesh.geometry.dispose();
                        updateDetails.lines.geometry.dispose();
                        updateDetails.mesh.geometry = meshGeometry;
                        updateDetails.lines.geometry = linesGeometry;
                    });
                },
            };
        },

        renderSVGFront(extrusion, svg, scene) {
            const loader = new SVGLoader();
            const svgData = loader.parse(svg);
            const svgGroup = new THREE.Group();
            const updateMap = [];

            svgGroup.scale.y *= -1;
            svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);

                shapes.forEach((shape) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(
                        shape,
                        {
                            depth: extrusion,
                            bevelEnabled: false,
                        }
                    );
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                    const mesh = new THREE.Mesh(
                        meshGeometry,
                        this.fillMaterial
                    );
                    const lines = new THREE.LineSegments(
                        linesGeometry,
                        this.stokeMaterial
                    );

                    updateMap.push({ shape, mesh, lines });
                    svgGroup.add(mesh, lines);
                });
            });

            svgGroup.position.x = -(this.cstLongeur / 2);
            svgGroup.position.y = this.cstHauteur / 2;
            svgGroup.position.z =
                this.cstLargeur / 2 - this.cstMaterialThickness;

            if(this.objectCount > 0) {
                scene.remove(scene.getObjectByName( "front", true ));
            }

            scene.add(svgGroup);
            this.objectCount++;

            svgGroup.name ="front";

            return {
                object: svgGroup,
                updateFront(extrusion) {
                    updateMap.forEach((updateDetails) => {
                        const meshGeometry = new THREE.ExtrudeBufferGeometry(
                            updateDetails.shape,
                            {
                                depth: extrusion,
                                bevelEnabled: false,
                            }
                        );
                        const linesGeometry = new THREE.EdgesGeometry(
                            meshGeometry
                        );

                        updateDetails.mesh.geometry.dispose();
                        updateDetails.lines.geometry.dispose();
                        updateDetails.mesh.geometry = meshGeometry;
                        updateDetails.lines.geometry = linesGeometry;
                    });
                },
            };
        },

        renderSVGBack(extrusion, svg, scene) {
            const loader = new SVGLoader();
            const svgData = loader.parse(svg);
            const svgGroup = new THREE.Group();
            const updateMap = [];

            svgGroup.scale.y *= -1;
            svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);

                shapes.forEach((shape) => {
                    const meshGeometry = new THREE.ExtrudeBufferGeometry(
                        shape,
                        {
                            depth: extrusion,
                            bevelEnabled: false,
                        }
                    );
                    const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                    const mesh = new THREE.Mesh(
                        meshGeometry,
                        this.fillMaterial
                    );
                    const lines = new THREE.LineSegments(
                        linesGeometry,
                        this.stokeMaterial
                    );

                    updateMap.push({ shape, mesh, lines });
                    svgGroup.add(mesh, lines);
                });
            });

            svgGroup.position.x = -this.cstLongeur / 2;
            svgGroup.position.y = this.cstHauteur / 2;
            svgGroup.position.z = -this.cstLargeur / 2;

              if(this.objectCount > 0) {
                scene.remove(scene.getObjectByName( "back", true ));
            }

            scene.add(svgGroup);
            this.objectCount++;

            svgGroup.name ="back";

            return {
                object: svgGroup,
                updateBack(extrusion) {
                    updateMap.forEach((updateDetails) => {
                        const meshGeometry = new THREE.ExtrudeBufferGeometry(
                            updateDetails.shape,
                            {
                                depth: extrusion,
                                bevelEnabled: false,
                            }
                        );
                        const linesGeometry = new THREE.EdgesGeometry(
                            meshGeometry
                        );

                        updateDetails.mesh.geometry.dispose();
                        updateDetails.lines.geometry.dispose();
                        updateDetails.mesh.geometry = meshGeometry;
                        updateDetails.lines.geometry = linesGeometry;
                    });
                },
            };
        },

     

       setupScene (container) {
                const scene = new THREE.Scene();
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                const camera = new THREE.PerspectiveCamera(
                50,
                window.innerWidth / window.innerHeight,
                0.01,
                1e5
                );
                const ambientLight = new THREE.AmbientLight("#888888");
                const pointLight = new THREE.PointLight("#ffffff", 2, 800);
                const controls = new OrbitControls(camera, renderer.domElement);
                const animate = () => {
                renderer.render(scene, camera);
                controls.update();
                requestAnimationFrame(animate.bind(this));
                
                }
            
                renderer.setSize(window.innerWidth, window.innerHeight);
                scene.add(ambientLight, pointLight);
                camera.position.z = 0;
                camera.position.x = 0;
                camera.position.y = 300;
                controls.enablePan = false;
                container.append(renderer.domElement);
                window.addEventListener("resize", () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                              

                });
                animate();
                this.animate = animate();
                  this.camera = camera;
                return scene;
            },
       
        createScene() {
            const scene = this.createNewScene;
            this.scene = scene;

            this.extrusionInputDOM = document.querySelector("#input");
            this.main_svg = this.main;
            this.top_svg = this.top;
            this.left_svg = this.left;
            this.right_svg = this.right;
            this.front_svg = this.front;
            this.back_svg = this.back;

           var { objectTop, updateTop } = this.renderSVGTop(
                this.extrusionInput,
                this.top_svg,
                scene
            );

           var { objectLeft, updateLeft } = this.renderSVGLeft(
                this.extrusionInput,
                this.left_svg,
                scene
            );

            var { objectRight, updateRight } = this.renderSVGRight(
                this.extrusionInput,
                this.right_svg,
                scene
            );

            var { objectMain, updateMain } = this.renderSVGMain(
                this.extrusionInput,
                this.main_svg,
                scene
            );

            var { objectFront, updateFront } = this.renderSVGFront(
                this.extrusionInput,
                this.front_svg,
                scene
            );

            var { objectBack, updateBack } = this.renderSVGBack(
                this.extrusionInput,
                this.back_svg,
                scene
            );

                        


            const helper = new THREE.GridHelper(1000, 10);
            helper.rotation.x = Math.PI / 2;
            scene.add(helper);

       
        },


     btnSVGExportClick() {
                console.log('clicked');
                this.ExportToSVG();
                },

        ExportToSVG() {
                var XMLS = new XMLSerializer();

                var svgData = 
                '<svg xmlns="http://www.w3.org/2000/svg">'+
                '<svg >  <g transform="translate(20,2.5)">'+
                this.back+
                '</g> </svg>'+

                '<svg >  <g transform="translate(20,70.5)">'+
                this.front+
                '</g></svg>'+


                '<svg >  <g transform="translate(200,2.5)">'+
                this.right+
                '</g></svg>'+


                '<svg >  <g transform="translate(200,100.5)">'+
                this.left+
                '</g></svg>'+


                '<svg >  <g transform="translate(300,2.5) ">'+
                this.main+
                '</g></svg>'+


                '<svg >  <g transform="translate(300,120.5)">'+
                this.top+
                '</g></svg>'+
               
                '</svg>';
                var preface = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
                var svgBlob = new Blob([preface, svgData], {
                     type: "image/svg+xml;charset=utf-8"
                });
                var svgUrl = URL.createObjectURL(svgBlob);
                var downloadLink = document.createElement("a");
                
                downloadLink.href = svgUrl;
                downloadLink.download = 'your_svg';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
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
            var fingerLengthTopLine =
                (longeur - nbrTabTopLine * tab) / nbrFingerTopLine;
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [longeur - thickness, 0]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going right
                        dx += fingerLengthTopLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going down
                        dy = -thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right with tab
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx += tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = 0;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            var fingerLengthRightLine =
                (hauteur - nbrTabRightLine * tab) / nbrFingerRightLine;
            var upsAndDownRightLine =
                2 * (nbrFingerRightLine + nbrTabRightLine) - 1;
            // right line
            ox = longeur - thickness;
            oy = 0;
            dx = longeur - thickness;
            dy = 0;
            for (i = 0; i < upsAndDownRightLine / 2; i++) {
                if (i + 1 > upsAndDownRightLine / 2) {
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [longeur - thickness, -hauteur]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going down
                        dy -= tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going right
                        dx = longeur;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy -= fingerLengthRightLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = longeur - thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [thickness, -hauteur]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going left
                        dx -= tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going up
                        dy += thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx -= fingerLengthTopLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -hauteur;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [thickness, -thickness]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going up
                        dy += tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going left
                        dx = 0;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy += fingerLengthRightLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                }
            }
            // return main array
            console.log("exporter : " + mainModel);
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
            var fingerLengthTopLine =
                (longeur - nbrTabTopLine * tab) / nbrFingerTopLine;
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [longeur - thickness, 0]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going right
                        dx += fingerLengthTopLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going down
                        dy = -thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right with tab
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx += tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = 0;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            var fingerLengthRightLine =
                (hauteur - nbrTabRightLine * tab) / nbrFingerRightLine;
            var upsAndDownRightLine =
                2 * (nbrFingerRightLine + nbrTabRightLine) - 1;
            // right line
            ox = longeur - thickness;
            oy = 0;
            dx = longeur - thickness;
            dy = 0;
            for (i = 0; i < upsAndDownRightLine / 2; i++) {
                if (i + 1 > upsAndDownRightLine / 2) {
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [longeur - thickness, -hauteur]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going down
                        dy -= tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going right
                        dx = longeur;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy -= fingerLengthRightLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = longeur - thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [thickness, -hauteur]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going left
                        dx -= tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going up
                        dy += thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx -= fingerLengthTopLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -hauteur;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [thickness, -thickness]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going up
                        dy += tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going left
                        dx = 0;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy += fingerLengthRightLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            while (l - 2 * tab > 2 * tab)  {
                iteration += 2;
                l -= 2 * tab;
            }
            var nbrTabTopLine = iteration - (iteration - 1) / 2;
            var nbrFingerTopLine = nbrTabTopLine - 1;
            var fingerLengthTopLine =
                (longeur - nbrTabTopLine * tab) / nbrFingerTopLine;
            var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
            var sum =
                fingerLengthTopLine * nbrFingerTopLine + nbrTabTopLine * tab;
            // init model
            var mainModel = { models: {}, paths: {} };
            var ox = thickness,
                oy = -thickness,
                dx = 0,
                dy = -thickness,
                pathIndicator = 0;
            // top side;
            for (var i = 0; i < upsAndDownTopLine / 2; i++) {
                if (i > upsAndDownTopLine / 2 - 1) {
                    // last tab-thickness
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [longeur - thickness, dy]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        dx += tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going up
                        dy = 0;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx += fingerLengthTopLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            var fingerLengthRightLine =
                (largeur - nbrTabRightLine * tab) / nbrFingerRightLine;
            var upsAndDownRightLine =
                2 * (nbrFingerRightLine + nbrTabRightLine) - 1;

            // right side
            ox = longeur - thickness;
            oy = -thickness;
            dx = longeur - thickness;
            dy = 0;
            for (i = 0; i < upsAndDownRightLine / 2; i++) {
                if (i > upsAndDownRightLine / 2 - 1) {
                    // last tab-thickness
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [dx, -largeur + thickness]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going down
                        dy -= tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going left
                        dx = longeur;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy -= fingerLengthRightLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = longeur - thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [thickness, -largeur + thickness]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going left
                        dx -= tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going down
                        dy -= thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx -= fingerLengthTopLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -largeur + thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [thickness, -thickness]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going up
                        dy += tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going left
                        dx = 0;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy += fingerLengthRightLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            var fingerLengthTopLine =
                (hauteur - nbrTabTopLine * tab) / nbrFingerTopLine;
            var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
            var sum =
                fingerLengthTopLine * nbrFingerTopLine + nbrTabTopLine * tab;
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                } else {
                    // going down
                    dy = -thickness;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going right with fingersize
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dx += fingerLengthTopLine;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going up
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dy = 0;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            var fingerLengthRightLine =
                (largeur - nbrTabRightLine * tab) / nbrFingerRightLine;
            var upsAndDownRightLine =
                2 * (nbrFingerRightLine + nbrTabRightLine) - 1;
            // right line
            ox = hauteur;
            oy = 0;
            dx = hauteur;
            dy = 0;
            for (i = 0; i < upsAndDownRightLine / 2; i++) {
                if (i % 2 == 0) {
                    // going down
                    dy -= tab;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                } else {
                    // going left
                    dx = hauteur - thickness;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going down with fingersize
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dy -= fingerLengthRightLine;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going right
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dx = hauteur;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                } else {
                    // going up
                    dy += thickness;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going left with fingersize
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dx -= fingerLengthTopLine;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going down
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dy = -largeur;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                } else {
                    // going right
                    dx = thickness;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going up with fingersize
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dy += fingerLengthRightLine;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going left
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dx = 0;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            var fingerLengthTopLine =
                (hauteur - nbrTabTopLine * tab) / nbrFingerTopLine;
            var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
            var sum =
                fingerLengthTopLine * nbrFingerTopLine + nbrTabTopLine * tab;
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                } else {
                    // going down
                    dy = -thickness;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going right with fingersize
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dx += fingerLengthTopLine;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going up
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dy = 0;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            var fingerLengthRightLine =
                (largeur - nbrTabRightLine * tab) / nbrFingerRightLine;
            var upsAndDownRightLine =
                2 * (nbrFingerRightLine + nbrTabRightLine) - 1;
            // right line
            ox = hauteur;
            oy = 0;
            dx = hauteur;
            dy = 0;
            for (i = 0; i < upsAndDownRightLine / 2; i++) {
                if (i % 2 == 0) {
                    // going down
                    dy -= tab;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                } else {
                    // going left
                    dx = hauteur - thickness;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going down with fingersize
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dy -= fingerLengthRightLine;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going right
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dx = hauteur;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                } else {
                    // going up
                    dy += thickness;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going left with fingersize
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dx -= fingerLengthTopLine;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going down
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dy = -largeur;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                } else {
                    // going right
                    dx = thickness;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going up with fingersize
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dy += fingerLengthRightLine;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                    // going left
                    pathIndicator++;
                    ox = dx;
                    oy = dy;
                    dx = 0;
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            var fingerLengthTopLine =
                (longeur - nbrTabTopLine * tab) / nbrFingerTopLine;
            var upsAndDownTopLine = 2 * (nbrFingerTopLine + nbrTabTopLine) - 1;
            var sum =
                fingerLengthTopLine * nbrFingerTopLine + nbrTabTopLine * tab;
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [longeur - thickness, dy]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        dx += tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going up
                        dy = 0;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx += fingerLengthTopLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
            var fingerLengthRightLine =
                (largeur - nbrTabRightLine * tab) / nbrFingerRightLine;
            var upsAndDownRightLine =
                2 * (nbrFingerRightLine + nbrTabRightLine) - 1;

            // right side
            ox = longeur - thickness;
            oy = -thickness;
            dx = longeur - thickness;
            dy = 0;
            for (i = 0; i < upsAndDownRightLine / 2; i++) {
                if (i > upsAndDownRightLine / 2 - 1) {
                    // last tab-thickness
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [dx, -largeur + thickness]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going down
                        dy -= tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going left
                        dx = longeur;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going down with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy -= fingerLengthRightLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = longeur - thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [thickness, -largeur + thickness]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going left
                        dx -= tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going down
                        dy -= thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going left with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx -= fingerLengthTopLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy = -largeur + thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
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
                    mainModel.paths[pathIndicator] =
                        new this.makerjs.paths.Line(
                            [ox, oy],
                            [thickness, -thickness]
                        );
                    pathIndicator++;
                } else {
                    if (i % 2 == 0) {
                        // going up
                        dy += tab;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    } else {
                        // going left
                        dx = 0;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going up with fingersize
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dy += fingerLengthRightLine;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // going right
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                        dx = thickness;
                        mainModel.paths[pathIndicator] =
                            new this.makerjs.paths.Line([ox, oy], [dx, dy]);
                        // set new values
                        pathIndicator++;
                        ox = dx;
                        oy = dy;
                    }
                }
            }
            return mainModel;
        },  
   
        
    },

    computed: {
   
   
        front() {
            return this.makerjs.exporter.toSVG(
                this.frontFace(
                    this.cstLongeur,
                    this.cstLargeur,
                    this.cstHauteur,
                    this.cstTab,
                    this.extrusionInput
                )
            );
        },

        back() {
            return this.makerjs.exporter.toSVG(
                this.backFace(
                    this.cstLongeur,
                    this.cstLargeur,
                    this.cstHauteur,
                    this.cstTab,
                    this.extrusionInput
                )
            );
        },

        main() {
            return this.makerjs.exporter.toSVG(
                this.mainFace(
                    this.cstLongeur,
                    this.cstLargeur,
                    this.cstHauteur,
                    this.cstTab,
                    this.extrusionInput
                )
            );
        },

        left() {
            return this.makerjs.exporter.toSVG(
                this.leftFace(
                    this.cstLongeur,
                    this.cstLargeur,
                    this.cstHauteur,
                    this.cstTab,
                    this.extrusionInput
                )
            );
        },

        right() {
            return this.makerjs.exporter.toSVG(
                this.rightFace(
                    this.cstLongeur,
                    this.cstLargeur,
                    this.cstHauteur,
                    this.cstTab,
                    this.extrusionInput
                )
            );
        },

        top() {
            return this.makerjs.exporter.toSVG(
                this.topFace(
                    this.cstLongeur,
                    this.cstLargeur,
                    this.cstHauteur,
                    this.cstTab,
                    this.extrusionInput
                )
            );
        },


         createNewScene() {
            const scene = this.setupScene(this.app);
            return scene;
        },
        
      
        

    
    },
};
</script>