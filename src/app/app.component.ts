import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Group;
  private scrollY: number = 0;
  private horizontalPercentage: number = -25;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.initScene();
    this.loadModel();
    this.animate();
  }

  private initScene(): void {
    // Configura la escena, la cámara y el renderizador
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.nativeElement.appendChild(this.renderer.domElement);

    this.renderer.domElement.style.position = "sticky";
    this.renderer.domElement.style.top = "0";
    this.renderer.domElement.style.transition = "all 0.5s linear";
    this.renderer.domElement.style.transform = "translate(-25%)";

    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1);

    directionalLight.position.set(3, 0, 5);
    this.scene.add(directionalLight);

    directionalLight2.position.set(-3, 0, 5);
    this.scene.add(directionalLight2);

    directionalLight3.position.set(0, -3, 5);
    this.scene.add(directionalLight3);

    directionalLight4.position.set(0, 3, 5);
    this.scene.add(directionalLight4);

    // Posiciona la cámara
    this.camera.position.z = 5;
  }

  private loadModel(): void {
    // Carga el modelo GLB
    const loader = new GLTFLoader();
    loader.load('assets/objeto.glb', (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);

    }, undefined, (error) => {
      console.error(error);
    });
  }

  private animate(): void {
    // Realiza la animación
    const animate = () => {
      requestAnimationFrame(animate);

      

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    this.scrollY = window.scrollY;

    console.log('this.scrollY', this.scrollY)
    // if (this.scrollY >= 200) {
    //   // const rotationFactor = 0.005; // Ajusta la velocidad de rotación
    //   this.scene.rotation.y = this.scroll v  Y * rotationFactor;
    //   this.renderer.domElement.style.transform = `translate(25%)`;
    // } else if( this.scrollY < 200 ) {
    //   this.renderer.domElement.style.transform = `translate(-25%)`;
    // }
  }

}
