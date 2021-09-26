import * as THREE from './node_modules/three/build/three.module.js'

function main(){
    const canvas = document.querySelector("#root");
    const renderer = new THREE.WebGLRenderer({canvas});

    //Set up camera
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.z = 2;

    //Create scene
    const scene = new THREE.Scene();

    //Create geometry
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth,boxHeight,boxDepth);

    //Create material
    const material = new THREE.MeshBasicMaterial({color: 0x44aa88});

    //Create mesh
    const cube = new THREE.Mesh(geometry,material);

    //Add mesh to the scene
    scene.add(cube);

    renderer.render(scene,camera);
    
}

main();