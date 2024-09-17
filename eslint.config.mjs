import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    ...compat.extends('next/core-web-vitals')[0],
    files: ['packages/io/**/*'],
    settings: {
      next: {
        rootDir: 'packages/io/'
      }
    }
  },
  {
    languageOptions: {
      parser: tsParser
    },
    ignores: ['node_modules', 'dist/**', 'out/**'],
    settings: {
      react: {
        version: '18'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off'
    }
  }
]
