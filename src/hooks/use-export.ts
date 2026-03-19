import { useState } from 'react'
import html2pdf from 'html2pdf.js'

interface ExportOptions {
    title: string
    author: string
    watermark?: string
}

export const useExport = () => {
    const [isExporting, setIsExporting] = useState(false)

    const exportToPdf = async (elementId: string, options: ExportOptions) => {
        setIsExporting(true)
        try {
            const element = document.getElementById(elementId)
            if (!element) throw new Error('Element not found')

            // Clone the element to add watermark without affecting the editor
            const clone = element.cloneNode(true) as HTMLElement

            if (options.watermark) {
                const watermarkDiv = document.createElement('div')
                watermarkDiv.style.position = 'fixed'
                watermarkDiv.style.top = '50%'
                watermarkDiv.style.left = '50%'
                watermarkDiv.style.transform = 'translate(-50%, -50%) rotate(-45deg)'
                watermarkDiv.style.fontSize = '60px'
                watermarkDiv.style.color = 'rgba(0, 0, 0, 0.1)'
                watermarkDiv.style.pointerEvents = 'none'
                watermarkDiv.style.zIndex = '9999'
                watermarkDiv.innerText = options.watermark
                clone.appendChild(watermarkDiv)
            }

            const opt = {
                margin: 1,
                filename: `${options.title}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            } as any

            await html2pdf().set(opt).from(clone).save()
        } catch (error) {
            console.error('PDF Export failed:', error)
        } finally {
            setIsExporting(false)
        }
    }

    const exportToEpub = async (content: string, options: ExportOptions) => {
        setIsExporting(true)
        try {
            const response = await fetch('/api/export/epub', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    title: options.title,
                    author: options.author,
                    watermark: options.watermark
                }),
            })

            if (!response.ok) throw new Error('EPUB generation failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${options.title}.epub`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('EPUB Export failed:', error)
        } finally {
            setIsExporting(false)
        }
    }

    return {
        exportToPdf,
        exportToEpub,
        isExporting
    }
}
