import re
import os
import urllib.request
import base64
import ssl

ssl_context = ssl._create_unverified_context()

html_url = "https://docs.google.com/document/d/1_1PnetKlHfY4krkHNt0_x1HZLtGgW3S5UOnX9TnakBg/export?format=html"
req = urllib.request.Request(html_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ssl_context) as response:
    html_content = response.read().decode('utf-8')

img_matches = re.finditer(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html_content)
all_imgs = [m.group(1) for m in img_matches]
print(f"Total images found in live HTML: {len(all_imgs)}")

assets_dir = '/Users/sunith/Documents/FlowX-Projects/Joy-of-hearing-revamp/src/assets/blogs'

def save_image(src, filename):
    filepath = os.path.join(assets_dir, filename)
    print(f"Saving image to {filepath}")
    if src.startswith('data:image'):
        header, encoded = src.split(",", 1)
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(encoded))
    else:
        req = urllib.request.Request(src, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ssl_context) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())

# --- BLOG 5B ---
slug_5b = 'the-future-is-here-smart-ai-hearing-aids-explained'
imgs_5b = []
for i in range(5):
    if i < len(all_imgs):
        fname = f"{slug_5b}.jpg" if i == 0 else f"{slug_5b}-{i}.jpg"
        save_image(all_imgs[i], fname)
        imgs_5b.append(fname)

md_5b_path = f'/Users/sunith/Documents/FlowX-Projects/Joy-of-hearing-revamp/src/content/blogs/{slug_5b}.md'

frontmatter_5b = f"""---
title: "The Future Is Here: Smart AI Hearing Aids Explained"
slug: "{slug_5b}"
excerpt: "There was a time when a hearing aid did one thing: make sounds louder. Discover how today's AI-powered smart hearing aids analyze environments in real time and transform hearing care across Punjab."
date: 2026-07-26
heroImage: "../../assets/blogs/{imgs_5b[0]}"
author: "Joy of Hearing Team"
category: "Hearing Care"
---

"""

body_5b = f"""There was a time when a hearing aid did one thing: make sounds louder. Those days are over. Today's most advanced hearing aids carry artificial intelligence processors that rival the computing power found in smartphones, and they are changing what it means to live with hearing loss in ways that were unimaginable a decade ago.

![What Actually Makes a Hearing Aid AI-Powered](../../assets/blogs/{imgs_5b[1]})

## What Actually Makes a Hearing Aid AI-Powered?

The distinction matters. A standard digital hearing aid processes sound and amplifies it according to a pre-programmed setting. An AI hearing aid does something fundamentally different: it analyses the sound environment in real time, classifies what type of situation you are in, and adjusts hundreds of parameters automatically before you even notice the change.

Walking from a quiet corridor into a busy canteen, stepping outside into wind noise, moving from a one-on-one conversation to a group dinner: an AI aid handles all of these transitions seamlessly, without you touching a button or opening an app.

![Five Ways AI Changes the Experience](../../assets/blogs/{imgs_5b[2]})

## Five Ways AI Changes the Experience

Automatic scene detection is the headline feature. Leading AI aids identify up to seven distinct listening environments within milliseconds and reconfigure settings accordingly.

Real-time speech separation is what patients notice most. Rather than amplifying all sounds equally, AI isolates the voice of the person speaking to you and reduces everything else, even in crowded, noisy spaces.

Personalised learning takes this further. The device tracks your manual adjustments over days and weeks and begins making those same changes automatically, building a profile of your preferences over time.

Remote fine-tuning has changed the clinical relationship. Your audiologist can now adjust and reprogram your device through a secure app without requiring a clinic visit.

Health monitoring is the newest frontier. Premium AI aids from brands such as Starkey now include fall detection that alerts a designated contact, activity tracking, and engagement monitoring.

![The Leading AI Hearing Aid Brands Available in India](../../assets/blogs/{imgs_5b[3]})

## The Leading AI Hearing Aid Brands Available in India

Phonak's Lumity series uses AutoSense OS 5.0 to classify environments automatically. Oticon's Intent models scan sound 500 times per second using BrainHearing technology. Signia's IX series processes your own voice and your environment simultaneously for a uniquely natural result. Widex Moment delivers what its engineers call ZeroDelay sound, the closest experience to natural hearing ever measured in a device. Starkey's Genesis AI leads on health features including fall detection and body language awareness.

All of these brands are available for fitting and live demonstration across Joy of Hearing's 11 branches in Punjab.

## The Right Starting Point Is Still a Hearing Test

AI aids are remarkable, but the right device still depends on your audiogram. The technology works best when matched precisely to your type and degree of hearing loss by a qualified audiologist. At Joy of Hearing, every patient receives a complete hearing assessment before any recommendation is made.

Call or WhatsApp us at +91 95481 48852 or visit joyofhearing.net to book your free hearing test and experience the latest AI hearing aids in person.

![Experience AI Hearing Aids at Joy of Hearing](../../assets/blogs/{imgs_5b[4]})
"""

with open(md_5b_path, 'w', encoding='utf-8') as f:
    f.write(frontmatter_5b + body_5b)
print(f"Created {md_5b_path}")


# --- BLOG 5A ---
slug_5a = 'hearing-aid-price-in-india-what-to-expect-and-how-to-choose-the-right-one'
imgs_5a = []
for i in range(5, 10):
    if i < len(all_imgs):
        idx = i - 5
        fname = f"{slug_5a}.jpg" if idx == 0 else f"{slug_5a}-{idx}.jpg"
        save_image(all_imgs[i], fname)
        imgs_5a.append(fname)

md_5a_path = f'/Users/sunith/Documents/FlowX-Projects/Joy-of-hearing-revamp/src/content/blogs/{slug_5a}.md'

frontmatter_5a = f"""---
title: "Hearing Aid Price in India: What to Expect and How to Choose the Right One"
slug: "{slug_5a}"
excerpt: "If you have recently been advised to buy a hearing aid, learn about pricing from Rs 15,000 to over Rs 3.5 lakh in India, what features each price band offers, and how to choose the right device."
date: 2026-07-26
heroImage: "../../assets/blogs/{imgs_5a[0]}"
author: "Joy of Hearing Team"
category: "Hearing Care"
---

"""

body_5a = f"""If you have recently been advised to buy a hearing aid, one of your first questions is almost certainly: how much does it cost? The honest answer is that hearing aid prices in India range from around Rs 15,000 to over Rs 3.5 lakh per device, and that gap is not random. Every rupee in the price difference reflects a real difference in what the device can do for your hearing and your quality of life.

![Why the Price Varies So Much](../../assets/blogs/{imgs_5a[1]})

## Why the Price Varies So Much

Five factors primarily drive the cost of a hearing aid in India.

Technology level is the biggest driver. Basic hearing aids amplify all sounds together. Premium devices use artificial intelligence to identify and separate speech from background noise in real time, adjusting automatically as you move between environments. That capability commands a significant price premium.

Style and form factor matter too. Invisible-in-canal (IIC) and completely-in-canal (CIC) models require more precision engineering than standard behind-the-ear devices, making them more expensive to produce.

Connectivity features such as Bluetooth streaming to smartphones, televisions, and remote microphones add substantial value and cost. Entry-level aids rarely include these options.

Brand origin also plays a role. International manufacturers like Phonak, Oticon, Signia, and Widex price their devices to recover global research and development costs. Reputable devices assembled or sourced in India offer strong value at lower price points.

Finally, aftercare is critical. The price of a good hearing aid should include multiple fitting and programming sessions, follow-up appointments, and at least a one-year warranty. Devices sold cheaply without aftercare often cost more in the long run.

![What You Get at Each Price Point](../../assets/blogs/{imgs_5a[2]})

## What You Get at Each Price Point

At the basic level, Rs 15,000 to Rs 35,000 covers entry-level digital aids suitable for mild hearing loss in quiet environments. The standard range of Rs 35,000 to Rs 70,000 offers digital processing with noise reduction across 4 to 8 channels. Advanced aids priced between Rs 70,000 and Rs 1.5 lakh include directional microphones, Bluetooth, and rechargeable batteries. Premium devices above Rs 1.5 lakh are AI-powered, app-controlled, and automatically adapt to every listening environment.

![How to Choose Without Wasting Money](../../assets/blogs/{imgs_5a[3]})

## How to Choose Without Wasting Money

The right hearing aid is not the most expensive one. It is the one matched to your audiogram, your lifestyle, your daily environments, and your communication needs. A good audiologist will always assess your hearing before recommending a device, not after.

## Joy of Hearing: Tested First, Recommended Second

At Joy of Hearing, every patient receives a complete hearing test before any device is suggested. Our audiologists work across 11 branches in Punjab, offering the full range from affordable entry-level options to advanced international brands, with EMI options available and follow-up care built into every purchase.

Call or WhatsApp us at +91 95481 48852 or visit joyofhearing.net to book your free hearing test today.

![Book Your Free Hearing Test](../../assets/blogs/{imgs_5a[4]})
"""

with open(md_5a_path, 'w', encoding='utf-8') as f:
    f.write(frontmatter_5a + body_5a)
print(f"Created {md_5a_path}")
