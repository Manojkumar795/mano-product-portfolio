import * as T from "three";

/** Aligned NASA surface, relief and night lights on one geographic sphere. */
export function createAltitudeEarthMaterial() {
  return new T.ShaderMaterial({
    transparent: true,
    toneMapped: false,
    uniforms: {
      dayMap: { value: null }, reliefMap: { value: null }, bathymetryMap: { value: null },
      nightMap: { value: null },
      opacity: { value: 1 },
      sunDirection: { value: new T.Vector3(.35, .72, 1.1).normalize() },
      deepOcean: { value: new T.Color("#071c30") }, shelfOcean: { value: new T.Color("#285c78") },
      lowland: { value: new T.Color("#7e927a") }, highland: { value: new T.Color("#d9d1b8") },
    },
    vertexShader: `varying vec2 earthUV; varying vec3 earthNormal; varying vec3 earthPosition;
      void main(){earthUV=uv;earthNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);earthPosition=p.xyz;gl_Position=projectionMatrix*p;}`,
    fragmentShader: `
      uniform sampler2D dayMap; uniform sampler2D reliefMap; uniform sampler2D bathymetryMap;
      uniform sampler2D nightMap;
      uniform float opacity;
      uniform vec3 sunDirection;
      uniform vec3 deepOcean; uniform vec3 shelfOcean; uniform vec3 lowland; uniform vec3 highland;
      varying vec2 earthUV; varying vec3 earthNormal; varying vec3 earthPosition;
      float terrain(vec2 p) {
        float bath=texture2D(bathymetryMap,p).r;
        float land=smoothstep(.993,1.0,bath);
        return mix(bath*.23, .23+texture2D(reliefMap,p).r*.75,land);
      }
      void main(){
        float bath=texture2D(bathymetryMap,earthUV).r;
        float land=smoothstep(.993,1.0,bath);
        vec3 satellite=pow(max(texture2D(dayMap,earthUV).rgb,vec3(0.0)),vec3(1.0/2.2));
        float elevation=texture2D(reliefMap,earthUV).r;
        float lightness=dot(satellite,vec3(.299,.587,.114));
        float arid=clamp((satellite.r-satellite.g)*5.0+.3,0.0,1.0);
        vec3 landColour=mix(lowland,highland,clamp(.25+elevation*1.4+arid*.3,0.0,1.0));
        landColour*=.68+lightness*.60;
        float snow=smoothstep(.73,.94,lightness);landColour=mix(landColour,highland*1.11,snow);
        vec3 ocean=mix(deepOcean,shelfOcean,pow(clamp(bath,0.0,1.0),2.0)*.82);
        float h=terrain(earthUV), hx=terrain(earthUV+dFdx(earthUV))-h, hy=terrain(earthUV+dFdy(earthUV))-h;
        vec3 n=normalize(earthNormal), q0=dFdx(earthPosition), q1=dFdy(earthPosition);
        vec3 r1=cross(q1,n),r2=cross(n,q0);float det=dot(q0,r1);
        n=normalize(abs(det)*n-sign(det)*(hx*r1+hy*r2)*mix(.06,.12,land));
        vec3 light=normalize(sunDirection);
        float incidence=dot(n,light);
        float sun=max(incidence,0.0);
        float daylight=smoothstep(-.18,.24,incidence);
        vec3 surface=mix(ocean*(.55+.80*sun),landColour*(.67+.48*sun),land);
        vec3 colour=mix(surface*vec3(.10,.18,.30),surface,daylight);
        float lights=texture2D(nightMap,earthUV).r;
        lights=pow(smoothstep(.055,.75,lights),1.1);
        colour+=vec3(1.0,.62,.24)*lights*(1.0-daylight)*.65*land;
        vec3 view=normalize(-earthPosition);
        float reflection=pow(max(dot(n,normalize(light+view)),0.0),36.0);
        colour+=vec3(.96,.86,.65)*reflection*.14*(1.0-land);
        float rim=pow(1.0-clamp(dot(normalize(earthNormal),normalize(-earthPosition)),0.0,1.0),4.0);
        colour+=vec3(.05,.29,.62)*rim*.22;
        colour+=vec3(.34,.19,.065)*rim*sun;
        gl_FragColor=vec4(colour,opacity);
        #include <colorspace_fragment>
      }`,
  });
}

/** Satellite cloud density uses the same UV origin as the surface below it. */
export function createAltitudeCloudMaterial() {
  return new T.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false,
    uniforms: {
      cloudMap: { value: null }, opacity: { value: 1 },
      sunDirection: { value: new T.Vector3() },
    },
    vertexShader: `varying vec2 cloudUV;varying vec3 cloudNormal;
      void main(){cloudUV=uv;cloudNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform sampler2D cloudMap;uniform float opacity;uniform vec3 sunDirection;
      varying vec2 cloudUV;varying vec3 cloudNormal;
      void main(){
        float density=smoothstep(.18,.95,texture2D(cloudMap,cloudUV).r);
        float incidence=dot(normalize(cloudNormal),normalize(sunDirection));
        float daylight=smoothstep(-.15,.30,incidence);
        vec3 colour=mix(vec3(.07,.15,.25),vec3(.82,.89,.94),daylight);
        colour+=vec3(.12,.055,.015)*max(incidence,0.0);
        gl_FragColor=vec4(colour,density*.52*opacity);
        #include <colorspace_fragment>
      }`,
  });
}
