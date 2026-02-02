/**
 * Script to convert PPTX files to slide images using LibreOffice
 * Run with: node scripts/generate-slides.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const presentations = require('../src/data/presentations.json');

const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'presentations');
const TEMP_DIR = path.join(__dirname, '..', '.temp-slides');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function convertPptxToImages(presentation) {
  const { slug, sourcePath } = presentation;
  const outputDir = path.join(PUBLIC_DIR, slug);
  
  // Skip if already generated
  if (fs.existsSync(outputDir) && fs.readdirSync(outputDir).length > 0) {
    console.log(`✓ Slides for "${slug}" already exist, skipping...`);
    return fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg')).length;
  }
  
  console.log(`Converting: ${presentation.title}...`);
  
  if (!fs.existsSync(sourcePath)) {
    console.error(`✗ Source file not found: ${sourcePath}`);
    return 0;
  }
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const tempPdfDir = path.join(TEMP_DIR, slug);
  if (!fs.existsSync(tempPdfDir)) {
    fs.mkdirSync(tempPdfDir, { recursive: true });
  }
  
  try {
    // Step 1: Convert PPTX to PDF using LibreOffice
    console.log('  → Converting to PDF...');
    execSync(`soffice --headless --convert-to pdf --outdir "${tempPdfDir}" "${sourcePath}"`, {
      stdio: 'pipe'
    });
    
    // Find the generated PDF
    const pdfFiles = fs.readdirSync(tempPdfDir).filter(f => f.endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      throw new Error('PDF conversion failed - no PDF generated');
    }
    const pdfPath = path.join(tempPdfDir, pdfFiles[0]);
    
    // Step 2: Convert PDF pages to JPEG images
    console.log('  → Extracting slides as images...');
    execSync(`pdftoppm -jpeg -r 150 "${pdfPath}" "${path.join(outputDir, 'slide')}"`, {
      stdio: 'pipe'
    });
    
    // Rename files from slide-1.jpg to slide-1.jpg (already correct format)
    const slideFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
    console.log(`  ✓ Generated ${slideFiles.length} slides`);
    
    return slideFiles.length;
  } catch (error) {
    console.error(`  ✗ Error converting ${slug}:`, error.message);
    return 0;
  }
}

async function updatePresentationsData(slideCountMap) {
  const dataPath = path.join(__dirname, '..', 'src', 'data', 'presentations.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  for (const pres of data) {
    const slideCount = slideCountMap[pres.slug] || 0;
    pres.slideCount = slideCount;
    pres.thumbnail = `/presentations/${pres.slug}/slide-1.jpg`;
  }
  
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log('\n✓ Updated presentations.json with slide counts');
}

async function main() {
  console.log('=== Generating Presentation Slides ===\n');
  
  const slideCountMap = {};
  
  for (const pres of presentations) {
    const count = await convertPptxToImages(pres);
    slideCountMap[pres.slug] = count;
  }
  
  await updatePresentationsData(slideCountMap);
  
  // Cleanup temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  
  console.log('\n=== Done! ===');
}

main().catch(console.error);
