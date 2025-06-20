import setupEl from './func/setupEl'
import createStateManager, { type ExMdState } from './func/stateManager'

export type { ExMdState }

type ExMdOptions = { el: HTMLElement }

export default function ExMd({ el }: ExMdOptions) {
  setupEl(el)

  // 创建状态管理器
  const { onStateChange, getCurrentState, destroy } = createStateManager(el)

  return {
    onStateChange,
    getCurrentState,
    destroy
  } as const
}

export type ExMdInstance = ReturnType<typeof ExMd>
