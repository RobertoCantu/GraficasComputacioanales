import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';


function main(){
    const canvas = document.querySelector("#root");
    let keyboard = {};
    let player = {height:1.8, speed:0.02}; //For first person view
    let particles = [];
    let maxRight = false; //For controlling easter egg animation
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
    audioLoader.load( 'music/Rain.ogg', function( buffer ) {
	  sound.setBuffer( buffer );
	  sound.setLoop( true );
	  sound.setVolume( 0.5 );
	  sound.play();
    });

    camera.lookAt(new THREE.Vector3(0,player.height,0)); 
    //Add orbit controls for better view
    const controls = new OrbitControls(camera, renderer.domElement);

    //Create scene
    const scene = new THREE.Scene();

  //  scene.background = new THREE.CubeTextureLoader()
  //  .load([
  //   'img/posx.jpg',
  //   'img/negx.jpg',
  //   'img/posy.jpg',
  //   'img/negy.jpg',
  //   'img/posz.jpg',
  //   'img/negz.jpg',
  //  ])

    const ambient = new THREE.AmbientLight(0xffffff,0.2);

    scene.add(ambient);

    //Left lamp light
    let lampLight = new THREE.PointLight(0xffffff,0.8,4);
    lampLight.position.set(-2,1.5,2.7);
    lampLight.castShadow = true;
    lampLight.shadow.camera.near = 0.1;
    lampLight.shadow.camera.far = 25;
    scene.add(lampLight);

    //Right lamp light
    let lampLightRight = new THREE.PointLight(0xffffff,0.8,4);
    lampLightRight.position.set(2,1.5,2.7);
    lampLightRight.castShadow = true;
    lampLightRight.shadow.camera.near = 0.1;
    lampLightRight.shadow.camera.far = 25;
    scene.add(lampLightRight);

    //Add flash
    let flash = new THREE.PointLight(0x06d89,30,500,2);
    flash.position.set(100,250,100);
    flash.castShadow = true;
    flash.shadow.camera.near = 0.1;
    flash.shadow.camera.far = 500;
    scene.add(flash);

    //Loading slender man
    let slender = new GLTFLoader();
    let obj;
    slender.load('scene.gltf', function (gltf){
    obj = gltf.scene;
    obj.scale.set(0.0030,0.0030,0.0030);
    //obj.rotation.y += Math.PI /2;
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
    },
    lightPost: {
      obj: 'mod/lightpostSingle.obj',
      mtl: 'mod/lightpostSingle.mtl',
      mesh: null
    },
    dirt: {
      obj: 'mod/shovelDirt.obj',
      mtl: 'mod/shovelDirt.mtl',
      mesh: null
    },
    fenceBorder: {
      obj: 'mod/ironFenceBorder.obj',
      mtl: 'mod/ironFenceBorder.mtl',
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
                resolve(models);
               })
           });
  })
}

//Load light post
async function loadLightPost(){
  return new Promise((resolve) => {
            let mtlLoader =  new MTLLoader();
           mtlLoader.load(models["lightPost"].mtl, (materials) => {
                materials.preload();
               let objLoader = new OBJLoader();
               objLoader.setMaterials(materials);
               objLoader.load(models["lightPost"].obj, (mesh) => {
               
                (models["lightPost"].mesh = mesh);
                mesh.traverse((node) => {
                  if (node.type === "Mesh"){
                    node.castShadow = true;
                    node.receiveShadow = false;
                  }
                })
                resolve(models);
               })
           });
  })
}

//Light dirt
async function loadDirt(){
  return new Promise((resolve) => {
            let mtlLoader =  new MTLLoader();
           mtlLoader.load(models["dirt"].mtl, (materials) => {
                materials.preload();
               let objLoader = new OBJLoader();
               objLoader.setMaterials(materials);
               objLoader.load(models["dirt"].obj, (mesh) => {
               
                (models["dirt"].mesh = mesh);
                mesh.traverse((node) => {
                  if (node.type === "Mesh"){
                    node.castShadow = true;
                    node.receiveShadow = true;
                  }
                })
                resolve(models);
               })
           });
  })
}

//Load fence border
async function loadFenceBorder(){
  return new Promise((resolve) => {
            let mtlLoader =  new MTLLoader();
           mtlLoader.load(models["fenceBorder"].mtl, (materials) => {
                materials.preload();
               let objLoader = new OBJLoader();
               objLoader.setMaterials(materials);
               objLoader.load(models["fenceBorder"].obj, (mesh) => {
               
                (models["fenceBorder"].mesh = mesh);
                mesh.traverse((node) => {
                  if (node.type === "Mesh"){
                    node.castShadow = true;
                    node.receiveShadow = true;
                  }
                })
                resolve(models);
               })
           });
  })
}



  async function onResourcesLoaded(){
    const trees = await loadModels();
    const rocks = await loadRocksModel();
    const falls = await loadFallsModel();
    const lightPost = await loadLightPost();
    const dirt = await loadDirt();
    const fenceBorder = await loadFenceBorder();

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
    meshes["lightPost"] = lightPost.lightPost.mesh.clone();
    meshes["lightPost2"] = lightPost.lightPost.mesh.clone();
    meshes["dirt"] = dirt.dirt.mesh.clone();
    meshes["dirt2"] = dirt.dirt.mesh.clone();
    meshes["dirt3"] = dirt.dirt.mesh.clone();
    meshes["fenceBorder"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder2"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder3"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder4"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder5"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder6"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder7"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder8"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder9"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder10"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder11"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder12"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder13"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder14"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder15"] = fenceBorder.fenceBorder.mesh.clone();

    meshes["fenceBorder16"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder17"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder18"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder19"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder20"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder21"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder22"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder23"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder24"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder25"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder26"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder27"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder28"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder29"] = fenceBorder.fenceBorder.mesh.clone();
    meshes["fenceBorder30"] = fenceBorder.fenceBorder.mesh.clone();

    for (let i=31; i < 51; i ++){
      meshes[`fenceBorder${i}`] = fenceBorder.fenceBorder.mesh.clone();
    }

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
    meshes["rock2"].position.set(9.3,0,-6.7);
    meshes["rock3"].position.set(-9,0,6.5);
    //meshes["rock1"].position.set(-4,0,4);

    //Position of light posts
    meshes["lightPost"].position.set(-2,0,2);
    meshes["lightPost2"].position.set(2,0,2);

    //Posiiton of dirt
    meshes["dirt"].position.set(-6,0,2);
    meshes["dirt2"].position.set(6,0,-4);
    meshes["dirt3"].position.set(2,0,5);

    //Position of left fence borders
    meshes["fenceBorder"].position.set(-9.5,-0,2);
    meshes["fenceBorder"].rotation.y += Math.PI/2;

    meshes["fenceBorder2"].position.set(-9.5,-0,3);
    meshes["fenceBorder2"].rotation.y += Math.PI/2;

    meshes["fenceBorder3"].position.set(-9.5,-0,4);
    meshes["fenceBorder3"].rotation.y += Math.PI/2;

    meshes["fenceBorder4"].position.set(-9.5,-0,5);
    meshes["fenceBorder4"].rotation.y += Math.PI/2;

    meshes["fenceBorder5"].position.set(-9.5,-0,6);
    meshes["fenceBorder5"].rotation.y += Math.PI/2;

    meshes["fenceBorder6"].position.set(-9.5,-0,7);
    meshes["fenceBorder6"].rotation.y += Math.PI/2;

    meshes["fenceBorder7"].position.set(-9.5,-0,1);
    meshes["fenceBorder7"].rotation.y += Math.PI/2;

    meshes["fenceBorder8"].position.set(-9.5,-0,0);
    meshes["fenceBorder8"].rotation.y += Math.PI/2;

    meshes["fenceBorder9"].position.set(-9.5,-0,-1);
    meshes["fenceBorder9"].rotation.y += Math.PI/2;

    meshes["fenceBorder10"].position.set(-9.5,-0,-2);
    meshes["fenceBorder10"].rotation.y += Math.PI/2;

    meshes["fenceBorder11"].position.set(-9.5,-0,-3);
    meshes["fenceBorder11"].rotation.y += Math.PI/2;

    meshes["fenceBorder12"].position.set(-9.5,-0,-4);
    meshes["fenceBorder12"].rotation.y += Math.PI/2;

    meshes["fenceBorder13"].position.set(-9.5,-0,-5);
    meshes["fenceBorder13"].rotation.y += Math.PI/2;

    meshes["fenceBorder14"].position.set(-9.5,-0,-6);
    meshes["fenceBorder14"].rotation.y += Math.PI/2;

    meshes["fenceBorder15"].position.set(-9.5,-0,-7);
    meshes["fenceBorder15"].rotation.y += Math.PI/2;

    //Position of right fence borders
    meshes["fenceBorder16"].position.set(9.5,-0,2);
    meshes["fenceBorder16"].rotation.y -= Math.PI/2;

    meshes["fenceBorder17"].position.set(9.5,-0,3);
    meshes["fenceBorder17"].rotation.y -= Math.PI/2;

    meshes["fenceBorder18"].position.set(9.5,-0,4);
    meshes["fenceBorder18"].rotation.y -= Math.PI/2;

    meshes["fenceBorder19"].position.set(9.5,-0,5);
    meshes["fenceBorder19"].rotation.y -= Math.PI/2;

    meshes["fenceBorder20"].position.set(9.5,-0,6);
    meshes["fenceBorder20"].rotation.y -= Math.PI/2;

    meshes["fenceBorder21"].position.set(9.5,-0,7);
    meshes["fenceBorder21"].rotation.y -= Math.PI/2;

    meshes["fenceBorder22"].position.set(9.5,-0,1);
    meshes["fenceBorder22"].rotation.y -= Math.PI/2;

    meshes["fenceBorder23"].position.set(9.5,-0,0);
    meshes["fenceBorder23"].rotation.y -= Math.PI/2;

    meshes["fenceBorder24"].position.set(9.5,-0,-1);
    meshes["fenceBorder24"].rotation.y -= Math.PI/2;

    meshes["fenceBorder25"].position.set(9.5,-0,-2);
    meshes["fenceBorder25"].rotation.y -= Math.PI/2;

    meshes["fenceBorder26"].position.set(9.5,-0,-3);
    meshes["fenceBorder26"].rotation.y -= Math.PI/2;

    meshes["fenceBorder27"].position.set(9.5,-0,-4);
    meshes["fenceBorder27"].rotation.y -= Math.PI/2;

    meshes["fenceBorder28"].position.set(9.5,-0,-5);
    meshes["fenceBorder28"].rotation.y -= Math.PI/2;

    meshes["fenceBorder29"].position.set(9.5,-0,-6);
    meshes["fenceBorder29"].rotation.y -= Math.PI/2;

    meshes["fenceBorder30"].position.set(9.5,-0,-7);
    meshes["fenceBorder30"].rotation.y -= Math.PI/2;

    //Position for back fences
    let x = -9;
    for (let i=31; i < 51; i ++){
      
      meshes[`fenceBorder${i}`].position.set( x,0 ,-7)
      x++;
      console.log(x);
    }
    
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
    scene.add(meshes["lightPost"]);
    scene.add(meshes["lightPost2"]);
    scene.add(meshes["dirt"]);
    scene.add(meshes["dirt2"]);
    scene.add(meshes["dirt3"]);
    scene.add(meshes["fenceBorder"]);
    scene.add(meshes["fenceBorder2"]);
    scene.add(meshes["fenceBorder3"]);
    scene.add(meshes["fenceBorder4"]);
    scene.add(meshes["fenceBorder5"]);
    scene.add(meshes["fenceBorder6"]);
    scene.add(meshes["fenceBorder7"]);
    scene.add(meshes["fenceBorder8"]);
    scene.add(meshes["fenceBorder9"]);
    scene.add(meshes["fenceBorder10"]);
    scene.add(meshes["fenceBorder11"]);
    scene.add(meshes["fenceBorder12"]);
    scene.add(meshes["fenceBorder13"]);
    scene.add(meshes["fenceBorder14"]);
    scene.add(meshes["fenceBorder15"]);

    for (let i=16; i < 50; i++ ){
      scene.add(meshes[`fenceBorder${i}`]);
    }
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
        mesh.position.set(-6,0,-2);
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
     const walls = new THREE.Mesh(
     new THREE.BoxBufferGeometry(4, 2.5, 4),
     new THREE.MeshPhongMaterial({ color: 0xffffff,map:wallTexture})
   )
   walls.position.y = 1.25
   house.add(walls)

  // Roof
  let roofTexture = new THREE.TextureLoader().load('img/roofCabin.jpg')
  const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshPhongMaterial({ color: '#b35f45', map: roofTexture })
  )
  roof.rotation.y = Math.PI * 0.25
  roof.position.y = 2.5 + 0.5
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
      size: 0.01,
      transparent: true
  });

  rain = new THREE.Points(geometry, material);
  scene.add(rain);


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
   
  function keyDown(event){
    keyboard[event.keyCode] = true;
  }

  function keyUp(event){
    keyboard[event.keyCode] = false
  }
  
    function animate() {
      requestAnimationFrame( animate );
      //Randomly rotate slender
      if(obj != null){
        obj.rotation.y += 0.01;
      // //Left and right movement inside house
      if(!maxRight){
        obj.position.x += 0.01;
        if(obj.position.x >=1.8){
          maxRight = true;
        }
      }
      
      if(maxRight){
        obj.position.x -= 0.01;
        if(obj.position.x <= -1.7){
          maxRight = false;
        }
      }
      }
      
      //Animate clouds
      particles.forEach((p) => {
        p.rotation.z += 0.002;
      })

      //Flash animation
      if(Math.random() > 0.95 || flash.power > 100){
        if (flash.power < 100){
          flash.position.set(
            Math.random() * 400,
            300 + Math.random() * 200,
            100
          )
        };
        flash.power = 50 + Math.random() * 1000;
      }


      if(keyboard[83]){ // W key
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
      }
      if(keyboard[87]){ // S key
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
      }
      if(keyboard[68]){ // A key
        
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
      }
      if(keyboard[65]){ // D key
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
      }
      if(keyboard[39]){
        camera.rotation.y -= Math.PI * 0.001;
      }
      if(keyboard[37]){
        camera.rotation.y += Math.PI * 0.001;
      }
      if(keyboard[38]){
        camera.rotation.x += Math.PI * 0.001;
      }
      if(keyboard[40]){
        camera.rotation.x -= Math.PI * 0.001;
      }
     rainVelocity();
      renderer.render( scene, camera );
    }
    animate();
   
}

main();


