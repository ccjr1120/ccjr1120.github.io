import { Editor as MilkdownCore, rootCtx, defaultValueCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import { nord } from '@milkdown/theme-nord'
import { headingExitPlugin } from './headingExitPlugin'
import { headingMarkerPlugin } from './headingMarkerPlugin'
import { tabIndentPlugin } from './tabIndentPlugin'

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

function MilkdownEditor({ content, onChange }: EditorProps) {
  useEditor((root) =>
    MilkdownCore.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, content)
        ctx.get(listenerCtx).markdownUpdated((_, markdown, prev) => {
          if (markdown !== prev) onChange(markdown)
        })
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(listener)
      .use(headingExitPlugin)
      .use(headingMarkerPlugin)
      .use(tabIndentPlugin),
  )

  return <Milkdown />
}

export default function Editor({ content, onChange }: EditorProps) {
  return (
    <div className="editor-scroll flex-1 overflow-y-auto">
      <div className="editor-page mx-auto w-full max-w-[1100px] px-12 pb-16 pt-2">
        <MilkdownProvider>
          <MilkdownEditor content={content} onChange={onChange} />
        </MilkdownProvider>
      </div>
    </div>
  )
}
