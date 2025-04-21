import fs from 'fs'
import path from 'path'

const NEW_ILLUSTRATIONS_DIR = './new-illustrations'
const TARGET_DIR = './apps/website/components/new-illustrations'

async function getComponentExport(filePath: string): Promise<string | null> {
  try {
    const component = await import(path.resolve(filePath))
    const namedExports = Object.keys(component).filter(
      (key) => key !== 'default',
    )
    return namedExports[0] || null
  } catch (error) {
    console.error(`Error importing ${filePath}:`, error)
    return null
  }
}

async function replaceIllustrations() {
  if (!fs.existsSync(NEW_ILLUSTRATIONS_DIR)) {
    console.error(`Source directory ${NEW_ILLUSTRATIONS_DIR} does not exist`)
    return
  }

  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`Target directory ${TARGET_DIR} does not exist`)
    return
  }

  // get all SVG files from source directory
  const sourceFiles = fs
    .readdirSync(NEW_ILLUSTRATIONS_DIR)
    .filter((file) => file.endsWith('.svg'))

  // process each source file
  for (const sourceFile of sourceFiles) {
    const sourcePath = path.join(NEW_ILLUSTRATIONS_DIR, sourceFile)

    const splitted = sourceFile.replace('.svg', '').split('-')
    const con = splitted.slice(0, -1).join('-')
    const full = `${con.toLowerCase()}.tsx`
    const targetPath = path.join(TARGET_DIR, full)

    // console.log({
    //   sourcePath,
    //   targetPath,
    // })
    if (!fs.existsSync(targetPath)) {
      console.warn(`Target file ${targetPath} does not exist, skipping...`)
      continue
    }

    // get the export name from the component
    const exportName = await getComponentExport(targetPath)
    if (!exportName) {
      console.warn(
        `Could not find export name in target file ${full}, skipping...`,
      )
      continue
    }

    const newSvgContent = fs.readFileSync(sourcePath, 'utf-8')

    const newComponentContent = `export const ${exportName} = () => (
  ${newSvgContent}
);`

    fs.writeFileSync(targetPath, newComponentContent)
    console.log(
      `Successfully replaced ${sourceFile} with export name ${exportName}`,
    )
  }
}

// Run the script
replaceIllustrations().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
