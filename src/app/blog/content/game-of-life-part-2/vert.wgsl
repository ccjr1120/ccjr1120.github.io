@vertex
fn vertexMain(@location(0) pos : vec2f,
@builtin(instance_index) instance : u32) ->
@builtin(position) vec4f {

  let grid = vec2f(32.0, 32.0);
  let i = f32(instance);
  //Compute the cell coordinate from the instance_index
  let cell = vec2f(i % grid.x, floor(i / grid.x));

  let cellOffset = cell / grid * 2;
  let gridPos = (pos + 1) / grid - 1 + cellOffset;

  return vec4f(gridPos, 0, 1);
}
