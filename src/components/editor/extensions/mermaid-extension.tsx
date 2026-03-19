import { Node, mergeAttributes } from '@tiptap/core'
import mermaid from 'mermaid'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { PenTool } from 'lucide-react'

mermaid.initialize({ startOnLoad: false, theme: 'default' })

const MermaidComponent = ({ node, updateAttributes, editor }: any) => {
    const [showEdit, setShowEdit] = useState(false)
    const [code, setCode] = useState(node.attrs.code)
    const [svg, setSvg] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const renderDiagram = async () => {
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
                const { svg } = await mermaid.render(id, node.attrs.code)
                setSvg(svg)
            } catch (error) {
                console.error('Mermaid render error:', error)
                setSvg('<div class="text-red-500">Invalid Mermaid Syntax</div>')
            }
        }
        renderDiagram()
    }, [node.attrs.code])

    const handleSave = () => {
        updateAttributes({ code })
        setShowEdit(false)
    }

    return (
        <NodeViewWrapper className="mermaid-wrapper relative group my-4">
            <div
                className="mermaid-container flex justify-center p-4 bg-muted/20 rounded-lg border border-border"
                dangerouslySetInnerHTML={{ __html: svg }}
            />

            {editor.isEditable && (
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                        setCode(node.attrs.code)
                        setShowEdit(true)
                    }}
                >
                    <PenTool className="h-4 w-4 mr-2" />
                    Edit Diagram
                </Button>
            )}

            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Mermaid Diagram</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="font-mono min-h-[200px]"
                            placeholder="Enter Mermaid syntax..."
                        />
                        <div className="mt-2 text-xs text-muted-foreground">
                            Example: <br />
                            graph TD;<br />
                            A--&gt;B;
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </NodeViewWrapper>
    )
}

export const MermaidExtension = Node.create({
    name: 'mermaid',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            code: {
                default: 'graph TD;\nA[Start] --> B[End];',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="mermaid"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'mermaid' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidComponent)
    },
})
