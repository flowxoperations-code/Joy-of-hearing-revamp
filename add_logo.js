import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = '/Users/sunith/.gemini/antigravity/brain/88a53a8c-c751-43c8-ad63-cca6d289564f/';
const publicImagesDir = './public/images/';
const logoPath = path.join(publicImagesDir, 'logo-live.svg');

async function processImages() {
  try {
    const logoBuffer = await sharp(logoPath)
      .resize(300) // Slightly larger logo for visibility
      .toBuffer();

    const imageMap = {
      'clinic_hero': 'indian_clinic_hero_1778224461642.webp',
      'audiologist_consultation': 'indian_audiologist_consultation_1778224444440.webp',
      'pediatric_audiology': 'indian_pediatric_audiology_1778224477472.webp',
      'hearing_aid_macro': 'indian_hearing_aid_macro_1778224495407.webp',
      'cochlear_implant': 'indian_cochlear_implant_1778228428470.webp',
      'speech_therapy': 'indian_speech_therapy_1778228460846.webp',
      'tinnitus_management': 'indian_tinnitus_management_1778228477486.webp',
      'hearing_protection': 'indian_hearing_protection_1778228445455.webp',
      'patient_education': 'indian_patient_education_1778228521124.webp',
      'homepage_consultation': 'indian_homepage_consultation.webp'
    };

    const files = fs.readdirSync(brainDir);

    for (const [key, targetName] of Object.entries(imageMap)) {
      const generatedFile = files.find(f => f.startsWith(key + '_') && f.endsWith('.png'));
      if (generatedFile) {
        const inputPath = path.join(brainDir, generatedFile);
        const outputPath = path.join(publicImagesDir, targetName);
        
        console.log(`Processing ${inputPath} -> ${outputPath}`);
        
        await sharp(inputPath)
          .composite([
            {
              input: logoBuffer,
              gravity: 'northwest',
              top: 50,
              left: 50
            }
          ])
          .webp({ quality: 90 })
          .toFile(outputPath);
      }
    }
    
    // extra fallbacks
    const clinicHeroFile = files.find(f => f.startsWith('clinic_hero_') && f.endsWith('.png'));
    if (clinicHeroFile) {
        for(const extra of ['hero_clinic.webp', 'hero_clinic_1778158670914.webp']) {
            await sharp(path.join(brainDir, clinicHeroFile))
            .composite([{ input: logoBuffer, top: 50, left: 50 }])
            .webp({ quality: 90 })
            .toFile(path.join(publicImagesDir, extra));
        }
    }
    
    console.log("Done!");
  } catch (e) {
    console.error("Error:", e);
  }
}

processImages();
