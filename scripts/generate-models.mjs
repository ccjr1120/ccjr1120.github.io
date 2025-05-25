import fs from 'fs';
import path from 'path';

// 支持的3D模型文件扩展名
const SUPPORTED_EXTENSIONS = ['.glb', '.gltf', '.fbx', '.obj', '.dae', '.3ds', '.ply', '.stl'];

// 读取现有的JSON文件以获取创建时间
function loadExistingModelsData() {
  const jsonPath = path.join(process.cwd(), 'public', 'models', 'models-list.json');
  
  if (!fs.existsSync(jsonPath)) {
    return {};
  }
  
  try {
    const content = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(content);
    
    // 创建一个以文件名为键的映射，方便查找
    const existingModels = {};
    if (data.models && Array.isArray(data.models)) {
      data.models.forEach(model => {
        existingModels[model.filename] = model;
      });
    }
    
    return existingModels;
  } catch (error) {
    console.warn('⚠️ 无法读取现有的模型数据文件:', error.message);
    return {};
  }
}

// 扫描models目录
function scanModelsDirectory() {
  const modelsDir = path.join(process.cwd(), 'public', 'models');
  
  if (!fs.existsSync(modelsDir)) {
    console.error('Models directory does not exist:', modelsDir);
    return [];
  }

  const files = fs.readdirSync(modelsDir);
  const models = [];
  const existingModels = loadExistingModelsData();

  files.forEach(filename => {
    const filePath = path.join(modelsDir, filename);
    const stat = fs.statSync(filePath);
    
    // 只处理文件，跳过目录
    if (stat.isFile()) {
      const ext = path.extname(filename).toLowerCase();
      
      // 检查是否是支持的3D模型格式
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        const name = path.basename(filename, ext);
        const stats = fs.statSync(filePath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        // 检查是否已存在，如果存在则保留原有的创建时间
        const existingModel = existingModels[filename];
        const createdTime = existingModel?.createdTime || stats.birthtime.toISOString();
        
        models.push({
          name: name,
          filename: filename,
          extension: ext.substring(1), // 移除点号
          url: `/models/${filename}`,
          path: filename,
          size: `${sizeInMB} MB`,
          createdTime: createdTime,
          lastModified: stats.mtime.toISOString()
        });
      }
    }
  });

  return models.sort((a, b) => a.name.localeCompare(b.name));
}

// 生成TypeScript接口和模型列表
function generateModelsFile() {
  const models = scanModelsDirectory();
  const existingModels = loadExistingModelsData();
  
  const content = `// 此文件由 scripts/generate-models.mjs 自动生成
// 请勿手动编辑

export interface Model {
  name: string;
  filename: string;
  extension: string;
  url: string;
  path: string;
  size: string;
  createdTime: string;
  lastModified: string;
}

export const MODELS: Model[] = ${JSON.stringify(models, null, 2)};

export const getModels = (): Model[] => {
  return MODELS;
};

export const getModelByName = (name: string): Model | undefined => {
  return MODELS.find(model => model.name === name);
};

export const getModelsByExtension = (extension: string): Model[] => {
  return MODELS.filter(model => model.extension === extension);
};

// 统计信息
export const MODELS_STATS = {
  total: ${models.length},
  extensions: ${JSON.stringify([...new Set(models.map(m => m.extension))], null, 2)},
  totalSize: "${models.reduce((sum, model) => sum + parseFloat(model.size), 0).toFixed(2)} MB"
};
`;

  const outputPath = path.join(process.cwd(), 'public', 'models', 'models-list.ts');
  fs.writeFileSync(outputPath, content, 'utf8');
  
  console.log(`✅ 模型列表已生成: ${outputPath}`);
  console.log(`📊 发现 ${models.length} 个模型文件:`);
  
  // 分类显示新增和已存在的模型
  const newModels = [];
  const existingModelsList = [];
  
  models.forEach(model => {
    if (existingModels[model.filename]) {
      existingModelsList.push(model);
    } else {
      newModels.push(model);
    }
  });
  
  if (newModels.length > 0) {
    console.log(`🆕 新增模型 (${newModels.length} 个):`);
    newModels.forEach(model => {
      console.log(`   + ${model.name} (${model.extension.toUpperCase()}, ${model.size})`);
    });
  }
  
  if (existingModelsList.length > 0) {
    console.log(`📁 已存在模型 (${existingModelsList.length} 个):`);
    existingModelsList.forEach(model => {
      console.log(`   - ${model.name} (${model.extension.toUpperCase()}, ${model.size})`);
    });
  }
  
  return models;
}

// 生成JSON格式的模型列表（可选）
function generateModelsJson() {
  const models = scanModelsDirectory();
  const outputPath = path.join(process.cwd(), 'public', 'models', 'models-list.json');
  
  fs.writeFileSync(outputPath, JSON.stringify({
    models: models,
    stats: {
      total: models.length,
      extensions: [...new Set(models.map(m => m.extension))],
      totalSize: `${models.reduce((sum, model) => sum + parseFloat(model.size), 0).toFixed(2)} MB`,
      lastGenerated: new Date().toISOString()
    }
  }, null, 2), 'utf8');
  
  console.log(`✅ JSON模型列表已生成: ${outputPath}`);
}

// 主函数
function main() {
  console.log('🔍 正在扫描 public/models 目录...');
  
  try {
    generateModelsFile();
    generateModelsJson();
    console.log('🎉 模型列表生成完成！');
  } catch (error) {
    console.error('❌ 生成模型列表时出错:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  main();
}

export {
  scanModelsDirectory,
  generateModelsFile,
  generateModelsJson,
  main
}; 