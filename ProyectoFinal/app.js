import * as THREE from './node_modules/three/build/three.module.js'
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';



function main(){
    const canvas = document.querySelector("#root");
    const renderer = new THREE.WebGLRenderer({canvas});
    
    document.body.appendChild( renderer.domElement );
    

    //Set up camera
    const fov = 75;
    const aspect = window.innerWidth/window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.set(0,2.5,7.5); 
    //camera.position.z = 100
    camera.lookAt(new THREE.Vector3(0,0,0)); 
    console.log(aspect);
    //camera.position.set(0,1.8,-5);
    // camera.lookAt(new THREE.Vector3(0,0,0));
    //const controls = new OrbitControls( camera, renderer.domElement );
    //controls.update();
   
    //Add orbit controls for better view
    const controls = new OrbitControls(camera, renderer.domElement);

    const scene = new THREE.Scene();
    
    //Create scene
    //Create floor
    let texture = new THREE.TextureLoader().load('img/floor.jpg')
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    const meshFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(20,15,10,10),
      new THREE.MeshBasicMaterial({map:texture, wireframe:false})
    );
    meshFloor.rotation.x -= Math.PI /2;
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
     new THREE.MeshBasicMaterial({ color: 0xffffff,map:wallTexture})
   )
   walls.position.y = 1.25
   house.add(walls)

  // Roof
  let roofTexture = new THREE.TextureLoader().load('img/roofCabin.jpg')
  const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshBasicMaterial({ color: '#b35f45', map: roofTexture })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// Door
let doorTexture = new THREE.TextureLoader().load('img/door.jpg');
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2),
  new THREE.MeshBasicMaterial({ color: '#aa7b7b', map:doorTexture })
)
door.position.y = 0.9
door.position.z = 2 + 0.01
house.add(door)

//Window

// Graves
const graves = new THREE.Group()
scene.add(graves)

let stoneTexture = new THREE.TextureLoader().load('img/stone.png')
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshBasicMaterial({ color: '#b2b6b1', map: stoneTexture })

for(let i = 0; i < 50; i++)
{
    const angle = Math.random() * Math.PI * 2 
    const radius = 3 + Math.random() * 6      
    const x = Math.cos(angle) * radius        
    const z = Math.sin(angle) * radius        

    // Create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    // Position
    grave.position.set(x, 0.3, z)                              

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4

    // Add to the graves container
    console.log(`x value is ${x}`);
    //console.log(`z values is ${z}`)
    if (x > 10 || x < -10 || z > 7.5 || z < -7.5){
      //Dont add gravee
    } else {
      graves.add(grave)
    }
   
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
    function animate() {

      requestAnimationFrame( animate );
    
     // // required if controls.enableDamping or controls.autoRotate are set to true
      //controls.update();
     // main()
      renderer.render( scene, camera );
      controls.update();
    }
    animate();
}

main();


