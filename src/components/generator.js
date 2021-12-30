import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { setupScene } from "./scene";



const fillMaterial = new THREE.MeshBasicMaterial({ color: "#F3FBFB" });
const stokeMaterial = new THREE.LineBasicMaterial({
  color: "#00A5E6",
});
const renderSVG = (extrusion, svg) => {
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
      const mesh = new THREE.Mesh(meshGeometry, fillMaterial);
      const lines = new THREE.LineSegments(linesGeometry, stokeMaterial);

      updateMap.push({ shape, mesh, lines });
      svgGroup.add(mesh, lines);
    });
  });

  const box = new THREE.Box3().setFromObject(svgGroup);
  const size = box.getSize(new THREE.Vector3());
  const yOffset = size.y / -2;
  const xOffset = size.x / -2;

  // Offset all of group's elements, to center them
  svgGroup.children.forEach((item) => {
    item.position.x = xOffset;
    item.position.y = yOffset;
  });
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
    updateLongeur(longeur) {
      cstLongeur = longeur;
      console.log(cstLongeur);
      console.log(top);

    }
  };
};

let makerjs = require("makerjs");
let cstLongeur = 300;
var cstLargeur =150;
var cstHauteur = 200;
var cstMaterialThickness =10;
var cstTab = 20;
var i = 0;
function corner(longeur, largeur, hauteur, tab, thickness) {
  var mainCoin = { models: {}, paths: {} };
  var pathIndicator = 0;
  // going right
  mainCoin.paths[pathIndicator] = new makerjs.paths.Line([0, 0], [hauteur, 0]);
  pathIndicator++;
  // going down
  mainCoin.paths[pathIndicator] = new makerjs.paths.Line([hauteur, 0], [hauteur, -hauteur]);
  pathIndicator++;
  // going left
  mainCoin.paths[pathIndicator] = new makerjs.paths.Line([hauteur, -hauteur], [0, -hauteur]);
  pathIndicator++;
  // going up
  mainCoin.paths[pathIndicator] = new makerjs.paths.Line([0, -hauteur], [0, 0]);
  pathIndicator++;
  // /
  mainCoin.paths[pathIndicator] = new makerjs.paths.Line([0, -hauteur], [hauteur, 0]);
  pathIndicator++;
  // \
  mainCoin.paths[pathIndicator] = new makerjs.paths.Line([0, 0], [hauteur, -hauteur]);
  return mainCoin;
}
function frontFace(longeur, largeur, hauteur, tab, thickness) {
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [longeur - thickness, 0]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going right
        dx += fingerLengthTopLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going down
        dy = -thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right with tab
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx += tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going up
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy = 0;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [longeur - thickness, -hauteur]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going down
        dy -= tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going right
        dx = longeur;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going down with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy -= fingerLengthRightLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going left
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx = longeur - thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [thickness, -hauteur]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going left
        dx -= tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going up
        dy += thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going left with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx -= fingerLengthTopLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going down
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy = -hauteur;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [thickness, -thickness]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going up
        dy += tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going left
        dx = 0;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going up with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy += fingerLengthRightLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx = thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // set new values
        pathIndicator++;
        ox = dx;
        oy = dy;
      }
    }
  }
  // return main array
  return mainModel;
}
function backFace(longeur, largeur, hauteur, tab, thickness) {
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
  for (i = 0; i < upsAndDownTopLine / 2; i++) {
    if (i + 1 > upsAndDownTopLine / 2) {
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [longeur - thickness, 0]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going right
        dx += fingerLengthTopLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going down
        dy = -thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right with tab
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx += tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going up
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy = 0;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [longeur - thickness, -hauteur]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going down
        dy -= tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going right
        dx = longeur;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going down with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy -= fingerLengthRightLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going left
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx = longeur - thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [thickness, -hauteur]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going left
        dx -= tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going up
        dy += thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going left with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx -= fingerLengthTopLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going down
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy = -hauteur;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [thickness, -thickness]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going up
        dy += tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going left
        dx = 0;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going up with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy += fingerLengthRightLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx = thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // set new values
        pathIndicator++;
        ox = dx;
        oy = dy;
      }
    }
  }
  // return main array
  return mainModel;
}
function mainFace(longeur, largeur, hauteur, tab, thickness) {
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [longeur - thickness, dy]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        dx += tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going up
        dy = 0;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx += fingerLengthTopLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going down
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy = -thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, -largeur + thickness]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going down
        dy -= tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going left
        dx = longeur;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going down with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy -= fingerLengthRightLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx = longeur - thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [thickness, -largeur + thickness]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going left
        dx -= tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going down
        dy -= thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going left with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx -= fingerLengthTopLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going up
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy = -largeur + thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [thickness, -thickness]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going up
        dy += tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going left
        dx = 0;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going up with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy += fingerLengthRightLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx = thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // set new values
        pathIndicator++;
        ox = dx;
        oy = dy;
      }
    }
  }
  return mainModel;
}
function leftFace(longeur, largeur, hauteur, tab, thickness) {
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      pathIndicator++;
      ox = dx;
      oy = dy;
    } else {
      // going down
      dy = -thickness;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going right with fingersize
      pathIndicator++;
      ox = dx;
      oy = dy;
      dx += fingerLengthTopLine;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going up
      pathIndicator++;
      ox = dx;
      oy = dy;
      dy = 0;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      pathIndicator++;
      ox = dx;
      oy = dy;
    } else {
      // going left
      dx = hauteur - thickness;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going down with fingersize
      pathIndicator++;
      ox = dx;
      oy = dy;
      dy -= fingerLengthRightLine;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going right
      pathIndicator++;
      ox = dx;
      oy = dy;
      dx = hauteur;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      pathIndicator++;
      ox = dx;
      oy = dy;
    } else {
      // going up
      dy += thickness;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going left with fingersize
      pathIndicator++;
      ox = dx;
      oy = dy;
      dx -= fingerLengthTopLine;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going down
      pathIndicator++;
      ox = dx;
      oy = dy;
      dy = -largeur;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      pathIndicator++;
      ox = dx;
      oy = dy;
    } else {
      // going right
      dx = thickness;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going up with fingersize
      pathIndicator++;
      ox = dx;
      oy = dy;
      dy += fingerLengthRightLine;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going left
      pathIndicator++;
      ox = dx;
      oy = dy;
      dx = 0;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // set new values
      pathIndicator++;
      ox = dx;
      oy = dy;
    }
  }
  return mainModel;
}
function rightFace(longeur, largeur, hauteur, tab, thickness) {
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      pathIndicator++;
      ox = dx;
      oy = dy;
    } else {
      // going down
      dy = -thickness;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going right with fingersize
      pathIndicator++;
      ox = dx;
      oy = dy;
      dx += fingerLengthTopLine;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going up
      pathIndicator++;
      ox = dx;
      oy = dy;
      dy = 0;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      pathIndicator++;
      ox = dx;
      oy = dy;
    } else {
      // going left
      dx = hauteur - thickness;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going down with fingersize
      pathIndicator++;
      ox = dx;
      oy = dy;
      dy -= fingerLengthRightLine;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going right
      pathIndicator++;
      ox = dx;
      oy = dy;
      dx = hauteur;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      pathIndicator++;
      ox = dx;
      oy = dy;
    } else {
      // going up
      dy += thickness;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going left with fingersize
      pathIndicator++;
      ox = dx;
      oy = dy;
      dx -= fingerLengthTopLine;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going down
      pathIndicator++;
      ox = dx;
      oy = dy;
      dy = -largeur;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      pathIndicator++;
      ox = dx;
      oy = dy;
    } else {
      // going right
      dx = thickness;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going up with fingersize
      pathIndicator++;
      ox = dx;
      oy = dy;
      dy += fingerLengthRightLine;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // going left
      pathIndicator++;
      ox = dx;
      oy = dy;
      dx = 0;
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
      // set new values
      pathIndicator++;
      ox = dx;
      oy = dy;
    }
  }
  return mainModel;
}
function topFace(longeur, largeur, hauteur, tab, thickness) {
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [longeur - thickness, dy]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        dx += tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going up
        dy = 0;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx += fingerLengthTopLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going down
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy = -thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, -largeur + thickness]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going down
        dy -= tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going left
        dx = longeur;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going down with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy -= fingerLengthRightLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx = longeur - thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [thickness, -largeur + thickness]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going left
        dx -= tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going down
        dy -= thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going left with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx -= fingerLengthTopLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going up
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy = -largeur + thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
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
      mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [thickness, -thickness]);
      pathIndicator++;
    } else {
      if (i % 2 == 0) {
        // going up
        dy += tab;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        pathIndicator++;
        ox = dx;
        oy = dy;
      } else {
        // going left
        dx = 0;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going up with fingersize
        pathIndicator++;
        ox = dx;
        oy = dy;
        dy += fingerLengthRightLine;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // going right
        pathIndicator++;
        ox = dx;
        oy = dy;
        dx = thickness;
        mainModel.paths[pathIndicator] = new makerjs.paths.Line([ox, oy], [dx, dy]);
        // set new values
        pathIndicator++;
        ox = dx;
        oy = dy;
      }
    }
  }
  return mainModel;
}




const corner1 = makerjs.exporter.toSVG(corner(cstLongeur, cstLargeur, cstHauteur, cstTab, cstMaterialThickness)); // Empty Corner
// Left Male Face
const front = makerjs.exporter.toSVG(frontFace(cstLongeur, cstLargeur, cstHauteur, cstTab, cstMaterialThickness)); // Male

// Left Male Face
const left = makerjs.exporter.toSVG(leftFace(cstLongeur, cstLargeur, cstHauteur, cstTab, cstMaterialThickness)); // Male
// Main Female Face
const main = makerjs.exporter.toSVG(mainFace(cstLongeur, cstLargeur, cstHauteur, cstTab, cstMaterialThickness)); // Female
// Right Male Face
const right = makerjs.exporter.toSVG(rightFace(cstLongeur, cstLargeur, cstHauteur, cstTab, cstMaterialThickness)); // Male

let top = makerjs.exporter.toSVG(topFace(cstLongeur, cstLargeur, cstHauteur, cstTab, cstMaterialThickness)); // Female
const corner2 = makerjs.exporter.toSVG(corner(cstLongeur, cstLargeur, cstHauteur, cstTab, cstMaterialThickness)); // Empty Corner
const back = makerjs.exporter.toSVG(backFace(cstLongeur, cstLargeur, cstHauteur, cstTab, cstMaterialThickness)); // Female




var svg = `
<svg>
    <svg>
    `+main+`
    <svg  transform="rotate(180 160 10) scaleY(-1 -1)">`+top+`</svg>
    </svg>
    <svg  transform="rotate(180 160 140)">`+top+`</svg>
    </svg>

</svg>

`;

// main.js
const defaultExtrusion = 2;
const app = document.querySelector("#app");
const extrusionInput = document.querySelector("#input");
const scene = setupScene(app);
const { object, update } = renderSVG(defaultExtrusion, svg);

scene.add(object);


/*extrusionInput.addEventListener("input", () => {
  update(Number(extrusionInput.value));
});*/

extrusionInput.value = defaultExtrusion;

export {scene}





