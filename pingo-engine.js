/* ============================================================================
   pingo-engine.js  —  shared three.js mascot layer for the Whalo deck
   ----------------------------------------------------------------------------
   • Loads the Draco-compressed, RIGGED Pingo model from window.PINGO_GLB_B64.
   • Drives REAL skeletal animation procedurally: it rotates the actual bones
     (flippers, head, hair, body) — no baked clips required. Bone names + axes
     were verified against the game rig (Penguin_Rig.fbx):
        R/L_Upper_Arm_JNT  +Z lowers the flipper, −Z raises it
        Head1_JNT          −X nods down, +X tilts up
        R/L_Lower_Arm_JNT  −Z bends the elbow
   • One renderer; its canvas is overlaid on whichever active slide has a
     `.pingo-stage`, and that stage's `data-animation` picks the move.
        Animations: idle · bob · wave · spin · jump · celebrate · present ·
                    dance · nod · peek
   • Pointer position adds a subtle look-toward-cursor parallax.

   Classic (non-module) script: expects global THREE, THREE.GLTFLoader and
   THREE.DRACOLoader (loaded first in index.html) so the deck also runs from a
   double-clicked file:// page with no server.
   ========================================================================== */
(function () {
  'use strict';

  var DRACO_PATH = (typeof window !== 'undefined' && window.PINGO_DRACO_PATH) || 'https://cdn.jsdelivr.net/npm/three@0.137.0/examples/js/libs/draco/';
  var TARGET_HEIGHT = 2.2;
  var ARM_REST = 1.0;          // flipper resting angle (radians, about +Z)

  function b64ToArrayBuffer(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }
  if (typeof THREE === 'undefined') { console.error('[Pingo] three.js not loaded'); return; }

  /* ---- renderer / scene ------------------------------------------------- */
  // ONE full-viewport canvas. Pingo is rendered into whichever slide's
  // `.pingo-stage` is active using a scissor rectangle, so there is no per-slide
  // canvas repositioning to go wrong — it works identically on every slide.
  var canvas = document.createElement('canvas');
  canvas.id = 'pingo-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10;opacity:0;transition:opacity .35s ease;';
  document.body.appendChild(canvas);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.autoClear = false;
  if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);   // fully transparent — the canvas must NEVER cover slide content

  function sizeRenderer() { renderer.setSize(window.innerWidth, window.innerHeight, false); }
  window.addEventListener('resize', sizeRenderer);
  sizeRenderer();
  renderer.clear(true, true, true);      // initial transparent wipe (before the model loads + loop starts)

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.15, 6.2);
  camera.lookAt(0, 1.0, 0);

  scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x2a1a55, 1.0));
  var key = new THREE.DirectionalLight(0xffffff, 1.55); key.position.set(3, 5, 4); scene.add(key);
  var rimBlue = new THREE.DirectionalLight(0x2b5efc, 1.0); rimBlue.position.set(-4, 2, -3); scene.add(rimBlue);
  var rimLime = new THREE.DirectionalLight(0xbcfd4c, 0.55); rimLime.position.set(4, -1, -4); scene.add(rimLime);

  var pivot = new THREE.Group();   // whole-body transforms (hop, spin, sway)
  scene.add(pivot);

  var model = null, baseScale = 1;
  var bones = {};                  // name -> Bone
  var restQ = {};                  // name -> rest THREE.Quaternion (cloned)
  var AX = { x: new THREE.Vector3(1,0,0), y: new THREE.Vector3(0,1,0), z: new THREE.Vector3(0,0,1) };
  var _q = new THREE.Quaternion(), _qa = new THREE.Quaternion();

  var WANT = ['R_Upper_Arm_JNT','L_Upper_Arm_JNT','R_Lower_Arm_JNT','L_Lower_Arm_JNT',
              'Head1_JNT','Head2_JNT','Hair_1_JNT','Hair2_JNT','COG_JNT','Chest_JNT',
              'Belly_JNT','L_Foot_JNT','R_Foot_JNT','Upper_Beak_JNT','Lower_Beak_JNT'];

  var pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  /* set a bone = rest * Rx * Ry * Rz (local-axis offsets, radians) */
  function setBone(name, rx, ry, rz) {
    var b = bones[name]; if (!b) return;
    _q.copy(restQ[name]);
    if (rx) _q.multiply(_qa.setFromAxisAngle(AX.x, rx));
    if (ry) _q.multiply(_qa.setFromAxisAngle(AX.y, ry));
    if (rz) _q.multiply(_qa.setFromAxisAngle(AX.z, rz));
    b.quaternion.copy(_q);
  }
  function resetBones() {
    for (var i = 0; i < WANT.length; i++) { var n = WANT[i]; if (bones[n]) bones[n].quaternion.copy(restQ[n]); }
  }

  /* ---- load ------------------------------------------------------------- */
  function loadModel(onDone, onErr) {
    if (!window.PINGO_GLB_B64) { onErr(new Error('PINGO_GLB_B64 missing — include pingo-model.js first')); return; }
    var draco = new THREE.DRACOLoader();
    draco.setDecoderPath(DRACO_PATH);
    draco.setDecoderConfig({ type: 'js' });
    var loader = new THREE.GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.parse(b64ToArrayBuffer(window.PINGO_GLB_B64), '', function (gltf) {
      var root = gltf.scene;
      root.traverse(function (o) {
        if (o.isMesh) { o.frustumCulled = false; if (o.material) o.material.envMapIntensity = 0.5; }
        if (o.isBone && WANT.indexOf(o.name) >= 0) { bones[o.name] = o; restQ[o.name] = o.quaternion.clone(); }
      });
      // normalise from bind pose: center X/Z, feet at y=0, scale to height
      var box = new THREE.Box3().setFromObject(root);
      var size = new THREE.Vector3(); box.getSize(size);
      var center = new THREE.Vector3(); box.getCenter(center);
      baseScale = TARGET_HEIGHT / (size.y || 1);
      root.position.set(-center.x * baseScale, -box.min.y * baseScale, -center.z * baseScale);
      root.scale.setScalar(baseScale);
      pivot.add(root);
      model = root;
      onDone();
    }, onErr);
  }

  /* ---- animations -------------------------------------------------------
     Each sets bone offsets (via setBone) + whole-body pivot transform.
     Arms default to ±ARM_REST (down at the sides).                          */
  var ANIM = {
    idle: function (t) {
      var s = Math.sin(t * 1.8) * 0.05;
      setBone('R_Upper_Arm_JNT', 0,0, ARM_REST + Math.sin(t*1.6)*0.05);
      setBone('L_Upper_Arm_JNT', 0,0, ARM_REST + Math.sin(t*1.6+0.4)*0.05);
      setBone('Head1_JNT', Math.sin(t*1.2)*0.05, Math.sin(t*0.5)*0.08, 0);
      setBone('Hair_1_JNT', 0,0, Math.sin(t*2.2)*0.12);
      pivot.position.y = s; pivot.rotation.set(0, Math.sin(t*0.5)*0.12, 0);
      pivot.scale.set(1, 1 + Math.sin(t*1.8)*0.012, 1);
    },
    bob: function (t) {
      setBone('R_Upper_Arm_JNT', 0,0, ARM_REST - Math.sin(t*2.4)*0.22);
      setBone('L_Upper_Arm_JNT', 0,0, ARM_REST + Math.sin(t*2.4)*0.22);
      setBone('Head1_JNT', Math.sin(t*2.4)*0.08, 0, 0);
      setBone('Hair_1_JNT', 0,0, Math.sin(t*2.6)*0.18);
      pivot.position.y = Math.abs(Math.sin(t*2.4))*0.12; pivot.rotation.set(0, Math.sin(t*0.8)*0.1, 0);
      pivot.scale.set(1,1,1);
    },
    wave: function (t) {
      setBone('L_Upper_Arm_JNT', 0,0, ARM_REST);
      setBone('R_Upper_Arm_JNT', 0,0, -0.8 + Math.sin(t*7)*0.28);     // raised + waving
      setBone('R_Lower_Arm_JNT', 0,0, -0.45 + Math.sin(t*7)*0.18);
      setBone('Head1_JNT', 0.04, -0.12, 0.06);
      setBone('Hair_1_JNT', 0,0, Math.sin(t*3)*0.18);
      pivot.position.y = Math.sin(t*2.0)*0.04; pivot.rotation.set(0, 0.08, 0); pivot.scale.set(1,1,1);
    },
    spin: function (t) {
      var flap = Math.sin(t*6)*0.28;
      setBone('R_Upper_Arm_JNT', 0,0, 0.5 + flap); setBone('L_Upper_Arm_JNT', 0,0, 0.5 - flap);
      setBone('Head1_JNT', Math.sin(t*4)*0.06, 0, 0);
      setBone('Hair_1_JNT', 0,0, Math.sin(t*5)*0.22);
      pivot.position.y = Math.abs(Math.sin(t*4))*0.09; pivot.rotation.set(0, t*1.6, 0); pivot.scale.set(1,1,1);
    },
    jump: function (t) {
      var p = (t * 1.25) % 2, up = Math.max(0, Math.sin(p * Math.PI));
      var arms = ARM_REST - up * 1.0;                                 // arms rise on takeoff
      setBone('R_Upper_Arm_JNT', 0,0, arms); setBone('L_Upper_Arm_JNT', 0,0, arms);
      setBone('Head1_JNT', up*0.12, 0, 0);
      setBone('L_Foot_JNT', up*0.5,0,0); setBone('R_Foot_JNT', up*0.5,0,0);
      var squash = (p < 0.16 || (p > 0.92 && p < 1.1)) ? 0.86 : 1 + up*0.08;
      pivot.position.y = up * 0.85;
      pivot.scale.set(1 + (1-squash)*0.5, squash, 1 + (1-squash)*0.5);
      pivot.rotation.set(0,0,0);
    },
    celebrate: function (t) {
      var f = Math.sin(t*9)*0.18, up = Math.abs(Math.sin(t*4));
      setBone('R_Upper_Arm_JNT', 0,0, -1.2 + f); setBone('L_Upper_Arm_JNT', 0,0, -1.2 - f);
      setBone('Head1_JNT', -0.12 + Math.sin(t*8)*0.05, 0, 0);
      setBone('Lower_Beak_JNT', 0.25, 0, 0);
      setBone('Hair_1_JNT', 0,0, Math.sin(t*6)*0.25);
      pivot.position.y = up*0.32; pivot.rotation.set(0, Math.sin(t*4)*0.18, 0); pivot.scale.set(1+up*0.05,1+up*0.05,1+up*0.05);
    },
    present: function (t) {
      setBone('L_Upper_Arm_JNT', 0,0, ARM_REST + Math.sin(t*2.2)*0.08);
      setBone('R_Upper_Arm_JNT', 0.3,0, 0.35 + Math.sin(t*2.2)*0.22);  // gesture out, bobbing
      setBone('R_Lower_Arm_JNT', 0,0, -0.3 + Math.sin(t*2.2)*0.15);
      setBone('Head1_JNT', Math.sin(t*1.8)*0.05, -0.2 + Math.sin(t*0.9)*0.08, 0);
      setBone('Hair_1_JNT', 0,0, Math.sin(t*2.4)*0.16);
      pivot.position.y = Math.sin(t*2.2)*0.05; pivot.rotation.set(0, -0.28, 0); pivot.scale.set(1,1,1);
    },
    dance: function (t) {
      setBone('R_Upper_Arm_JNT', 0,0, ARM_REST - Math.sin(t*4)*0.5);
      setBone('L_Upper_Arm_JNT', 0,0, ARM_REST + Math.sin(t*4)*0.5);
      setBone('Head1_JNT', 0, Math.sin(t*4)*0.18, 0);
      setBone('Hair_1_JNT', 0,0, Math.sin(t*4)*0.3);
      pivot.position.y = Math.abs(Math.sin(t*4))*0.08;
      pivot.rotation.set(0, Math.sin(t*2)*0.12, Math.sin(t*4)*0.1);
      pivot.scale.set(1,1,1);
    },
    nod: function (t) {
      setBone('R_Upper_Arm_JNT', 0,0, ARM_REST); setBone('L_Upper_Arm_JNT', 0,0, ARM_REST);
      setBone('Head1_JNT', -0.28*(0.5+0.5*Math.sin(t*3)), 0, 0);
      pivot.position.y = Math.sin(t*1.6)*0.03; pivot.rotation.set(0,0,0); pivot.scale.set(1,1,1);
    },
    peek: function (t) {
      setBone('R_Upper_Arm_JNT', 0,0, ARM_REST - Math.sin(t*3)*0.18);
      setBone('L_Upper_Arm_JNT', 0,0, ARM_REST + Math.sin(t*3)*0.18);
      setBone('Head1_JNT', 0.04, -0.28 + Math.sin(t*1.6)*0.16, 0);
      setBone('Hair_1_JNT', 0,0, Math.sin(t*3)*0.2);
      pivot.position.y = Math.abs(Math.sin(t*2.4))*0.07; pivot.rotation.set(0, -0.15, 0); pivot.scale.set(1,1,1);
    }
  };

  /* ---- per-frame -------------------------------------------------------- */
  var clock = new THREE.Clock();
  function currentStage() {
    return document.querySelector('.slide.active .pingo-stage')
        || document.querySelector('.pingo-stage');
  }
  function frame() {
    requestAnimationFrame(frame);
    if (!model) return;

    // wipe the whole transparent canvas first (no ghosting when Pingo moves slide)
    renderer.setScissorTest(false);
    renderer.clear(true, true, true);

    var stage = currentStage();
    if (!stage) return;
    var r = stage.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    // off-screen (mid slide-transition)? skip
    if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) return;

    var t = clock.getElapsedTime();
    resetBones();
    var name = stage.dataset.animation || 'idle';
    (ANIM[name] || ANIM.idle)(t);
    pivot.rotation.y += pointer.x * 0.18;
    pivot.rotation.x = (pivot.rotation.x || 0) + pointer.y * 0.06;

    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();

    // render Pingo only inside the active stage rectangle (y is up from bottom)
    var vx = r.left, vy = window.innerHeight - r.bottom, vw = r.width, vh = r.height;
    renderer.setViewport(vx, vy, vw, vh);
    renderer.setScissor(vx, vy, vw, vh);
    renderer.setScissorTest(true);
    renderer.render(scene, camera);
  }

  loadModel(
    function () { document.body.classList.add('pingo-ready'); canvas.style.opacity = '1'; frame(); },
    function (err) { console.error('[Pingo]', err); document.body.classList.add('pingo-failed'); }
  );

  window.Pingo = { ANIM: ANIM, scene: scene, renderer: renderer, camera: camera, bones: bones,
                   get model() { return model; } };
})();
