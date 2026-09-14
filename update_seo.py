import os
import re

dir_path = 'src/content/services'
files = os.listdir(dir_path)

seo_data = {
    'cochlear-implant.md': {
        'title': 'Cochlear Implant Care & Rehabilitation | Joy of Hearing',
        'desc': 'Expert cochlear implant care, candidacy evaluation, mapping, and post-surgical rehabilitation at Joy of Hearing to restore your hearing.'
    },
    'myths-and-facts.md': {
        'title': 'Hearing Loss Myths and Facts | Joy of Hearing',
        'desc': 'Debunking common myths about hearing loss, hearing aids, and speech therapy. Learn the facts and get the right care at Joy of Hearing.'
    },
    'hearing-protection.md': {
        'title': 'Custom Hearing Protection & Earplugs | Joy of Hearing',
        'desc': 'Protect your hearing with custom earplugs and hearing protection for musicians, industrial workers, and swimmers at Joy of Hearing.'
    },
    'types-of-hearing-aids.md': {
        'title': 'Types of Hearing Aids & Styles | Joy of Hearing',
        'desc': 'Explore various types of hearing aids including BTE, RIC, ITC, CIC, and invisible styles. Find the perfect fit for your hearing loss today.'
    },
    'pediatric-audiology.md': {
        'title': 'Pediatric Audiology & Newborn Screening | Joy of Hearing',
        'desc': 'Specialized pediatric audiology and newborn hearing screening. Compassionate hearing care and early intervention for your child.'
    },
    'hearing-aid-brands.md': {
        'title': 'Top Hearing Aid Brands | Joy of Hearing',
        'desc': 'We offer the best hearing aid brands including Phonak, Signia, Resound, Widex, and Starkey. Get premium devices with advanced technology.'
    },
    'tinnitus-management.md': {
        'title': 'Tinnitus Management & Treatment | Joy of Hearing',
        'desc': 'Find relief from ringing ears with our expert tinnitus management and sound therapy solutions tailored to your specific needs.'
    },
    'speech-therapy.md': {
        'title': 'Speech Therapy Services for All Ages | Joy of Hearing',
        'desc': 'Professional speech therapy and language pathology for children and adults. Overcome communication challenges with personalized care.'
    },
    'hearing-assessment.md': {
        'title': 'Comprehensive Hearing Assessment & Tests | Joy of Hearing',
        'desc': 'Book a comprehensive hearing assessment at Joy of Hearing. We offer pure tone audiometry, tympanometry, and expert audiological evaluations.'
    },
    'hearing-aids.md': {
        'title': 'Premium Hearing Aids & Fitting Services | Joy of Hearing',
        'desc': 'Discover premium hearing aids, expert fitting, trials, and maintenance at Joy of Hearing. Top brands and technology for your hearing loss.'
    }
}

for filename, seo in seo_data.items():
    filepath = os.path.join(dir_path, filename)
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'seoTitle' in content:
        continue # Already processed
        
    # Inject after slug
    new_content = re.sub(
        r'(slug: "[^"]*"\n)', 
        f'\\g<1>seoTitle: "{seo["title"]}"\nseoDescription: "{seo["desc"]}"\n', 
        content
    )
    
    with open(filepath, 'w') as f:
        f.write(new_content)

print("Updated SEO fields in markdown files.")
