import { PAPER_VERTICAL_PERSPECTIVE, paperIndices, paperVertices } from "./paper"

/** Paint the existing, laid-out page into a texture without reflowing its text.
 * Range measurements retain the browser's actual line breaks at every font size.
 * Live reading remains semantic HTML; only the temporary turning leaf is rasterized.
 */
function pageTexture(page: HTMLElement, ratio: number) {
  const bounds = page.getBoundingClientRect(), style = getComputedStyle(page)
  const canvas = document.createElement("canvas")
  canvas.width = Math.ceil(bounds.width * ratio); canvas.height = Math.ceil(bounds.height * ratio)
  const ctx = canvas.getContext("2d")!
  ctx.scale(ratio, ratio)
  ctx.fillStyle = style.getPropertyValue("--fp-paper").trim() || "#f3e6ce"
  ctx.fillRect(0, 0, bounds.width, bounds.height)
  const sheen = ctx.createLinearGradient(0, 0, bounds.width, 0)
  sheen.addColorStop(0, "#8b704012"); sheen.addColorStop(.3, "#ffffff09"); sheen.addColorStop(1, "#ffffff18")
  ctx.fillStyle = sheen; ctx.fillRect(0, 0, bounds.width, bounds.height)

  const art = page.querySelector<HTMLElement>(".fp-leaf-art")
  const src = art?.style.backgroundImage.match(/url\(["']?([^"')]+)/)?.[1]
  const image = Array.from(document.images).find((item) => src && item.src.endsWith(src) && item.complete && item.naturalWidth)
  if (image && art) {
    const rect = art.getBoundingClientRect(), artStyle = getComputedStyle(art)
    const layer = document.createElement("canvas"); layer.width = canvas.width; layer.height = canvas.height
    const paint = layer.getContext("2d")!; paint.scale(ratio, ratio)
    const scale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
    const w = image.naturalWidth * scale, h = image.naturalHeight * scale
    paint.drawImage(image, rect.left - bounds.left + (rect.width - w) / 2, rect.top - bounds.top + (rect.height - h) * .75, w, h)
    paint.globalCompositeOperation = "destination-in"
    const mask = paint.createRadialGradient(rect.left - bounds.left + rect.width * .62, rect.top - bounds.top + rect.height * .85, 0, rect.left - bounds.left + rect.width * .62, rect.top - bounds.top + rect.height * .85, rect.width * .74)
    mask.addColorStop(0, "#000"); mask.addColorStop(.55, "#0006"); mask.addColorStop(1, "#0000")
    paint.fillStyle = mask; paint.fillRect(0, 0, bounds.width, bounds.height)
    ctx.save(); ctx.globalAlpha = Number(artStyle.opacity); ctx.globalCompositeOperation = artStyle.mixBlendMode === "screen" ? "screen" : "multiply"
    ctx.drawImage(layer, 0, 0, bounds.width, bounds.height); ctx.restore()
  }

  // Text is read from ordinary paragraph nodes, never from generated HTML or remote SVG.
  const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  while (walker.nextNode()) {
    const node = walker.currentNode as Text, parent = node.parentElement!
    if (!node.data.trim()) continue
    const css = getComputedStyle(parent)
    ctx.font = `${css.fontStyle} ${css.fontWeight} ${css.fontSize} ${css.fontFamily}`
    ctx.fillStyle = css.color; ctx.textBaseline = "alphabetic"
    ctx.letterSpacing = css.letterSpacing === "normal" ? "0px" : css.letterSpacing
    const lines: { text: string; x: number; y: number }[] = []
    for (const match of node.data.matchAll(/\S+\s*/g)) {
      range.setStart(node, match.index!); range.setEnd(node, match.index! + match[0].length)
      const rect = range.getClientRects()[0] ?? range.getBoundingClientRect(), previous = lines.at(-1)
      if (previous && Math.abs(previous.y - rect.top) < 1) previous.text += match[0]
      else lines.push({ text: match[0], x: rect.left, y: rect.top })
    }
    const ascent = ctx.measureText("Hg").fontBoundingBoxAscent ?? parseFloat(css.fontSize) * .8
    for (const line of lines) ctx.fillText(line.text.trimEnd(), line.x - bounds.left, line.y - bounds.top + ascent)
  }
  // The quote rule and folio rule travel with the paper, as well as its text.
  for (const element of page.querySelectorAll<HTMLElement>("blockquote, .fp-leaf-number i")) {
    const rect = element.getBoundingClientRect(), css = getComputedStyle(element)
    const border = parseFloat(css.borderLeftWidth)
    ctx.fillStyle = border ? css.borderLeftColor : css.backgroundColor
    ctx.fillRect(rect.left - bounds.left, rect.top - bounds.top, border || rect.width, rect.height)
  }
  return canvas
}

const vertexShader = `
attribute vec3 aPosition;
attribute vec2 aUV;
attribute float aNormal;
attribute float aLight;
uniform vec2 uSize;
uniform vec2 uBook;
uniform vec2 uPadding;
varying vec2 vUV;
varying float vNormal;
varying float vLight;
void main() {
  float perspective = 1800.0 / (1800.0 - aPosition.z);
  vec2 scale = vec2(perspective, 1.0 + (perspective - 1.0) * ${PAPER_VERTICAL_PERSPECTIVE});
  vec2 point = (aPosition.xy - uBook * 0.5) * scale + uBook * 0.5 + uPadding;
  gl_Position = vec4(point.x / uSize.x * 2.0 - 1.0, 1.0 - point.y / uSize.y * 2.0, -aPosition.z / 1800.0, 1.0);
  vUV = aUV; vNormal = aNormal; vLight = aLight;
}`
const fragmentShader = `
precision mediump float;
uniform sampler2D uFront;
uniform sampler2D uBack;
varying vec2 vUV;
varying float vNormal;
varying float vLight;
void main() {
  vec4 front = texture2D(uFront, vUV);
  vec4 back = texture2D(uBack, vec2(1.0 - vUV.x, vUV.y));
  vec4 paper = vNormal >= 0.0 ? front : back;
  gl_FragColor = vec4(paper.rgb * vLight, paper.a);
}`

export function createPaperRenderer(canvas: HTMLCanvasElement, front: HTMLElement, back: HTMLElement, width: number, height: number, direction: number, columns: number) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false })
  if (!gl) return null
  const shaders: WebGLShader[] = [], buffers: WebGLBuffer[] = [], textures: WebGLTexture[] = []
  let program: WebGLProgram | null = null
  function dispose() {
    textures.forEach((texture) => gl!.deleteTexture(texture)); buffers.forEach((buffer) => gl!.deleteBuffer(buffer))
    shaders.forEach((shader) => gl!.deleteShader(shader)); if (program) gl!.deleteProgram(program)
    gl!.getExtension("WEBGL_lose_context")?.loseContext()
  }
  try {
    const shader = (type: number, code: string) => {
      const object = gl.createShader(type)!
      shaders.push(object); gl.shaderSource(object, code); gl.compileShader(object)
      if (!gl.getShaderParameter(object, gl.COMPILE_STATUS)) throw new Error("Paper shader unavailable")
      return object
    }
    program = gl.createProgram()!
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertexShader)); gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragmentShader)); gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Paper renderer unavailable")
    gl.useProgram(program)
    const bookWidth = width * columns, padX = width * .3, padY = height * .14
    const fullWidth = bookWidth + padX * 2, fullHeight = height + padY * 2
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.ceil(fullWidth * ratio); canvas.height = Math.ceil(fullHeight * ratio)
    canvas.style.width = `${fullWidth}px`; canvas.style.height = `${fullHeight}px`; canvas.style.left = `${-padX}px`; canvas.style.top = `${-padY}px`
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(gl.getUniformLocation(program, "uSize"), fullWidth, fullHeight)
    gl.uniform2f(gl.getUniformLocation(program, "uBook"), bookWidth, height)
    gl.uniform2f(gl.getUniformLocation(program, "uPadding"), padX, padY)
    for (const [index, page] of [front, back].entries()) {
      const texture = gl.createTexture()!; textures.push(texture)
      gl.activeTexture(gl.TEXTURE0 + index); gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pageTexture(page, ratio))
      gl.uniform1i(gl.getUniformLocation(program, index ? "uBack" : "uFront"), index)
    }
    const vertices = gl.createBuffer()!, elements = gl.createBuffer()!; buffers.push(vertices, elements)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices)
    for (const [name, size, offset] of [["aPosition", 3, 0], ["aUV", 2, 3], ["aNormal", 1, 5], ["aLight", 1, 6]] as const) {
      const location = gl.getAttribLocation(program, name)
      gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, size, gl.FLOAT, false, 28, offset * 4)
    }
    const indices = paperIndices()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.clearColor(0, 0, 0, 0)
    return {
      draw(progress: number) {
        if (gl.isContextLost()) return
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.bindBuffer(gl.ARRAY_BUFFER, vertices); gl.bufferData(gl.ARRAY_BUFFER, paperVertices(progress, width, height, direction, columns), gl.DYNAMIC_DRAW)
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
      },
      dispose,
    }
  } catch { dispose(); return null }
}
