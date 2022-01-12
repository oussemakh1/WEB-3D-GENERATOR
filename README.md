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
