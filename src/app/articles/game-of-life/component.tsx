export default function GameOfLifeArticle() {
  return (
    <div className="prose prose-lg mx-auto max-w-4xl">
      <h1>生命游戏算法实现</h1>
      
      <h2>前言</h2>
      <p>
        康威生命游戏（Conway&apos;s Game of Life）是一个经典的细胞自动机算法，
        由英国数学家约翰·康威在1970年发明。虽然被称为&ldquo;游戏&rdquo;，
        但它实际上是一个零玩家游戏，只需要初始状态就能自动演化。
      </p>
      
      <h2>游戏规则</h2>
      <p>生命游戏在一个二维网格上进行，每个格子代表一个细胞，细胞有两种状态：</p>
      <ul>
        <li><strong>存活</strong>：用黑色表示</li>
        <li><strong>死亡</strong>：用白色表示</li>
      </ul>
      
      <p>每个细胞与其周围的8个细胞相互作用，规则如下：</p>
      <ol>
        <li>存活的细胞周围有2或3个存活邻居时，该细胞继续存活</li>
        <li>存活的细胞周围存活邻居少于2个时，该细胞死亡（模拟人口稀少）</li>
        <li>存活的细胞周围存活邻居大于3个时，该细胞死亡（模拟人口过多）</li>
        <li>死亡的细胞周围有恰好3个存活邻居时，该细胞复活（模拟繁殖）</li>
      </ol>
      
      <h2>算法实现</h2>
      <p>下面是JavaScript实现的核心算法：</p>
      
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`class GameOfLife {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
  }
  
  createGrid() {
    return Array(this.height).fill().map(() => 
      Array(this.width).fill(0)
    );
  }
  
  countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        
        const newX = x + i;
        const newY = y + j;
        
        if (newX >= 0 && newX < this.height && 
            newY >= 0 && newY < this.width) {
          count += this.grid[newX][newY];
        }
      }
    }
    return count;
  }
  
  nextGeneration() {
    const newGrid = this.createGrid();
    
    for (let x = 0; x < this.height; x++) {
      for (let y = 0; y < this.width; y++) {
        const neighbors = this.countNeighbors(x, y);
        const currentCell = this.grid[x][y];
        
        if (currentCell === 1) {
          // 存活细胞
          if (neighbors === 2 || neighbors === 3) {
            newGrid[x][y] = 1; // 继续存活
          }
        } else {
          // 死亡细胞
          if (neighbors === 3) {
            newGrid[x][y] = 1; // 复活
          }
        }
      }
    }
    
    this.grid = newGrid;
  }
}`}</code>
      </pre>
      
      <h2>可视化实现</h2>
      <p>在浏览器中，我们可以使用Canvas API来可视化生命游戏：</p>
      
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`function drawGrid(ctx, game, cellSize) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  for (let x = 0; x < game.height; x++) {
    for (let y = 0; y < game.width; y++) {
      if (game.grid[x][y] === 1) {
        ctx.fillStyle = '#000';
        ctx.fillRect(y * cellSize, x * cellSize, cellSize, cellSize);
      }
    }
  }
}

function animate() {
  game.nextGeneration();
  drawGrid(ctx, game, cellSize);
  setTimeout(animate, 100); // 100ms间隔
}`}</code>
      </pre>
      
      <h2>经典模式</h2>
      <p>生命游戏中有许多有趣的模式，包括：</p>
      <ul>
        <li><strong>静物</strong>：不会改变的稳定模式，如方块、蜂巢</li>
        <li><strong>振荡器</strong>：周期性变化的模式，如闪烁器、蟾蜍</li>
        <li><strong>滑翔机</strong>：会在网格中移动的模式</li>
        <li><strong>滑翔机枪</strong>：周期性产生滑翔机的复杂模式</li>
      </ul>
      
      <h2>总结</h2>
      <p>
        生命游戏虽然规则简单，但能产生出极其复杂和美丽的模式。
        它展示了简单规则如何创造出复杂的行为，这一概念在计算机科学、
        生物学和数学等多个领域都有重要应用。通过编程实现生命游戏，
        我们不仅能学习算法和数据结构，还能深入理解复杂系统的基本原理。
      </p>
    </div>
  );
} 