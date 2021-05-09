let camera, renderer, scene,cube,rain,rainGeo,rainCount=50000,raingeometry;

function init(){
    scene = new THREE.Scene();

    // container = document.querySelector('.scene');

    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,10000);
    camera.position.set(-800,0,-900);

    renderer = new THREE.WebGLRenderer({canvas:document.querySelector("#canvas")});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.render(scene,camera);

    let light = new THREE.AmbientLight(0xffffff,1);
    scene.add(light);

    let dirlight = new THREE.DirectionalLight(0xffffff,1);
    dirlight.position.set(0,-400,400);
    scene.add(dirlight);

    // flash = new THREE.PointLight(0x062d89,30,500,1.7);;
    // flash.position.set(20000,30000,10000);
    // scene.add(flash);

    // const geometry = new THREE.BoxGeometry(500,500,500);
    // const texture = new THREE.TextureLoader().load('simulator_avatar.png');
    // const material = new THREE.MeshBasicMaterial({map:texture});
    // cube = new THREE.Mesh(geometry,material);
    // cube.position.set(0,-300,0);
    // scene.add(cube);


    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0,0,-300);
    controls.minDistance =0;
    controls.maxDistance = 1200;
    controls.enablePan = true;
    controls.enableDamping = true;
    controls.update();

    rainGeo=new THREE.BufferGeometry(); 
    let vertices = [];
    for(let i=0;i<rainCount;i++){

        rainDrop=new THREE.Vector3(
            Math.random()*40000-20000,
            Math.random()*50000-25000,
            Math.random()*40000-20000
        );
        vertices.push(rainDrop);
    }
    raingeometry = new THREE.BufferGeometry().setFromPoints(vertices);

    rainMaterial= new THREE.PointsMaterial({
        color:0xaaaaaa,
        size:15,
        transparent:true
    });
    rain = new THREE.Points(raingeometry,rainMaterial);
    scene.add(rain);

    // let loader = new THREE.GLTFLoader();
    // loader.load('./resources/scene.gltf',function(gltf){
    //     scene.add(gltf.scene);
    //     gltf.scene.position.set(0,-50,0);
    // });

    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load( './resources/Brudslojan/posx.jpg');
    let texture_bk = new THREE.TextureLoader().load( './resources/Brudslojan/negx.jpg');
    let texture_up = new THREE.TextureLoader().load( './resources/Brudslojan/posy.jpg');
    let texture_dn = new THREE.TextureLoader().load( './resources/Brudslojan/negy.jpg');
    let texture_rt = new THREE.TextureLoader().load( './resources/Brudslojan/posz.jpg');
    let texture_lf = new THREE.TextureLoader().load( './resources/Brudslojan/negz.jpg');
    
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
    
    for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;
    
    let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
    let skybox = new THREE.Mesh( skyboxGeo, materialArray );
    scene.add( skybox );

    let selectHtml = '';
    let jumpto = document.getElementById('jump-to');

    const text_entry = new THREE.FontLoader();
    text_entry.load('./NanumMyeongjo_Regular.json',function(font){
        let textgeo = new THREE.TextGeometry('이곳은 생각하는 숲',{
            font: font,
            size: 100,
            height:8,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 2,
            bevelOffset: 0,
            bevelSegments: 5
        });
        let material = new THREE.MeshPhongMaterial({
            color: 0xdddddd
        });
        let textMesh = new THREE.Mesh( textgeo, material );
        textMesh.position.set(700,0,-500);
        textMesh.rotation.y=-Math.PI/9*6.2;
        scene.add(textMesh);
    });
    selectHtml+='<option value="0">date</option>';
    for(let i=0;i<diary.length;i++){
        let j=i+1;
        selectHtml+='<option value="'+j+'">'+diary[i].date+'</option>'
        const text_55 = new THREE.FontLoader();
        text_55.load('./NanumMyeongjo_Regular.json',function(font){
            let textgeo = new THREE.TextGeometry(diary[i].date+'\n'+diary[i].text,{
                font: font,
                size: 50,
                height:8,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 6,
                bevelSize: 2,
                bevelOffset: 0,
                bevelSegments: 5
            });
            let material = new THREE.MeshPhongMaterial({
                color: 0xdddddd
            });
            let textMesh = new THREE.Mesh( textgeo, material );
            textMesh.position.set(diary[i].x,diary[i].y,diary[i].z);
            textMesh.rotation.y=-Math.PI/9*diary[i].angle;
            scene.add(textMesh);
        });
    }
    jumpto.value=diary.length-1;
    jumpto.innerHTML=selectHtml;
}

function animate(){
    let positions = raingeometry.attributes.position.array;
    
    for(let i=0; i<positions.length; i+=3){
        let velocity = 0;
        velocity-=20+Math.random()*160;
        positions[i+1]+=velocity;
        if(positions[i+1]<-20000){
            positions[i+1]=20000;
        }
    }
    raingeometry.attributes.position.needsUpdate = true;
    rain.rotation.y+=0.002;

    // if(Math.random()>0.97||flash.power>100){
    //     if(flash.power<100)
    //     flash.position.set(
    //         Math.random()*40000,
    //         300+Math.random()*20000,
    //         10000
    //     );
    //     flash.power = 50+Math.random() *500;
    // }
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}
function resize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);

}
window.addEventListener("resize",resize,false);
init();
animate();
