Modernizr.load({
    test: (Modernizr.webgl && !Modernizr.touch),
    yep : [
        '/scripts/vendor/three.min.js', 
        '/scripts/vendor/TweenLite.min.js',
        '/scripts/vendor/perlin.js'
    ],
    complete: triangles
});

// do the stuff
function triangles() {

    if(Modernizr.touch) {
        console.log('Touch device.');
        return;
    }

    if(!Modernizr.webgl) {
        console.log('WebGL not supported.');
        return;
    }

    var ready = false;

    $(document).ready(function() {
        ready = true;
    });

    var renderer, container, scene, controls, geometry, mesh;
    var light_mouse, light_corner, camera, frustumHeight, frustumHeight;

    var lightDistance = 20,
        camDistance = 70,
        w_segs = 30,
        h_segs = 30,
        height = 0,
        lightBlue = 0x233b4b,
        lightGreen = 0xcbff48,
        snap = false,
        autoRun = 0;

    noise.seed(Math.random());

    init();
    animate();

    function init() {

        // RENDERER ------------------------
        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container = document.getElementById('tris');
        container.appendChild(renderer.domElement);
        scene = new THREE.Scene();

        // CAMERA/CONTROLS ------------------------
        camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 2, 1000);
        camera.position.z = camDistance;
        updateCamFrustum();

        // LIGHTS ------------------------
        light_mouse = new THREE.PointLight(0xcccccc, 0.1, 30);
        light_mouse.position.set(frustumWidth,frustumHeight,lightDistance);
        scene.add(light_mouse);

        light_corner = new THREE.PointLight(lightBlue, 0.3, 100);
        light_corner.position.set(frustumWidth/2,frustumHeight/2,lightDistance*1.5);
        scene.add(light_corner);

        var ambient = new THREE.AmbientLight(0x293b47);
        scene.add(ambient);

        // GEOMETRY/MATERIALS ------------------------
        geometry = new THREE.PlaneGeometry(200,200,w_segs,h_segs);
        addNoise(geometry, -4, 4, 0.5, 0.5, 1);
        updatePNoise();

        var material = new THREE.MeshPhongMaterial({
            //wireframe: true,
            shading: THREE.FlatShading,
            color: 0xffffff,
            shininess: 50,
            blending: THREE.MultiplyBlending
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.z = rad(-45);
        scene.add(mesh);

        // change light color on hover
        $(document).on('mouseenter', 'a', function() {
            tweenGreen();
            resetAutoRun();
        });

        $(document).on('mouseleave', 'a', function() {
            tweenBlue();
            resetAutoRun();
        });

        $(document).on('click', 'a', function() {
            tweenBlue();
            resetAutoRun();
        });

        function tweenGreen() {

            var color = '#cbff48';

            TweenLite.to(light_mouse.color, 1, {
                r: hexToRgb(color).r * 2,
                g: hexToRgb(color).g * 2,
                b: hexToRgb(color).b * 2,
                overwrite: true
            });

            //snapLight($(this));
        }

        function tweenBlue(event) {

            var color = '#cccccc';

            TweenLite.to(light_mouse.color, 0.5, {
                r: hexToRgb(color).r,
                g: hexToRgb(color).g,
                b: hexToRgb(color).b,
                overwrite: true
            });

            //snap = false;
        }

        // EVENTS
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove);

    }

    function updatePNoise() {

        var scale = 5,
            time = Date.now()/7000

        for(var r = 0; r < h_segs + 1; r++) {
            for(var c = 0; c < w_segs + 1; c++) {

                var val = noise.simplex3(c/4, r/4, time) * scale + noise.simplex3(c/1, r/1, time) * 3;

                geometry.vertices[c * (w_segs + 1) + r].z = val;
            }
        }

        geometry.verticesNeedUpdate = true;
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();


        if(ready) { // delay css transition until webgl is ready
            $('body').addClass('bg-ready'); 
            ready = false;
        }
    }

    function resetAutoRun() {
        if(autoRun <= 0) {
            autoRun = 100;
            animate();
        }
    }

    // animation loop
    function animate() {
        //updatePNoise();

        if(autoRun > 0) {
            console.log('animating auto');
            autoRun--;
            requestAnimationFrame(animate);
        }

        renderer.render(scene, camera);
    }

    // change light position on mouse move
    function onMouseMove(event) {

        if(autoRun <= 0) {
            console.log('animating via mouse');
            requestAnimationFrame(animate);
        }

        var coords = convertScreenTo3D(event.clientX, event.clientY);
        !snap && placeLight(light_mouse, coords.x, coords.y);
    }

    // change light position on touch event
    function onTouchMove(event) {
        var coords = convertScreenTo3D(event.touches[0].pageX, event.touches[0].pageY - document.body.scrollTop);
        snap = false;
        placeLight(light_mouse, coords.x, coords.y);
    }

    function snapLight($el) {
        snap = true;

        var x = $el.offset().left + $el.outerWidth(true)/2,
            y = $el.offset().top - $(window).scrollTop() + $el.outerHeight(true)/2,
            coords = convertScreenTo3D(x, y);

        TweenLite.to(light_mouse.position, 0.2, {
            x: coords.x,
            y: coords.y
        });
    }

    // translate screen space x,y to 3d space x,y 
    function convertScreenTo3D(x, y) {
        var cameraX = x / window.innerWidth * frustumWidth - frustumWidth/2,
            cameraY = -1 * (y / window.innerHeight * frustumHeight - frustumHeight/2);

        return { x: cameraX, y: cameraY };
    }

    // set light position
    function placeLight(light, x, y) {
        light.position.set(x, y, light.position.z);
    }

    // update camera aspect ratio and move corner light
    function onWindowResize() {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        updateCamFrustum();

        renderer.setSize(window.innerWidth, window.innerHeight);

        light_corner.position.set(
            frustumWidth/2, 
            frustumHeight/2, 
            light_corner.position.z
        );
    }

    // scatter vertices in the triangle plane
    function addNoise(geometry, min, max, x, y, z) {

        if(typeof x == 'undefined') x = 1;
        if(typeof y == 'undefined') y = 1;
        if(typeof z == 'undefined') z = 1;

        for(var i = 0; i < geometry.vertices.length; i++) {
            if(x) geometry.vertices[i].x += getRandomArbitrary(min * x, max * x);
            if(y) geometry.vertices[i].y += getRandomArbitrary(min * y, max * y);
            if(z) geometry.vertices[i].z += getRandomArbitrary(min * z, max * z);
        }

        geometry.verticesNeedUpdate = true;
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
    }

    // get 3d space width/height of area traversable by mouse light
    function updateCamFrustum() {
        frustumHeight = 2 * Math.tan(camera.fov / 2) * (camDistance - lightDistance);
        frustumWidth = frustumHeight * camera.aspect;
    }

    // convert hex string to rgb object
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16)*1.0/256,
            g: parseInt(result[2], 16)*1.0/256,
            b: parseInt(result[3], 16)*1.0/256
        } : null;
    }

    // random float in range
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    // deg to rad
    function rad(deg) {
        return deg * (Math.PI/180);
    }
}