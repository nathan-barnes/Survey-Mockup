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
  const sphere = new Sphere(0.5)
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

creatPoints('test', 1, 1, 1)
creatPoints('test2', 2, 2, 2)

const point1 = new Vec3(1,2,1)
const point2 = new Vec3(5,5,5)
//console.log(point1)

const pointList = [point1, point2]
console.log(pointList)


const dimLine = new Lines(pointList)

const material = new Material('myMat', 'SimpleSurfaceShader')
material.getParameter('BaseColor').setValue(new Color(1, 0, 0))




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
  "https://cdn.glitch.com/193338d7-ba53-46cc-8930-c8d69b1c0a34%2F190153_ZSK_MockUpB_Steel-Anchors.zcad?v=1606326011240";
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
  console.log("User joined:", user);
});

session.sub("user-left", user => {
  console.log("User left");
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




///////- get atttribute ------------------------------------------------------\
//it would be greate to populate a list of anchors to choose from----------/

cadAsset.on('loaded', () => {
  // console.log(cadAsset.getName())
  // console.log(cadAsset.getNumChildren())
  const ZanchorPlane = JSON.parse(cadAsset.getChildByName("MB-PA2-09").getParameter("OriginPlane").getValue());
  
  var typedArr = new Float32Array(ZanchorPlane);
  
  const plane = new Mat4(typedArr)
  
  creatPoints('test3', 0, .25, 3)
  // console.log(plane.__data[3])//, plane[7], plane[11])
  // console.log(plane['m03'])//, plane[7], plane[11])
  creatPoints('survPt', plane['m03']*0.0254, plane['m13']*0.0254, plane['m23']*0.0254)
  
  console.log(assetPoints.getChildByName('point-survPt'))
  console.log(plane)
  //point1
  
  
})
