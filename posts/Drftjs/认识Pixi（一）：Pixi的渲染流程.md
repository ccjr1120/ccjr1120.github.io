---
slug: 49d3b7d0c02342748579a64dcb4a5782
date: 9/7/2024, 10:12:20 AM
desc: 从Pixi的渲染流程开始，了解Pixi的渲染原理。
---

```js
// Create the application helper and add its render target to the page
const app = new PIXI.Application()
await app.init({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x2c3e50
})
document.body.appendChild(app.canvas)

// Create the fillRect and add it to the stage
const fillRect = new Graphics().rect(0, 0, 200, 100).fill(0xff0000)
app.stage.addChild(fillRect)
```

在Pixi中，少了大部分2D图形库的Draw步骤。拿上面的代码来说：绑定画布-》添加子元素，就是我们所看到的Pixi的渲染流程了，它会直接在画布上绘制出矩形。但并不是在添加子元素的时候就立即绘制了。Pixi中有一个Ticker对象，它通过RAF（requestAnimationFrame）来驱动渲染，也就是每帧都会尝试去进行渲染。这种措施可能是由于Pixi的期望是一个游戏引擎。

## 内在逻辑

尽管Pixi是通过Ticker来驱动渲染，但Ticker几乎就是一个单纯的定时器，它也不知道渲染器的存在。  
Pixi在init的时候，会初始化一个渲染器，由于WebGPU是异步得到的，所以会产生一系列的异步效应。

```js
  public async init(options?: Partial<ApplicationOptions>)
    {
        // The default options
        options = { ...options };

        this.renderer = await autoDetectRenderer(options as ApplicationOptions) as R;

        // install plugins here
        Application._plugins.forEach((plugin) =>
        {
            plugin.init.call(this, options);
        });
    }
```

在这之后，App.render函数会被TickerPlugin调用Ticker.add的方法传入,然后被Ticker加入到渲染队列中。

```js
// TickerPlugin.init
set(ticker)
{
  if (this._ticker) {
    this._ticker.remove(this.render, this)
  }
  this._ticker = ticker
  if (ticker) {
    ticker.add(this.render, this, UPDATE_PRIORITY.LOW)
  }
}
// Ticker.add
public add<T = any>(fn: TickerCallback<T>, context?: T, priority: number = UPDATE_PRIORITY.NORMAL): this
{
    return this._addListener(new TickerListener(fn, context, priority));
}
```

至此，render便会由Ticker来触发了。同时，这篇文章也就到这里了。Ticker本身应该还有其操控队列的机制，但是这不是我所关心的，我的目的是找到Pixi使用WebGPU渲染的部分，如今从app.init出发，到这里基本上就找到了。

这个过程中，如今梳理起来还是挺简单的，但在我看源码的过程中，一直忽略了TickerPlugin用Object.defineProperty赋值的操作，以及没有转换过来其内部this的指向问题，导致我一直没有找到Ticker和Render直接接触，想不明白Ticker到底是如何触发的。还得多学多练。
