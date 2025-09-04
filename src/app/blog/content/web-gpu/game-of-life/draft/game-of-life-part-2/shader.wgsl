struct VertexOutput {
  @builtin(position) pos : vec4f,
  @location(0) color : vec4f,
}

@group(0) @binding(0) var<uniform> cells : array<vec4f, 1024>;
@vertex
fn vertexMain(@location(0) pos : vec2f,
@builtin(instance_index) instance : u32) -> VertexOutput {

  let grid = vec2f(32.0, 32.0);
  let i = f32(instance);

  //计算单元格坐标
  let cell = vec2f(i % grid.x, floor(i / grid.x));

  //计算位置偏移
  let cellOffset = cell / grid * 2.0 - 1.0;
  let gridPos = pos * 0.8 + cellOffset;

  //使用 instance_index 查找对应的状态
  let cellState = cells[instance];

  //基于状态生成颜色
  //cellState.x: 存活状态 (0.0 = 死亡, 1.0 = 存活)
  //cellState.y: 年龄或其他属性
  //cellState.z: 其他属性
  //cellState.w: 透明度

  var color = vec4f(0.0, 0.0, 0.0, 1.0);

  if (cellState.x > 0.5)
  {
    //存活状态 - 绿色系
    color = vec4f(0.2, 0.8, 0.3, cellState.w);
  } else {
    //死亡状态 - 红色系
    color = vec4f(0.8, 0.2, 0.2, cellState.w * 0.3);
  }



  return VertexOutput(vec4f(gridPos, 0, 1), color);
}

@fragment
fn fragmentMain(input : VertexOutput) -> @location(0) vec4f {
  return input.color;
}
