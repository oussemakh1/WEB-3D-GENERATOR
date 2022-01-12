# CGI BOX MODEL GENERATOR
###### This Generator script objective is to create a customizable 3d Model that can be downloaded in svg form
## Tools:
<b>VueJs
 ###### Install NodeJs: https://nodejs.org/en/download/
  ###### Install VueJs: ```npm install vue ```

 <b> ViteJs
   ###### Install ViteJs: ``` npm init vite@latest project_name --template vue ```
 
 <b> ThreeJs <br>
   ###### Install ThreeJs: ``` npm install --save three ```
## Understanding:
###### [COMPUTED]
  ###### Export new 2d SVG model with makerJs library  using  the method "frontFace" that takes 5 parameters (length, width, height, tabulation, extrusion) each parameter is provided from the user inputs this process repeat for all model faces
   ```javascript
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
  
   ```
  
  
###### Create new threeJs scene using the "setupScene" method that handles the camera, render, and animation it also take a parameter of type DOMOBject that well use as a container to publish the created scene in it
   ```javascript
         createNewScene() {
            const scene = this.setupScene(this.app);
            return scene;
        },
  
   ```
  
  
  
  
###### [METHODS]
  ###### Render && Create new Threejs 3d object through the usage of the given three parameters (extrusion : model depth, svg: makerjs GeneratedSVG, scene: threejs CreatedScene)  this method responsibility is to handle provided SVG change it's depth to the given extrusion, render 3d model then put it in the given threejs scene with the right positioning 
   ```javascript
  /**
  *Render model main face method
  *@param Number
  *@param SVG
  *@param Scene
  **/
 renderSVGMain(extrusion, svg, scene) {
            // instantiate new SVGLoader
            const loader = new SVGLoader();
            
            // pass the given SVG into the  SVGLoader
            const svgData = loader.parse(svg);
            const svgGroup = new THREE.Group();
            const updateMap = [];
            svgGroup.scale.y *= -1;
            svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);
               // Handle model mesh && lines 
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
            
            // set object width && height equal to the given user inputs
            svgGroup.width = this.cstLargeur;
            svgGroup.height = this.cstLargeur;
  
            // main object positionning formula
            svgGroup.position.x = -(this.cstLongeur / 2);
            svgGroup.position.y = -(this.cstHauteur / 2);
            svgGroup.position.z = -(this.cstLargeur / 2);
            svgGroup.rotation.x = -(Math.PI / 2);
            
            // check if this object already exists on update and do a delete operation for the old object from scene if it already exists through the given unique name of object
            if(this.objectCount > 0) {
                scene.remove(scene.getObjectByName( "main", true ));
            }
            
  
            // add object to scene and increment the object number in scene 
            scene.add(svgGroup);
            this.objectCount++;
            
            // set a unique name to the object in the scene
            svgGroup.name ="main";
          
           // return the object && updateExtrusion method for real time update
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
  
   ```
