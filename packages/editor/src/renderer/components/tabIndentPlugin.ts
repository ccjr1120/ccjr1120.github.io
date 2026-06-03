import { keymap } from '@milkdown/prose/keymap'
import { $prose } from '@milkdown/utils'

const TAB_SPACES = '    '

export const tabIndentPlugin = $prose(() =>
  keymap({
    Tab: (state, dispatch) => {
      const { $from } = state.selection
      const parentName = $from.parent.type.name
      if (parentName === 'list_item' || parentName === 'code_block') return false
      if (dispatch) {
        dispatch(state.tr.insertText(TAB_SPACES).scrollIntoView())
      }
      return true
    },
  }),
)
