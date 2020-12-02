const { Session, SessionSync } = window.zeaCollab
const {
  GLRenderer,
  Scene,
  TreeItem,
  PassType,
  GeomItem,
  Color,
  Vec2,
  Vec3,
  Mat3,
  Mat4,
  Box3,
  Group,
  Material,
  Xfo,
  Points,
  Lines,
  Ray,
  Sphere,
  Plane,
  Cone,
  Cuboid,
  Cylinder,
  Torus,
  Label,
  BillboardItem
} = window.zeaEngine


// const {
//   labelFontColor,
//   outlineColor
// } = window.zeaEngine

const { GLCADPass, CADAsset } = window.zeaCad;

console.clear()


//Setup Scene -----------------------------------
const canvas = document.getElementById('renderer')
const scene = new Scene()
scene.setupGrid(10, 10)

// const renderer = new GLRenderer(canvas)
const renderer = new GLRenderer(canvas, {
  webglOptions: {
    antialias: true,
    canvasPosition: "relative"
  }
});
renderer.setScene(scene)
renderer.resumeDrawing()

// ///alternate change color
scene
  .getSettings()
  .getParameter('BackgroundColor')
  .setValue(new Color('#33B3FF'))

// setup  -----------------------------
//
// inside browser is DOM tree structure of elelments
// Document -> scene
//
// div space for items to live, tree is same concept. position child elements
// div -> TreeItem
//
// Image/text -> GeomItem
//
// HTML -> json/ asset file
//
// 4 main elements
// 1 geometry
// 2 transform
// 3 shader
// 4 material
//

const treeItem = new TreeItem('treeItem')
scene.getRoot().addChild(treeItem)

/// Camera setup -----------------------------------
renderer
  .getViewport()
  .getCamera()
  .setPositionAndTarget(new Vec3(10, 10, 5), new Vec3(0, 0, 3))



// Selection setup ---------------------------------

// const group1 = new Group('group1');
// group1.getParameter('HighlightColor').setValue(new Color('lemonchiffon'));
// scene.getRoot().addChild(group1);

// const group2 = new Group('group2');
// group2.getParameter('HighlightColor').setValue(new Color('mediumblue'));
// scene.getRoot().addChild(group2);

// const standardMaterial = new Material('surfaces', 'SimpleSurfaceShader');
// standardMaterial.getParameter('BaseColor').setValue(new Color(89 / 255, 182 / 255, 92 / 255));

// const addGeomItem = (shape, row, count, i)=>{
//   const geomItem = new GeomItem('Item'+row+'-'+i, shape, standardMaterial);
//   geomItem.setLocalXfo(new Xfo(new Vec3(i * 3, row * 3, 0)));
//   treeItem.addChild(geomItem);

//   group1.addItem(geomItem);
//   if(i%2 == 0)
//     group2.addItem(geomItem);
// }
// const addMeshShape = (shape, row, count)=>{
//   for(let i=0; i<count; i++){
//     addGeomItem(shape, row, count, i);
//   }
// }

// addMeshShape(new Sphere(1.4, 13), 3, 1);
// addMeshShape(new Sphere(1.4, 13), 2, 3);
// addMeshShape(new Plane(2.0, 1.5), 1.4, 4);
// addMeshShape(new Cuboid(1.5, 2.0, 1.0), 0.5, 6);
// addMeshShape(new Cone(1.2, 4.0), -1, 5);
// addMeshShape(new Cylinder(1.2, 4.0, 32, 2, true), -2, 8);
// addMeshShape(new Torus(0.4, 1.3), -3, 4);

// setInterval(function(){
//   treeItem.setSelected(!treeItem.getSelected());
// }, 1200);
// setInterval(function(){
//   const p = group1.getParameter('Highlighted');
//   p.setValue(!p.getValue());
// }, 1000);
// setInterval(function(){
//   const p = group2.getParameter('Highlighted');
//   p.setValue(!p.getValue());
// }, 700);

// Labels -----------------------------------------------

// const asset = new TreeItem("labels");

// let index = 0;
// const addLabel = (lineEndPos, pos, color, name) => {
//   const label = new Label(name, "Labels");
//   label.getParameter("FontSize").setValue(48);
//   label.getParameter("FontColor").setValue(color);
//   label
//     .getParameter("BackgroundColor")
//     .setValue(new Color(0.3, 0.3, 0.3));

//   const billboard = new BillboardItem("billboard" + index, label);
//   const xfo = new Xfo(pos);
//   billboard.setLocalXfo(xfo);
//   billboard.getParameter("PixelsPerMeter").setValue(300);
//   billboard.getParameter("AlignedToCamera").setValue(true);
//   billboard.getParameter("Alpha").setValue(1);

//   asset.addChild(billboard);

//   index++;
// };
// addLabel(
//   new Vec3(1, 0, 0),
//   new Vec3(1, 1, 1),
//   new Color(0, 1, 0),
//   "Hello"
// );
// addLabel(
//   new Vec3(-1, 0, 0),
//   new Vec3(-1, -1, 1),
//   new Color(1, 1, 0),
//   "Long"
// );
// addLabel(
//   new Vec3(0, 0, 0),
//   new Vec3(0, 0.05, 0.08),
//   new Color(1, 1, 0),
//   "MyCustomLabel"
// );

// scene.getRoot().addChild(asset);



// Construct Point -----------------------------------------------

const assetPoints = new TreeItem('Points')
scene.getRoot().addChild(assetPoints)


const creatPoints = (name, x, y, z) => {
  const sphere = new Sphere(0.05)
  const material = new Material('myMat', 'SimpleSurfaceShader')
  material.getParameter('BaseColor').setValue(new Color(1, 0, 0))

  const getCoordSysConversionXfo = srcCoordSys => {
    const coordSysConversion = new Xfo()
    switch (srcCoordSys) {
      case 'LHS':
        coordSysConversion.ori.setFromAxisAndAngle(
          new Vec3(0, 0, 1),
          Math.PI * 0.5
        )
        coordSysConversion.sc.set(1, -1, 1)
        break
      case 'RHS':
        break
    }
    return coordSysConversion
  }

  const coordSysConversion = getCoordSysConversionXfo('LHS')

  const createPoint = (index, pos) => {
    const geomItem = new GeomItem('point-' + index)
    geomItem.getParameter('Geometry').setValue(sphere)
    geomItem.getParameter('Material').setValue(material)
    const xfo = new Xfo()
    xfo.tr = pos
    geomItem.getParameter('GlobalXfo').setValue(xfo)

    assetPoints.addChild(geomItem);
  }

  const pos = new Vec3(x, y, z)
  createPoint(name, coordSysConversion.transformVec3(pos))
}

//creatPoints('test', 1, 1, 1)
//creatPoints('test2', 2, 2, 2)

const point1 = new Vec3(1,2,1)
const point2 = new Vec3(5,5,5)
//console.log(point1)

const pointList = [point1, point2]
console.log(pointList)


const dimLine = new Lines(pointList)

const material = new Material('myMat', 'SimpleSurfaceShader')
material.getParameter('BaseColor').setValue(new Color(1, 0, 0))


// Construct Line -----------------------------------------------

const numVertices = 2
dimLine.setNumVertices(numVertices)
dimLine.setNumSegments(1)
dimLine.setSegmentVertexIndices(0, 0, 1)
dimLine.getVertexAttribute('positions').getValueRef(0).setFromOther(point1)
dimLine.getVertexAttribute('positions').getValueRef(1).setFromOther(point2)




console.log(dimLine)

const geomItem1 = new GeomItem('line-')
geomItem1.getParameter('Geometry').setValue(dimLine)
geomItem1.getParameter('Material').setValue(material)



console.log(geomItem1)
assetPoints.addChild(geomItem1);

// Construct Line  -----------------------------------------------




///////////////////////////////////////////
// Load CAD File.

let url =
  // "https://cdn.glitch.com/193338d7-ba53-46cc-8930-c8d69b1c0a34%2F190153_ZSK_MockUpB_Steel-Anchors.zcad?v=1606232103341";
  // "https://cdn.glitch.com/193338d7-ba53-46cc-8930-c8d69b1c0a34%2F190153_ZSK_MockUpB_Steel-Anchors.zcad?v=1606232103341";
  // "https://cdn.glitch.com/193338d7-ba53-46cc-8930-c8d69b1c0a34%2F190153_ZSK_MockUpB_Steel-Anchors.zcad?v=1606326011240";
  "https://cdn.glitch.com/193338d7-ba53-46cc-8930-c8d69b1c0a34%2F190153_ZSK_MockUpB_Steel-Anchors-M.zcad?v=1606784072811";
const cadAsset = new CADAsset();
cadAsset.getParameter("DataFilePath").setValue(url);
scene.getRoot().addChild(cadAsset);
console.log(cadAsset);
// sceneTreeView.rootItem = cadAsset

// const logTreeItem = (treeItem, depth) => {
//   //console.log(" ".repeat(depth * 2) + "|-" + treeItem.getName());
//   for (let i = 0; i < treeItem.getNumChildren(); i++) {
//     if (treeItem.hasParameter("CustomMatrix")) {
//       const matrix = treeItem.getParameter("CustomMatrix").getValue();
//       console.log(matrix)
//     }
    // console.log(treeItem.getChild(i))
    // logTreeItem(treeItem.getChild(i), depth + 1);
//   }
// };

// cadAsset.on("loaded", () => {
//   logTreeItem(cadAsset, 0);
// });

///////////////////////////////////////////

// Collab
///////////////////////////////////////////
// Collab
// const { Session, SessionSync } = window.zeaCollab;

const appData = {
  renderer,
  scene
};

const getRandomString = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);

const userData = {
  family_name: getRandomString(),
  given_name: getRandomString(),
  id: getRandomString()
};

const socketUrl = "https://websocket-staging.zea.live";
const session = new Session(userData, socketUrl);
session.joinRoom("dfghjkl");

session.sub("user-joined", user => {
  // console.log("User joined:", user);
});

session.sub("user-left", user => {
  // console.log("User left");
});

session.sub("userPressedAKey", data => {
  console.log("userPressedAKey:", data);
});

document.addEventListener("keydown", event => {
  console.log("key down", event.key);

  session.pub("userPressedAKey", {
    key: event.key,

    time: 43
  });
});

const sessionSync = new SessionSync(session, appData, userData);

const userChipSet = document.getElementById("zea-user-chip-set");
userChipSet.session = session;

const userChip = document.getElementById("zea-user-chip");
userChip.userData = userData;

////////////////////////////////////////
// Setup the tree view

const sceneTreeView = document.getElementById("zea-tree-view");
sceneTreeView.appData = appData;
sceneTreeView.rootItem = scene.getRoot();



///////- ACCESS ATTRIBUTES ------------------------------------------------------\




///////- create matrix ------------------------------------------------------\




///////- Project Point ------------------------------------------------------\

// const projPoint = (plane, anchPointName, srvyPointName) => {
  
//   const origin = assetPoints.getChildByName('point-' + anchPointName)
//   const srvyPoint = assetPoints.getChildByName('point-' + srvyPointName)
  
//   // console.log(plane, origin, srvyPoint)
//   console.log(origin)
//   // console.log(origin.getParameter("X"), srvyPoint)
  
//   const x = origin.x - srvyPoint.x;
//   const y = origin.y - srvyPoint.y;
//   const z = origin.z - srvyPoint.z;
//   console.log(x,y,z);
//   const compVect = new Vec3(x,y,z);
  
//   console.log(compVect)
//   console.log(plane.zAxis)
//   const dot = plane.zAxis.dot(compVect);
//   console.log(dot)
  
//   const deltaVect = dot * plane.zAxis * -1
  
//   console.log( deltaVect)
//   console.log(srvyPoint )
//   // const dx = srvyPoint.x - deltaVect.x;
//   // const dy = srvyPoint.y - deltaVect.y;
//   // const dz = srvyPoint.z - deltaVect.z;
  
//   // console.log(dx,dy,dz)
//   // const projPoint = creatPoints('projPt', dx, dy, dz)
  
// }

///////- get atttribute ------------------------------------------------------\
//it would be greate to populate a list of anchors to choose from----------/

const billboards = new TreeItem('billboard')
scene.getRoot().addChild(billboards)

cadAsset.on('loaded', () => {
  // console.log(cadAsset.getName())
  // console.log(cadAsset.getNumChildren())
  const ZanchorPlane = JSON.parse(cadAsset.getChildByName("MB-PA2-09").getParameter("OriginPlane").getValue());
  
  var typedArr = new Float32Array(ZanchorPlane);
  
  const planeMat4 = new Mat4(typedArr)
  console.log(planeMat4)
  
  
  //creatPoints('test3', 0, .25, 3)
  // console.log(plane.__data[3])//, plane[7], plane[11])
  // console.log(plane)//, plane[7], plane[11])
  // console.log("Pane ", plane['m03'], plane['m13'], plane['m23'])
  // const point1 = new Vec3(1,2,1)
  // console.log(point1)
  
  creatPoints('anchPt', (planeMat4['m03']), (planeMat4['m13']), (planeMat4['m23']))
  creatPoints('survPt', 0, .1, 2.5)
  //could i return these points?
  // creatPoints('survPt', plane['m03'], plane['m13'], plane['m23']) GlobalXfo
  
  const surveyPoint = assetPoints.getChildByName('point-survPt').getParameter('GlobalXfo').getValue().tr
  const anchPoint = assetPoints.getChildByName('point-anchPt').getParameter('GlobalXfo').getValue().tr
  
  // console.log(surveyPoint)
  
  // projPoint(plane,"anchPt","survPt")
  
  
  ////////////////////////////////
  // Display the error as a line.
  // Note: there is scaling in the CADAsset hierarchy
  // as part of the units conversion from inches to meters.
  // markerXfo.sc.set(1, 1, 1)
  
  const deviation = planeMat4.inverse().transformVec3(surveyPoint)
  console.log(deviation - anchPoint)
  // const pointInPlaneSpace = plane.transformVec3(surveyPoint)
  
  // console.log(assetPoints.getChildByName('point-survPt'))
  // console.log(plane)
  //point1
  const errorLinesMaterial = new Material('myMat', 'SimpleSurfaceShader')
  // const pixelsPerMeter = this.config.getParameter('Label Size').getValue()
  const pixelsPerMeter = 300
  
  
  
  const markerXfo = assetPoints.getChildByName('point-anchPt').getParameter('GlobalXfo').getValue().clone()
  
  const errorline = new Lines()
  errorline.setNumVertices(4)
  errorline.setNumSegments(3)
  errorline.setSegmentVertexIndices(0, 0, 1)
  errorline.setSegmentVertexIndices(1, 1, 2)
  errorline.setSegmentVertexIndices(2, 2, 3)

  
  const positions = errorline.getVertexAttribute('positions')
  positions.getValueRef(0).setFromOther(new Vec3(0, 0, 0))
  // positions.getValueRef(0).setFromOther(new Vec3(anchPoint))
  positions.getValueRef(1).setFromOther(new Vec3(deviation.x, 0, 0))
  positions.getValueRef(2).setFromOther(new Vec3(deviation.x, deviation.y, 0))
  positions.getValueRef(3).setFromOther(new Vec3(deviation.x, deviation.y, deviation.z))
  

  const errorlineItem = new GeomItem('ErrorLine', errorline, errorLinesMaterial)
  
  markerXfo.fromMat4(planeMat4)
  
  
  // console.log(markerXfo)
  // console.log(errorlineItem.getParameter('GlobalXfo'))
  errorlineItem.getParameter('GlobalXfo').setValue(markerXfo)
  errorlineItem.setOverlay(true)
  
  
  
  scene.getRoot().addChild(errorlineItem, true);
  
  ////////////////////////////////
  // Display the deviation.

  const labelOffset = new Vec3(0.0, 0.0, -150 / pixelsPerMeter)
  
  // Note: negate the x value to convert to a left handed
  // coordinate system.
  // const disp = invcoordSpaceXfo.transformVec3(deviation);
  const disp = deviation
  // const threshold = this.config.getParameter('Error Tolerance').getValue()
  const threshold = .0254*.25
  
  let exceedsThreshold = false
  disp.asArray().forEach((val) => (exceedsThreshold |= Math.abs(val) > threshold))

  const color = new Color(1, 2, 0);
  const precision = 5
  const valsStrings = []
  disp.asArray().forEach((val) => valsStrings.push(val.toFixed(precision)))
  const text = `X: ${valsStrings[0]}\nY: ${valsStrings[1]}\nZ: ${valsStrings[2]}`
  const fontcolor = new Color(1, 0, 0);
  const outlineColor = new Color(1, 1, 1);
  
  const labelImage = new Label('test survey' + 'Error')
  labelImage.getParameter('Text').setValue(text)
  labelImage.getParameter('FontSize').setValue(24)
  // labelImage.getParameter('FontColor').setValue(labelFontColor)
  labelImage.getParameter('FontColor').setValue(fontcolor)
  labelImage.getParameter('BackgroundColor').setValue(color)
  labelImage.getParameter('OutlineColor').setValue(outlineColor)
  labelImage.getParameter('BorderWidth').setValue(3)
  labelImage.getParameter('Margin').setValue(6)

  const billboard = new BillboardItem('ErrorBillboard', labelImage)
  // billboard.getParameter('LocalXfo').setValue(new Xfo(labelOffset))
  billboard.getParameter('LocalXfo').setValue(markerXfo)
  billboard.getParameter('PixelsPerMeter').setValue(pixelsPerMeter)
  billboard.getParameter('AlignedToCamera').setValue(true)
  billboard.getParameter('DrawOnTop').setValue(true)
  billboard.getParameter('Alpha').setValue(1.0)

  
  
  // billboards.getChildByName('billboard').addChild(billboard, false)
  scene.getRoot().addChild(billboard)
  
})
// scene.getRoot().addChild(cadAsset)