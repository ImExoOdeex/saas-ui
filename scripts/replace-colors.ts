import fs from 'fs'
import path from 'path'

const colorMappings: Record<string, string> = {
  '#FFFFFF': 'var(--chakra-colors-bg)',
  '#F8F8F8': 'var(--chakra-colors-bg-muted)',
  '#F2F2F2': 'var(--chakra-colors-bg-subtle)',

  '#E7E7E8': 'var(--chakra-colors-gray-100)',
  '#E5E5E5': 'var(--chakra-colors-gray-200)',
  '#D3D4D5': 'var(--chakra-colors-gray-300)',
  '#ABADAF': 'var(--chakra-colors-gray-400)',
  '#CCCCCC': 'var(--chakra-colors-gray-500)',
  '#8952E0': 'var(--chakra-colors-accent-solid)',
  '#B795EC': 'var(--chakra-colors-accent-fg)',

  '#000000': 'var(--chakra-colors-fg)',
  '#333333': 'var(--chakra-colors-fg-emphasized)',
  '#666666': 'var(--chakra-colors-fg-subtle)',
  '#999999': 'var(--chakra-colors-fg-muted)',
  '#4A4A4A': 'var(--chakra-colors-fg-disabled)',

  '#0070F3': 'var(--chakra-colors-accent-solid)',
  '#0063D1': 'var(--chakra-colors-accent-solid-hover)',
  '#004D9E': 'var(--chakra-colors-accent-solid-active)',
  '#3291FF': 'var(--chakra-colors-accent-subtle)',
  '#E6F1FF': 'var(--chakra-colors-accent-muted)',
  '#B3D4FF': 'var(--chakra-colors-accent-highlight)',

  '#E53E3E': 'var(--chakra-colors-border-error)',
  '#FBC434': 'var(--chakra-colors-border-warning)',
  '#38A169': 'var(--chakra-colors-border-success)',
  '#0EA371': 'var(--chakra-colors-border-success-hover)',
  '#2C7A7B': 'var(--chakra-colors-border-info)',

  '#F9FAFA': 'var(--chakra-colors-neutral-100)',
  '#EDEDED': 'var(--chakra-colors-neutral-200)',
  '#DCDCDC': 'var(--chakra-colors-neutral-300)',
}

const illustrationsDir = path.join(process.cwd(), 'illustrations')

const newIllustrationsDir = path.join(process.cwd(), 'new-illustrations')
if (!fs.existsSync(newIllustrationsDir)) {
  fs.mkdirSync(newIllustrationsDir, { recursive: true })
}

// process a single file
function processFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    let modifiedContent = content

    // Replace each color with its corresponding token
    Object.entries(colorMappings).forEach(([color, token]) => {
      const regex = new RegExp(color, 'gi')
      modifiedContent = modifiedContent.replace(regex, token)
    })

    const newFilePath = path.join(newIllustrationsDir, path.basename(filePath))
    fs.writeFileSync(newFilePath, modifiedContent, 'utf-8')
    console.log(`Processed: ${filePath}`)
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error)
  }
}

function processDirectory(directory: string) {
  const files = fs.readdirSync(directory)

  files.forEach((file) => {
    const filePath = path.join(directory, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      processDirectory(filePath)
    } else if (
      file.endsWith('.svg') ||
      file.endsWith('.jsx') ||
      file.endsWith('.tsx')
    ) {
      processFile(filePath)
    }
  })
}

// Main execution
processDirectory(illustrationsDir)
