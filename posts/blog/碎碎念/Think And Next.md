---
slug: 46be5d8490e14e82a598481fc82b0f41
date: 12/14/2024, 4:55:30 PM
desc: 思考一下，然后下一步。
---

最近一段日子是有点忙，公司、搬家、回家、找老婆，所以一直都没什么时间。只是偶尔可以更新一下GPU Mesh，学习一下WebGPU的一些基础知识。

好消息来说，不管哪方面都是比较顺利的，GPU Mesh也基本上达到我的预期了，只是进军动画层面还需要一段时间，需要搞清楚如何调用WebGPU更新当前画面的状态，看看是否可以拿到上一次渲染的数据，然后再渲染下一帧。还是说这些都是使用JS去控制的，GPU只是渲染每次结果。 

下一步的话，理论上我可以开始编写Drftjs了，这是一个2D形状渲染库，甚至都不需要去抄pixi的代码，这要感谢我在编写GPUMesh过程中学到的，还有GPT。只是我还在犹豫，在我这段时间的接触中，我发现大家都是一种实用主义，而我有一点为了造轮子而造轮子。如果我目前想写一个编辑器，那么我去造drftjs是一个不错的选择，但我没有编辑器的目标。那我应该做什么呢？
1. 继续学习WebGPU，打造GPU Mesh，作出更多有意思的效果。
2. 往工作上延伸，去理解色彩理论，为即将到来的品牌色等概念做准备。
3. 硬写drftjs 

我觉得我会发展一下一二。