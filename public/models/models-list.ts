// 此文件由 scripts/generate-models.mjs 自动生成
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

export const MODELS: Model[] = [
  {
    "name": "chair",
    "filename": "chair.glb",
    "extension": "glb",
    "url": "/models/chair.glb",
    "path": "chair.glb",
    "size": "0.25 MB",
    "createdTime": "2025-05-25T04:42:54.592Z",
    "lastModified": "2025-05-25T04:38:38.469Z"
  }
];

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
  total: 1,
  extensions: [
  "glb"
],
  totalSize: "0.25 MB"
};
