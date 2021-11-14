//import * as THREE from './node_modules/three/build/three.module.js'
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
//import {OrbitControls} from './three/examples/jsm/controls/OrbitControls.js'
//import {GLTFLoader} from './node_modules/three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';

//import { LoadingManager } from 'three';


function main(){
    const canvas = document.querySelector("#root");
    let keyboard = {};
    let player = {height:1.8, speed:0.02};
    let particles = [];
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    const renderer = new THREE.WebGLRenderer({canvas});
    //Activate shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement );
    
    
    //Set up camera
    const fov = 75;
    const aspect = window.innerWidth/window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,1920/1080,near,far);
    camera.position.set(0,player.height,10);

    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'music/ambient.webm', function( buffer ) {
	  sound.setBuffer( buffer );
	  sound.setLoop( true );
	  sound.setVolume( 0.5 );
	  sound.play();
    });


    //camera.position.z = 100
    camera.lookAt(new THREE.Vector3(0,player.height,0)); 
    console.log(aspect);
    //camera.position.set(0,1.8,-5);
    // camera.lookAt(new THREE.Vector3(0,0,0));
    //const controls = new OrbitControls( camera, renderer.domElement );
    //controls.update();
   
    //Add orbit controls for better view
    const controls = new OrbitControls(camera, renderer.domElement);

    //Create scene
    const scene = new THREE.Scene();

   scene.background = new THREE.CubeTextureLoader()
   .load([
    'img/posx.jpg',
    'img/negx.jpg',
    'img/posy.jpg',
    'img/negy.jpg',
    'img/posz.jpg',
    'img/negz.jpg',
   ])

    //Add Fog
    
    //scene.fog = new THREE.FogExp2(color, 0.06);
    //scene.background = new THREE.Color(color);

    //Add backgorund color
    //scene.background = new THREE.Color('#F00');  // red

    //Add directionan light
    // const light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
    // light.position.set( 0, 1, 0 ); //default; light shining from top
    // light.castShadow = true; // default false
    // scene.add( light );

    //Add light
    //const ambient = new THREE.AmbientLight(0x242326);
    const ambient = new THREE.AmbientLight(0xffffff,0.2);

    scene.add(ambient);

    //New Point Light
    let light = new THREE.PointLight(0xffffff,0.8,18);
    light.position.set(-6,10,-0);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);
    //Add flash
    let flash = new THREE.PointLight(0x06d89,30,500,1.7);
    flash.position.set(200,300,100);
   // scene.add(flash);

    //Moonlight
    // const directionalLight = new THREE.DirectionalLight('yellow');
    // directionalLight.position.set(0,0,2);
    // scene.add(directionalLight);

    //Add some fog
    //scene.fog = new THREE.Fog(0xDFE9F3, 0.0, 500.0);

    //Loading slender man
    let slender = new GLTFLoader();
    let obj;
    slender.load('scene.gltf', function (gltf){
      obj = gltf.scene;
      obj.scale.set(0.0030,0.0030,0.0030);
      console.log(obj.scale)
     
       scene.add(gltf.scene);
    })
    
  //Modelos loading
  let models = {
    tree: {
      obj: 'mod/tree.obj',
      mtl: 'mod/tree.mtl',
      mesh: null
    },
    rock: {
      obj: 'mod/rockC.obj',
      mtl: 'mod/rockC.mtl',
      mesh: null
    },
    fall: {
      obj: 'mod/treeFall.obj',
      mtl: 'mod/treeFall.mtl',
      mesh: null
    }
     
  }

  let meshes = {}

  //Load tree models
 async function loadModels(){
   return new Promise((resolve) => {
             let mtlLoader =  new MTLLoader();
            mtlLoader.load(models["tree"].mtl, (materials) => {
                 materials.preload();
                let objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(models["tree"].obj, (mesh) => {
                 (models["tree"].mesh = mesh);
                 mesh.traverse((node) => {
                  if (node.type === "Mesh"){
                    node.castShadow = true;
                    node.receiveShadow = true;
                  }
                })
                 resolve(models);
                })
            });
      console.log(models);
   })
 }

 //Load rock models
 async function loadRocksModel(){
  return new Promise((resolve) => {
            let mtlLoader =  new MTLLoader();
           mtlLoader.load(models["rock"].mtl, (materials) => {
                materials.preload();
               let objLoader = new OBJLoader();
               objLoader.setMaterials(materials);
               objLoader.load(models["rock"].obj, (mesh) => {
                (models["rock"].mesh = mesh);
                mesh.traverse((node) => {
                  if (node.type === "Mesh"){
                    node.castShadow = true;
                    node.receiveShadow = true;
                  }
                })
                resolve(models);
               })
           });
     console.log(models);
  })
}



//Load fall trees
async function loadFallsModel(){
  return new Promise((resolve) => {
            let mtlLoader =  new MTLLoader();
           mtlLoader.load(models["fall"].mtl, (materials) => {
                materials.preload();
               let objLoader = new OBJLoader();
               objLoader.setMaterials(materials);
               objLoader.load(models["fall"].obj, (mesh) => {
               
                (models["fall"].mesh = mesh);
                mesh.traverse((node) => {
                  if (node.type === "Mesh"){
                    node.castShadow = true;
                    node.receiveShadow = true;
                  }
                })
                //console.log(models);
                resolve(models);
               })
           });
     console.log(models);
  })
}

  async function onResourcesLoaded(){
    //meshes["tree1"] = models.tree.mesh.clone();
    //meshes["tree2"] = models.tree.mesh.clone();
    //scene.add(meshes["tree1"]);
    const trees = await loadModels();
    const rocks = await loadRocksModel();
    const falls = await loadFallsModel();
    
    //console.log(trees);
    console.log(falls);
    //Mesh objects
    meshes["tree1"] = trees.tree.mesh.clone();
    meshes["tree2"] = trees.tree.mesh.clone();
    meshes["rock1"] = rocks.rock.mesh.clone();
    meshes["rock2"] = rocks.rock.mesh.clone();
    meshes["rock3"] = rocks.rock.mesh.clone();
    meshes["fall1"] = falls.fall.mesh.clone();
    meshes["fall2"] = falls.fall.mesh.clone();
    meshes["fall3"] = falls.fall.mesh.clone();
    meshes["fall4"] = falls.fall.mesh.clone();
    //meshes["rock1"] = models2.rock.mesh.clone();

    //Positions of trees
    meshes["tree1"].position.set(-6,0,4);
    meshes["tree2"].position.set(-8,0,1);

    //Positions of fall trees
    meshes["fall1"].position.set(6,0,4);
    meshes["fall2"].position.set(8,0,1);
    meshes["fall3"].position.set(6,0,-2);
    meshes["fall4"].position.set(8,0,-5);



    //Positions of rocks
    meshes["rock1"].position.set(-9,0,-6.5);
    meshes["rock2"].position.set(9,0,-6.5);
    meshes["rock3"].position.set(-9,0,6.5);
    //meshes["rock1"].position.set(-4,0,4);

    //Add models to the scene
    scene.add(meshes["tree1"]);
    scene.add(meshes["tree2"]);
    scene.add(meshes["rock1"]);
    scene.add(meshes["rock2"]);
    scene.add(meshes["rock3"]);
    scene.add(meshes["fall1"]);
    scene.add(meshes["fall2"]);
    scene.add(meshes["fall3"]);
    scene.add(meshes["fall4"]);
    
    
  }
  onResourcesLoaded();

  //Added model
    let mtlLoader = new MTLLoader();
    mtlLoader.load('mod/tree.mtl', (materials) => {
      materials.preload();
      let objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('mod/tree.obj', function(mesh){
        mesh.traverse(function(node){
          if (node.type === "Mesh"){
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        scene.add(mesh);
        mesh.position.set(-3,0,-2);
      }
      )
    })
    
   
    
    //Create floor
    let texture = new THREE.TextureLoader().load('img/floor.jpg')
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    const meshFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(20,15,10,10),
      new THREE.MeshPhongMaterial({map:texture, wireframe:false})
    );
    meshFloor.rotation.x = - Math.PI / 2; //90 degrees
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);
   


    //House container
     const house = new THREE.Group()
     scene.add(house)

     //Create house 
     let wallTexture = new THREE.TextureLoader().load('img/wall.jpg');
     //wallTexture.wrapS = THREE.RepeatWrapping;
    // wallTexture.wrapT = THREE.RepeatWrapping;
     //wallTexture.repeat.set(4, 4);
     const walls = new THREE.Mesh(
     new THREE.BoxBufferGeometry(4, 2.5, 4),
     new THREE.MeshPhongMaterial({ color: 0xffffff,map:wallTexture})
   )
   walls.position.y = 1.25
   //walls.castShadow = true;
   //walls.receiveShadow = true;
   house.add(walls)

  // Roof
  let roofTexture = new THREE.TextureLoader().load('img/roofCabin.jpg')
  const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshPhongMaterial({ color: '#b35f45', map: roofTexture })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
//roof.castShadow = true;
roof.receiveShadow = true;
house.add(roof)

// Door
let test = new THREE.TextureLoader().load('img/negx.png')
let doorTexture = new THREE.TextureLoader().load('img/door.jpg');
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2),
  new THREE.MeshPhongMaterial({ color: '#aa7b7b', map:doorTexture })
)
door.position.y = 0.9
door.position.z = 2 + 0.01
door.castShadow = true;
door.receiveShadow = true;
house.add(door)

//Window
let glassTexture = new THREE.TextureLoader().load('img/glass.png')
const glass = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5,1.5),
  new THREE.MeshPhongMaterial({color: '#aa7b7b', map: glassTexture})
)

//window.position.z = 3
glass.rotation.y += Math.PI / 2
glass.position.x = 2.05
glass.position.z= 0;
glass.position.y = 1.5;
glass.castShadow = true;
glass.receiveShadow = true;
house.add(glass);

// Graves
const graves = new THREE.Group()
scene.add(graves)

let stoneTexture = new THREE.TextureLoader().load('img/stone.png')
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshPhongMaterial({  map: stoneTexture })

for(let i = 0; i < 50; i++)
{
    const angle = Math.random() * Math.PI * 2 
    const radius = 3 + Math.random() * 6      
    const x = Math.cos(angle) * radius        
    const z = Math.sin(angle) * radius        

    // Create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.castShadow = true;
    grave.receiveShadow = true;
    

    // Position
    grave.position.set(x, 0.3, z)                              

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4

    // Add to the graves container
    //console.log(`x value is ${x}`);
    //console.log(`z values is ${z}`)
    if (x > 10 || x < -10 || z > 7.5 || z < -7.5){
      //Dont add gravee
    } else {
      graves.add(grave)
    }
   
}
//Cloud 
let loader = new THREE.TextureLoader();
loader.load('img/cloud.jpg', (texture) => {
  const cloudGeo = new THREE.PlaneBufferGeometry(400,400);
  const cloudMaterial = new THREE.MeshLambertMaterial({
    map: texture,
    fog:false,
    transparent:true
    
    
    
  })
  for (let i=0; i < 25; i++){
    let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
    cloud.position.set(
      Math.random() * 800 -400,
      300,
      Math.random() * 500 - 400
    );
    cloud.rotation.x = 1.16;
    cloud.rotation.y = -0.12;
    cloud.rotation.z = Math.random() * 360;
    cloud.material.opacity = 0.6;
    particles.push(cloud);
    scene.add(cloud);
  }
})


//Rain 
let rain;
const vertex = new THREE.Vector3();
const rainSprite = new THREE.TextureLoader().load('img/disc.png');
const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < 10000; i++) {
    vertices.push(
        Math.random() * 20 - 10,
        Math.random() * 30,
        Math.random() * 20 - 10
    );
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02,
    
    transparent: true
});

rain = new THREE.Points(geometry, material);
//scene.add(rain);

// hace la animacion de la lluvia cayendo.
function rainVelocity() {

  var positionAttribute = rain.geometry.getAttribute('position');

  for (var i = 0; i < positionAttribute.count; i++) {

      vertex.fromBufferAttribute(positionAttribute, i);
      
      vertex.y -= 0.05;

      if (vertex.x >= -4 && vertex.x <= 4 && vertex.z >= -4 && vertex.z <= 4) {
          if (vertex.y < 6) {
              vertex.y = 10;
          }
      }


      if (vertex.y < 0) {
          vertex.y = 10;
      }

      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);

  }

  positionAttribute.needsUpdate = true;

}
    //Create geometry
    // const boxWidth = 1;
    // const boxHeight = 1;
    // const boxDepth = 1;
    // const geometry = new THREE.BoxGeometry(boxWidth,boxHeight,boxDepth);

    // //Create material
    // const material = new THREE.MeshBasicMaterial({color: 0x44aa88});

    // //Create mesh
    // const cube = new THREE.Mesh(geometry,material);

    //Add mesh to the scene
   // scene.add(cube);

    // function render(time) {
    //     time *= 0.001;  // convert time to seconds
    
    //     cube.rotation.x = time;
    //     cube.rotation.y = time;
    
    //     renderer.render(scene, camera);
    
    //     requestAnimationFrame(render);
    //   }
    //   requestAnimationFrame(render);
    
    //Renderer
    
    //animate();
    //renderer.render(scene, camera);
    //scene.fog = new THREE.FogExp2(0xDFE9F3,0.0000005);
    function keyDown(event){
      keyboard[event.keyCode] = true;
    }

    function keyUp(event){
      keyboard[event.keyCode] = false
    }
    function animate() {
      requestAnimationFrame( animate );

      //Animate clouds
      console.log("clouds");
      particles.forEach((p) => {
        p.rotation.z += 0.002;
      })

      //Flash animation
      if(Math.random() > 0 || flash.power > 100){
        //console.log("Luz");
        if (flash.power < 100){
          flash.position.set(
            Math.random() * 400,
            300 + Math.random() * 200,
            100
          )
        };
        flash.power = 50 + Math.random() * 1000;
      }
      if(keyboard[87]){ // W key
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
      }
      if(keyboard[83]){ // S key
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
      }
      if(keyboard[65]){ // A key
        // Redirect motion by 90 degrees
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
      }
      if(keyboard[68]){ // D key
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
      }
      if(keyboard[37]){
        console.log("");
        camera.rotation.y -= Math.PI * 0.11;
      }
      if(keyboard[39]){
        camera.rotation.y += Math.PI * 0.01;
      }
    
     // // required if controls.enableDamping or controls.autoRotate are set to true
      //controls.update();
     // main()
     //rainVelocity();
      renderer.render( scene, camera );
      //controls.update();
    }
    animate();
   
}

main();


