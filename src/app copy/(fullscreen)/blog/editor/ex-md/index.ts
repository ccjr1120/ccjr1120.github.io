import './index.css'
import setupEl from './func/setupEl'
import createStateManager, { type ExMdState } from './func/stateManager'
import createInteractionController, {
  type InteractionController
} from './func/interactionController'

export type { ExMdState, InteractionController }

type ExMdOptions = { el: HTMLElement }

export default function ExMd({ el }: ExMdOptions) {
  setupEl(el)

  // 创建状态管理器
  const {
    onStateChange,
    getCurrentState,
    destroy: destroyStateManager
  } = createStateManager(el)

  // 创建交互控制器
  const { destroy: destroyInteractionController } =
    createInteractionController(el)

  return {
    onStateChange,
    getCurrentState,
    destroy: () => {
      destroyStateManager()
      destroyInteractionController()
    }
  } as const
}

export type ExMdInstance = ReturnType<typeof ExMd>
