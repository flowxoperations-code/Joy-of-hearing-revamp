import os
import re

mapping_text = """
1
Hearing Loss and its Solution
Hearing Loss
2
Living with Tinnitus
Tinnitus
3
The Hidden Consequences of Hearing Loss
Hearing Loss
4
Debunking Common Misconceptions about Hearing Loss
Hearing Loss
5
Speech Therapy for Children
Speech Therapy
6
Hearing Aid Technology and Innovations
Hearing Aids
7
Communication Tips for Hearing Loss
Communication Tips
8
Family Role in Speech Therapy
Speech Therapy
9
The Critical Importance of Early Intervention
Child Development
10
Types of Hearing Loss
Hearing Loss
11
Diabetes and Hearing Loss
Medical Conditions
12
Hearing Aids and Assistive Devices
Hearing Aids
13
Hearing Aid Trials
Hearing Aids
14
Cochlear Implants Overview
Cochlear Implants
15
Speech Therapy for Stuttering
Speech Therapy
16
Protecting Your Hearing in Noisy Environments
Hearing Protection
17
Hearing Protection for Musicians
Hearing Protection
18
Signs of Hearing Damage
Hearing Loss
19
Noise-Induced Hearing Loss and Mental Health
Hearing Protection
20
Hearing Protection for Children
Child Development
21
Hearing Aid Maintenance
Hearing Aids
22
Hearing Aids and Exercise
Hearing Aids
23
What is Meniere's Disease?
Balance Disorders
24
Meniere's Disease and Mental Health
Balance Disorders
25
Understanding Sudden Hearing Loss
Hearing Loss
26
Stress and Sudden Hearing Loss
Medical Conditions
27
Post-Fitting Counseling for Hearing Aids
Hearing Aids
28
Tips for Hearing Aid Counseling Sessions
Hearing Aids
29
Benefits of Hearing Aid Counseling
Hearing Aids
30
Talking to Someone with Speech Disorder
Speech Therapy
31
Types and Symptoms of Vestibular Disorders
Balance Disorders
32
Vestibular Disorders and Balance
Balance Disorders
33
Vestibular Rehabilitation Therapy
Balance Disorders
34
Anxiety and Depression in Vestibular Disorders
Balance Disorders
35
Vestibular Disorders and Daily Life
Balance Disorders
36
Managing Vertigo and Dizziness
Balance Disorders
37
Guide to Ear Molds
Hearing Aids
38
Choosing Custom Ear Mold
Hearing Aids
39
Caring for Ear Molds
Hearing Aids
40
Troubleshooting Ear Molds
Hearing Aids
41
Understanding Specific Language Delay
Speech Therapy
42
Speech Therapy for Language Delay
Speech Therapy
43
Customized Speech Therapy Plans
Speech Therapy
44
Treatment Options for Sudden Hearing Loss
Hearing Loss
45
Impact of Sudden Hearing Loss on Daily Life
Hearing Loss
46
Truth About Learning Disabilities
Learning Disabilities
47
Signs of Learning Disabilities in Children
Learning Disabilities
48
Confidence in Children with Learning Disabilities
Learning Disabilities
49
Learning Disabilities and Daily Life
Learning Disabilities
50
Speech Therapy for Learning Disabilities
Learning Disabilities
51
Understanding Dysphagia
Swallowing Disorders
52
Dysphagia and Aging
Swallowing Disorders
53
Living with Dysphagia
Swallowing Disorders
54
Speech Therapy in Dysphagia
Swallowing Disorders
"""

lines = [line.strip() for line in mapping_text.strip().split('\n') if line.strip()]
title_to_category = {}
for i in range(0, len(lines), 3):
    if i + 2 < len(lines):
        title = lines[i+1].lower().strip()
        category = lines[i+2].strip()
        title_to_category[title] = category

blog_dir = '/Users/sunith/Documents/FlowX-Projects/Joy-of-hearing-revamp/src/content/blogs'

import glob

files = glob.glob(os.path.join(blog_dir, '*.md'))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract title from frontmatter
    match = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', content, re.MULTILINE | re.IGNORECASE)
    if not match:
        continue
    
    file_title = match.group(1).lower().strip()
    
    # Find matching category
    best_match = None
    # exact match
    if file_title in title_to_category:
        best_match = title_to_category[file_title]
    else:
        # partial match (jaccard or substring)
        for t, c in title_to_category.items():
            if file_title in t or t in file_title:
                best_match = c
                break
            
            # words match
            file_words = set(file_title.split())
            t_words = set(t.split())
            if len(file_words.intersection(t_words)) > len(file_words) * 0.5:
                best_match = c
                break
                
    if best_match:
        # Update category in frontmatter
        new_content = re.sub(r'^category:.*$', f"category: '{best_match}'", content, flags=re.MULTILINE)
        if 'category:' not in content:
             new_content = re.sub(r'(^---.*?)^title:', r'\1category: \'{}\'\ntitle:'.format(best_match), content, flags=re.DOTALL|re.MULTILINE)
             
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(file)}: {best_match}")
    else:
        print(f"No match found for: {os.path.basename(file)} ({file_title})")

