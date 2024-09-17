import MeshRenderer, { type RenderParams } from './MeshRenderer'
type MeshParams = Omit<RenderParams, 'device' | 'canvas'>

export default class Mesh {
  static device: GPUDevice
  renderer: MeshRenderer
  parentEl: HTMLElement
  constructor(parentEl: HTMLElement, params: MeshParams) {
    this.parentEl = parentEl
    const canvas = this.setupCanvas()
    this.renderer = new MeshRenderer({
      device: Mesh.device,
      canvas: canvas,
      ...params
    })
    if (!Mesh.device) {
      Mesh.loadDevice().then(() => {
        this.renderer.render()
      })
    } else {
      this.renderer.render()
    }
  }

  setupCanvas() {
    const canvas = document.createElement('canvas')
    canvas.width = this.parentEl.clientWidth
    canvas.height = this.parentEl.clientHeight
    this.parentEl.appendChild(canvas)
    return canvas
  }

  static async loadDevice() {
    const adapter = await navigator.gpu.requestAdapter()
    if (adapter === null) throw new Error('un supported webgpu')
    this.device = await adapter.requestDevice()
  }
}
