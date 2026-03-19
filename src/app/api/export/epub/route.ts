import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
// @ts-ignore
import nodepub from 'nodepub'

export async function POST(req: Request) {
    try {
        const { content, title, author, watermark } = await req.json()

        const metadata = {
            id: uuidv4(),
            title: title || 'Untitled Book',
            author: author || 'Unknown Author',
            genre: 'Non-Fiction',
            images: [],
            contents: [
                {
                    title: 'Chapter 1',
                    data: `
            ${watermark ? `<div style="text-align: center; color: #ccc; margin-bottom: 20px;">${watermark}</div>` : ''}
            ${content}
          `
                }
            ]
        }

        const epub = nodepub.document(metadata)
        const buffer = await epub.writeBuffer()

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/epub+zip',
                'Content-Disposition': `attachment; filename="${title}.epub"`,
            },
        })
    } catch (error) {
        console.error('EPUB generation error:', error)
        return NextResponse.json({ error: 'Failed to generate EPUB' }, { status: 500 })
    }
}
