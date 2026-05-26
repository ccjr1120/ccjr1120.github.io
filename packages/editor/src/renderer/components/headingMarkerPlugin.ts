import { Plugin, PluginKey } from '@milkdown/prose/state'
import { Decoration, DecorationSet } from '@milkdown/prose/view'
import { $prose } from '@milkdown/utils'

export const headingMarkerPlugin = $prose(
  () =>
    new Plugin({
      key: new PluginKey('heading-marker'),
      props: {
        decorations(state) {
          const { $from } = state.selection
          const node = $from.parent
          if (node.type.name !== 'heading') return null
          const pos = $from.before()
          return DecorationSet.create(state.doc, [
            Decoration.node(pos, pos + node.nodeSize, {
              class: 'is-current-heading',
            }),
          ])
        },
      },
    }),
)
