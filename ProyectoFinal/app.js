import * as THREE from './node_modules/three/build/three.module.js'


  
function main(){
    const canvas = document.querySelector("#root");
    const renderer = new THREE.WebGLRenderer({canvas});

    //Set up camera
    const fov = 75;
    const aspect = window.innerWidth/window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.set(4,2.5,7.5); // Set position like this
    camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this
    console.log(aspect);
    //camera.position.set(0,1.8,-5);
    // camera.lookAt(new THREE.Vector3(0,0,0));

    //Create scene
    const scene = new THREE.Scene();
    

    //Create floor
    const meshFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(10,10,10,10),
      new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true})
    );
    meshFloor.rotation.x -= Math.PI /2;
    scene.add(meshFloor);

    //House container
     const house = new THREE.Group()
     scene.add(house)

  //   //Create house 
     const walls = new THREE.Mesh(
     new THREE.BoxBufferGeometry(4, 2.5, 4),
     new THREE.MeshBasicMaterial({ color: '#ac8e82' })
   )
   walls.position.y = 1.25
   house.add(walls)

   // Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshBasicMaterial({ color: '#b35f45' })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2),
  new THREE.MeshBasicMaterial({ color: '#aa7b7b' })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshBasicMaterial({ color: '#b2b6b1' })

for(let i = 0; i < 50; i++)
{
    const angle = Math.random() * Math.PI * 2 // Random angle
    const radius = 3 + Math.random() * 6      // Random radius
    const x = Math.cos(angle) * radius        // Get the x position using cosinus
    const z = Math.sin(angle) * radius        // Get the z position using sinus

    // Create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    // Position
    grave.position.set(x, 0.3, z)                              

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4

    // Add to the graves container
    graves.add(grave)
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
    renderer.render(scene, camera);
}



main();