import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { Document } from 'langchain/document'

interface FileRes {
  fileName: string
  fileExtension: string
  fileId: string
}

const uploadDir = path.join(process.cwd(), 'uploads')

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
})

export default defineEventHandler(async (event) => {
  try {
    // Validate method
    assertMethod(event, 'POST')
    
    // Handle multipart form data
    const form = await readMultipartFormData(event)
    
    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      })
    }

    // Extract form fields
    let embeddingModel: string | undefined
    let embeddingModelProvider: string | undefined
    const fileFields: any[] = []

    for (const field of form) {
      if (field.name === 'embedding_model') {
        embeddingModel = field.data.toString()
      } else if (field.name === 'embedding_model_provider') {
        embeddingModelProvider = field.data.toString()
      } else if (field.name === 'files' && field.data) {
        fileFields.push({
          name: field.filename || 'unknown',
          data: field.data,
          type: field.type
        })
      }
    }

    if (!embeddingModel || !embeddingModelProvider) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing embedding model or provider'
      })
    }

    // Import utilities
    const { getAvailableEmbeddingModelProviders } = await import('~/utils/providers')

    // Get embedding models
    const embeddingModels = await getAvailableEmbeddingModelProviders()
    const provider = embeddingModelProvider ?? Object.keys(embeddingModels)[0]
    const selectedEmbeddingModel = embeddingModel ?? Object.keys(embeddingModels[provider])[0]

    const embeddingsModel = embeddingModels[provider]?.[selectedEmbeddingModel]?.model
    if (!embeddingsModel) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid embedding model selected'
      })
    }

    const processedFiles: FileRes[] = []

    // Process each file
    await Promise.all(
      fileFields.map(async (file: any) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase()
        
        if (!['pdf', 'docx', 'txt'].includes(fileExtension!)) {
          throw createError({
            statusCode: 400,
            statusMessage: `File type '${fileExtension}' not supported. Supported types: pdf, docx, txt`
          })
        }

        // Generate unique filename
        const uniqueFileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`
        const filePath = path.join(uploadDir, uniqueFileName)

        // Save file to disk
        fs.writeFileSync(filePath, file.data)

        let docs: any[] = []

        // Extract text based on file type
        if (fileExtension === 'pdf') {
          const loader = new PDFLoader(filePath)
          docs = await loader.load()
        } else if (fileExtension === 'docx') {
          const loader = new DocxLoader(filePath)
          docs = await loader.load()
        } else if (fileExtension === 'txt') {
          const text = fs.readFileSync(filePath, 'utf-8')
          docs = [
            new Document({ 
              pageContent: text, 
              metadata: { title: file.name } 
            }),
          ]
        }

        // Split documents into chunks
        const splitted = await splitter.splitDocuments(docs)

        // Save extracted text
        const extractedDataPath = filePath.replace(/\.\w+$/, '-extracted.json')
        fs.writeFileSync(
          extractedDataPath,
          JSON.stringify({
            title: file.name,
            contents: splitted.map((doc) => doc.pageContent),
          }),
        )

        // Generate embeddings
        const embeddings = await embeddingsModel.embedDocuments(
          splitted.map((doc) => doc.pageContent),
        )

        // Save embeddings
        const embeddingsDataPath = filePath.replace(/\.\w+$/, '-embeddings.json')
        fs.writeFileSync(
          embeddingsDataPath,
          JSON.stringify({
            title: file.name,
            embeddings,
          }),
        )

        processedFiles.push({
          fileName: file.name,
          fileExtension: fileExtension,
          fileId: uniqueFileName.replace(/\.\w+$/, ''),
        })
      }),
    )

    return {
      message: 'Files uploaded and processed successfully',
      files: processedFiles,
    }
    
  } catch (error) {
    console.error('Error uploading file:', error)
    
    // Re-throw createError instances
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error has occurred during file upload'
    })
  }
}) 