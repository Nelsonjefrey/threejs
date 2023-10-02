import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

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
  private currentModel: number;
  private position: any;
  private target: any;
  private scrollY: number = 0;
  private loader = new GLTFLoader();
  private horizontalPercentage: number = -25;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.initScene();
    this.loadModel('assets/objeto.glb', 1);
    this.animate();
  }

  private initScene(): void {
    // Configura la escena, la cámara y el renderizador
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(1,1,1);
    // this.position = this.camera.position;    
    this.renderer = new THREE.WebGLRenderer( { alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.nativeElement.appendChild(this.renderer.domElement);

    this.renderer.domElement.style.position = "fixed";
    this.renderer.domElement.style.top = "0";
    // this.renderer.domElement.style.left = '0';
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setClearColor( 0xff0000, 0 );

    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    this.scene.add(ambientLight);

    this.ligthScene(3,0,5, 'add');
    this.ligthScene(-3,0,5, 'add');
    this.ligthScene(0,-3,5, 'add');
    this.ligthScene(0,3,5, 'add');


    // Posiciona la cámara
    this.camera.position.z = 4;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
    
  }

  
  private loadModel(pathModel: string, idModel: number): void {
    // Carga el modelo GLB       
    if (idModel != this.currentModel) {
      this.loader.load(pathModel, (gltf) => {
        this.scene.remove(this.model);
        this.model = gltf.scene;
        this.scene.add(this.model);
        this.scene.background = null;        
        gltf.scene.rotation.y = Math.PI / 2;
        if (idModel == 2) {
          this.camera.position.z = 6;   
          this.model.position.x = 3;
          this.model.position.y = 0;
          this.model.position.z = 0;                        

        }else{
          this.camera.position.z = 4;          
        }
  
      }, undefined, (error) => {
        console.error(error);
      });      
    } 
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
    
    const scrollPercent =
      ((document.documentElement.scrollTop || document.body.scrollTop) /
          ((document.documentElement.scrollHeight ||
              document.body.scrollHeight) -
              document.documentElement.clientHeight)) *
      100;
    const rotationFactor = 0.005; // Ajusta la velocidad de rotación
    this.scene.rotation.y = (scrollPercent * 3) * (rotationFactor * 3);

    if( scrollPercent < 35 ) {
      console.log('left');
      this.loadModel('assets/objeto.glb', 1);
      this.renderer.domElement.style.left = `${scrollPercent}%`;

      
    } else if( scrollPercent >= 35 && scrollPercent <= 75  ) {
      console.log('right');    
      this.loadModel('assets/reffer.glb', 2);
      this.renderer.domElement.style.left = `${35 - (scrollPercent - 35)}%`;
    }

  }

  ligthScene(x: number, y: number, z: number, accion: 'add' | 'remove'){
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    
    directionalLight.position.set(x, y, z);
    this.scene[accion](directionalLight);
  }

}
