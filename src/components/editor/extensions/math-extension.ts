import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core'
import katex from 'katex'

export interface MathExtensionOptions {
    HTMLAttributes: Record<string, any>
}

export const MathExtension = Node.create<MathExtensionOptions>({
    name: 'math',

    group: 'inline',

    inline: true,

    selectable: true,

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {
                class: 'math-node',
            },
        }
    },

    addAttributes() {
        return {
            latex: {
                default: 'E = mc^2',
                parseHTML: element => element.getAttribute('data-latex'),
                renderHTML: attributes => {
                    return {
                        'data-latex': attributes.latex,
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="math"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'math' })]
    },

    addNodeView() {
        return ({ node, getPos, editor }) => {
            const dom = document.createElement('span')
            dom.classList.add('math-node')
            dom.style.cursor = 'pointer'
            dom.style.padding = '0 4px'
            dom.style.borderRadius = '4px'
            dom.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'

            const renderMath = () => {
                try {
                    katex.render(node.attrs.latex, dom, {
                        throwOnError: false,
                        displayMode: false,
                    })
                } catch (e) {
                    dom.textContent = node.attrs.latex
                }
            }

            renderMath()

            dom.addEventListener('click', () => {
                if (!editor.isEditable) return

                const latex = prompt('Enter LaTeX equation:', node.attrs.latex)
                if (latex !== null) {
                    if (typeof getPos === 'function') {
                        editor.commands.command(({ tr }) => {
                            const pos = getPos()
                            if (typeof pos === 'number') {
                                tr.setNodeMarkup(pos, undefined, { latex })
                                return true
                            }
                            return false
                        })
                    }
                }
            })

            return {
                dom,
                update: (updatedNode) => {
                    if (updatedNode.type !== this.type) return false
                    node = updatedNode
                    renderMath()
                    return true
                },
            }
        }
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: /\$\$(.+)\$\$/,
                type: this.type,
                getAttributes: match => {
                    return {
                        latex: match[1],
                    }
                },
            }),
        ]
    },
})
