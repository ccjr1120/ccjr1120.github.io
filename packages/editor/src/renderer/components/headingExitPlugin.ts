import { keymap } from '@milkdown/prose/keymap'
import { TextSelection } from '@milkdown/prose/state'
import { $prose } from '@milkdown/utils'

export const headingExitPlugin = $prose(() =>
  keymap({
    Enter: (state, dispatch) => {
      const { $from, empty } = state.selection
      if (!empty) return false
      const node = $from.parent
      if (node.type.name !== 'heading') return false
      if ($from.parentOffset !== node.content.size) return false
      const paragraphType = state.schema.nodes.paragraph
      if (!paragraphType) return false
      if (dispatch) {
        const pos = $from.after()
        const tr = state.tr.insert(pos, paragraphType.create())
        tr.setSelection(TextSelection.create(tr.doc, pos + 1))
        dispatch(tr.scrollIntoView())
      }
      return true
    },
    Backspace: (state, dispatch) => {
      const { $from, empty } = state.selection
      if (!empty) return false
      const node = $from.parent
      if (node.type.name !== 'heading') return false
      if ($from.parentOffset !== 0) return false
      const paragraphType = state.schema.nodes.paragraph
      if (!paragraphType) return false
      if (dispatch) {
        const tr = state.tr.setBlockType($from.before(), $from.after(), paragraphType)
        dispatch(tr.scrollIntoView())
      }
      return true
    },
  }),
)
