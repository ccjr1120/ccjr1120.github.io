# 模型生成脚本

## 概述

`generate-models.mjs` 脚本用于自动扫描 `public/models` 目录下的所有 3D 模型文件，并生成相应的 TypeScript 和 JSON 文件，供应用程序使用。

## 支持的文件格式

- `.glb` - GLTF Binary
- `.gltf` - GLTF JSON
- `.fbx` - Autodesk FBX
- `.obj` - Wavefront OBJ
- `.dae` - COLLADA
- `.3ds` - 3D Studio Max
- `.ply` - Polygon File Format
- `.stl` - STereoLithography

## 使用方法

### 1. 添加模型文件

将你的 3D 模型文件放入 `public/models/` 目录中。

### 2. 运行生成脚本

```bash
# 使用 npm 脚本
npm run generate-models

# 或直接运行
node scripts/generate-models.mjs
```

### 3. 生成的文件

脚本会在 `public/models/` 目录下生成两个文件：

- `models-list.ts` - TypeScript 文件，包含模型接口和导出函数
- `models-list.json` - JSON 文件，包含模型数据和统计信息

## 生成的数据结构

### TypeScript 接口

```typescript
export interface Model {
  name: string;        // 模型名称（不含扩展名）
  filename: string;    // 完整文件名
  extension: string;   // 文件扩展名（不含点号）
  url: string;         // 模型的 URL 路径
  path: string;        // 文件路径
  size: string;        // 文件大小（MB）
  createdTime: string; // 创建时间（ISO 字符串）
  lastModified: string; // 最后修改时间（ISO 字符串）
}
```

### 导出的函数

- `getModels()` - 获取所有模型列表
- `getModelByName(name: string)` - 根据名称获取特定模型
- `getModelsByExtension(extension: string)` - 根据扩展名筛选模型
- `MODELS_STATS` - 模型统计信息

## 在应用中使用

```typescript
import { Model, getModels, getModelByName } from '../../../public/models/models-list';

// 获取所有模型
const models = getModels();

// 获取特定模型
const chairModel = getModelByName('chair');

// 在组件中使用
const [models, setModels] = useState<Model[]>([]);

useEffect(() => {
  const loadedModels = getModels();
  setModels(loadedModels);
}, []);
```

## 自动化

你可以将此脚本集成到构建流程中：

1. **开发时自动运行**：在 `package.json` 的 `dev` 脚本中添加
2. **构建前运行**：在 `build` 脚本中添加
3. **Git hooks**：使用 husky 在提交前运行

## 特性

### 智能时间管理
- **创建时间保持**: 如果模型文件已存在于之前的JSON文件中，脚本会保留原有的创建时间
- **新文件检测**: 新添加的模型文件会使用文件系统的创建时间
- **分类显示**: 运行时会区分显示新增模型和已存在模型

### 输出示例
```
🔍 正在扫描 public/models 目录...
✅ 模型列表已生成: /path/to/public/models/models-list.ts
📊 发现 3 个模型文件:

🆕 新增模型 (1 个):
   + robot (GLB, 2.5 MB)

📁 已存在模型 (2 个):
   - chair (GLB, 0.25 MB)
   - table (GLTF, 1.8 MB)
```

## 注意事项

1. 生成的文件会被完全覆盖，请勿手动编辑
2. 确保模型文件名不包含特殊字符
3. 大文件可能会影响加载性能，建议优化模型大小
4. 脚本会自动按名称排序模型列表
5. 创建时间会从现有JSON文件中保留，确保时间戳的一致性

## 故障排除

### 脚本无输出
- 检查 `public/models` 目录是否存在
- 确认目录中有支持的模型文件

### 权限错误
- 确保脚本有读写权限
- 在 Windows 上可能需要以管理员身份运行

### 模型不显示
- 检查文件路径是否正确
- 确认模型文件格式受支持
- 查看浏览器控制台的错误信息 