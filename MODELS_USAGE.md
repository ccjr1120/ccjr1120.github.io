# 3D 模型加载方式说明

现在你的项目支持两种方式来加载 3D 模型，不再需要通过 API 来获取模型列表。

## 方式一：静态模型列表（推荐）

这是最简单和可靠的方式，直接在代码中定义模型文件列表。

### 使用步骤：

1. **添加模型文件**：将你的 3D 模型文件放到 `public/models/` 目录下

2. **更新模型列表**：在 `src/app/models/page.tsx` 中的 `getModels()` 函数里添加文件名：

```typescript
const getModels = (): Model[] => {
  const modelFiles = [
    'sample-model.glb',
    'cube.glb',
    'sphere.gltf',
    'your-new-model.glb',  // 添加你的新模型
    // 继续添加更多模型...
  ];
  // ...
};
```

3. **刷新页面**：保存文件后刷新浏览器即可看到新模型

### 优点：
- ✅ 简单可靠
- ✅ 构建时确定，性能好
- ✅ 不需要额外配置
- ✅ 支持所有部署环境

## 方式二：动态模型发现

这种方式可以自动发现 `public/models/` 目录下的模型文件。

### 使用步骤：

1. **使用动态版本**：将 `src/app/models/dynamic-models.tsx` 重命名为 `page.tsx` 来替换当前版本

2. **添加模型文件**：直接将模型文件放到 `public/models/` 目录下

3. **自动发现**：页面会自动发现并显示所有支持的模型文件

### 工作原理：
- 首先尝试使用 webpack 的 `require.context`（可能需要额外配置）
- 如果不可用，则通过 API 路由 `/api/models-list` 动态读取文件
- 最后回退到静态列表

### 优点：
- ✅ 自动发现新文件
- ✅ 不需要手动更新代码

### 缺点：
- ❌ 需要服务器端支持（不适用于静态部署）
- ❌ 可能需要额外的 webpack 配置

## 支持的文件格式

- `.glb` (推荐) - GLTF 二进制格式，文件小，加载快
- `.gltf` - GLTF JSON 格式
- `.obj` - Wavefront OBJ 格式
- `.fbx` - Autodesk FBX 格式

## 文件命名建议

- 使用英文文件名，避免中文和特殊字符
- 使用小写字母和连字符：`my-model.glb`
- 避免空格：使用 `space_ship.glb` 而不是 `space ship.glb`

## 目录结构

```
your-project/
├── public/
│   └── models/
│       ├── README.md
│       ├── sample-model.glb
│       ├── cube.glb
│       └── your-model.glb
├── src/
│   └── app/
│       ├── models/
│       │   ├── page.tsx (静态版本)
│       │   └── dynamic-models.tsx (动态版本)
│       └── api/
│           └── models-list/
│               └── route.ts (API 路由)
```

## 性能优化建议

1. **使用 GLB 格式**：相比 GLTF，GLB 文件更小，加载更快
2. **压缩模型**：使用工具如 gltf-pipeline 来压缩模型
3. **合理的文件大小**：建议单个模型文件不超过 10MB
4. **预加载**：对于重要模型，可以考虑预加载

## 故障排除

### 模型不显示
1. 检查文件路径是否正确
2. 确认文件格式是否支持
3. 查看浏览器控制台是否有错误信息
4. 确认模型文件没有损坏

### 加载缓慢
1. 检查模型文件大小
2. 考虑使用 GLB 格式
3. 压缩模型文件
4. 检查网络连接

现在你可以选择最适合你项目需求的方式来管理 3D 模型了！ 