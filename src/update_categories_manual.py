import os
import re

manual_mapping = {
    "5-jan-25.md": "Communication Tips",
    "9-feb-25.md": "Hearing Protection",
    "23-dec-24.md": "Child Development",
    "21-mar-25.md": "Hearing Protection",
    "vestibular-disorders-and-their-impact-on-daily-life.md": "Balance Disorders",
    "the-benefits-of-post-fitting-hearing-aid-counseling-for-first-time-users.md": "Hearing Aids",
    "guide-to-hearing-protection.md": "Hearing Protection",
    "how-hearing-aids-work.md": "Hearing Aids",
    "6-signs-elderly-parent-losing-hearing.md": "Hearing Loss",
    "15-mar-25.md": "Hearing Protection",
    "tips-for-getting-the-most-out-of-your-post-fitting-hearing-aid-counseling-sessions.md": "Hearing Aids",
    "How-Vestibular-Disorders-Disrupt-Balance-and-Coordination.md": "Balance Disorders",
    "tips-for-talking-to-someone-who-has-a-speech-or-language-disorder.md": "Speech Therapy",
    "coping-with-anxiety-and-depression-in-vestibular-disorder-patients.md": "Balance Disorders",
    "the-crucial-role-of-family-in-the-speech-therapy-journey-of-children.md": "Speech Therapy",
    "cochlear-implants.md": "Cochlear Implants",
    "hearing-loss-medications-rehabilitation.md": "Hearing Loss",
    "speech-therapy.md": "Speech Therapy",
    "maximizing-your-investment.md": "Hearing Aids"
}

blog_dir = '/Users/sunith/Documents/FlowX-Projects/Joy-of-hearing-revamp/src/content/blogs'

for file_name, category in manual_mapping.items():
    file_path = os.path.join(blog_dir, file_name)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if 'category:' exists
        if re.search(r'^category:\s*.*$', content, re.MULTILINE):
            new_content = re.sub(r'^category:\s*.*$', f"category: '{category}'", content, flags=re.MULTILINE)
        else:
            new_content = re.sub(r'(^---.*?)^title:', r"\1category: '{category}'\ntitle:", content, flags=re.DOTALL|re.MULTILINE)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Manually updated {file_name}: {category}")

