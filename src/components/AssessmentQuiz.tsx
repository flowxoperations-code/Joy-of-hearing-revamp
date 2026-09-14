import React, { useState, useMemo, useEffect } from 'react';

type Answer = string | number;
type Language = 'en' | 'hi' | 'pa';

const T = {
  en: {
    hearingScreening: "Hearing Screening",
    speechScreening: "Speech & Language Screening",
    whoIsTaking: "Who is taking this assessment?",
    myself: "Myself", lovedOne: "A Loved One",
    relation: "Select Relation",
    mom: "Mom", dad: "Dad", grandfather: "Grandfather", grandmother: "Grandmother",
    son: "Son", daughter: "Daughter", friend: "Friend", other: "Other",
    gender: "Biological Sex", male: "Male", female: "Female", genderOther: "Other",
    age: "What is the age group?",
    child: "Below 18 Years", youngAdult: "18 – 40 Years", adult: "41 – 59 Years", senior: "Over 60 Years",
    resultsReadyTitle: "Your screening results are ready.",
    resultsReadySub: "Please confirm the person's details to view the screening results.",
    nameLabel: "Full Name", mobileNum: "Mobile Number", emailLabel: "Email ID",
    viewResultsBtn: "View Screening Results",
    bookAssessment: "Book Clinical Assessment", retake: "Retake Evaluation",
    yes: "Yes", no: "No", sometimes: "Sometimes",
    hearingIntroStat: "Nearly 63 million people in India live with hearing impairment.",
    hearingIntroBody: "Do you sometimes struggle to hear clearly or ask others to repeat themselves? Hearing loss often develops gradually and can go unnoticed for years. Take this quick 2-minute hearing screening to assess your hearing health and take the first step toward better care.",
    hearingInstructions: "Answer all questions carefully by selecting Yes, Sometimes, or No for each item. If you are a hearing aid user, please answer based on how you hear without using your hearing aid.",
    speechIntroBody: "Have you noticed difficulties in speech, language, or communication in yourself or a loved one? Early identification can improve communication, learning, and quality of life. Take this quick 2–3 minute Speech & Language Screening to assess communication abilities.",
    speechInstructions: "Please answer all questions by selecting Yes, Sometimes, or No. Button colours indicate the concern level of each response.",
    beginScreening: "Begin Screening",
    colourGuide: "Colour Guide",
    colourRed: "Red → Higher concern",
    colourOrange: "Orange → Moderate concern",
    colourGreen: "Green → Lower / No concern",
    speechAgeLabel: "Select Age Group",
    speechChildLabel: "2 – 12 Years",
    speechTeenLabel: "13 – 18 Years",
    speechAdultLabel: "19 – 59 Years",
    speechSeniorLabel: "60+ Years",
    speechChildResponder: "Completed by: Parent / Guardian",
    speechTeenResponder: "Completed by: Self or Parent",
    speechAdultResponder: "Completed by: Self",
    speechSeniorResponder: "Completed by: Self or Family Member",
    hearingChildResponder: "Completed by: Self or Parent/Guardian",
    hhieQuestions: [
      "Does a hearing problem cause you to feel embarrassed when you meet new people?",
      "Does a hearing problem cause you to feel frustrated when talking to a member of your family?",
      "Do you have difficulty hearing when someone speaks in a whisper?",
      "Do you feel handicapped by a hearing problem?",
      "Does a hearing problem cause you difficulty when visiting friends, relatives, or neighbors?",
      "Does a hearing problem cause you to attend conferences or religious services less often than you would like?",
      "Does a hearing problem cause you to have arguments with family members?",
      "Does a hearing problem cause you difficulty when listening to television or radio?",
      "Do you feel that any difficulty with your hearing limits or hampers your personal or social life?",
      "Does a hearing problem cause you difficulty when in a restaurant with relatives or friends?"
    ],
    childQuestions: [
      "Does your child respond when called by name?",
      "Does your child frequently ask others to repeat what they said?",
      "Does your child increase the TV/mobile volume more than others prefer?",
      "Does your child have difficulty understanding speech in noisy places?",
      "Does your child complain that people are not speaking clearly?",
      "Does your child seem inattentive or distracted during conversations?",
      "Does your child have difficulty hearing in classroom or group situations?",
      "Does your child respond slowly when spoken to?",
      "Does your child complain of ringing, buzzing, or sounds in the ears?",
      "Do you feel your child's hearing difficulties affect communication or learning?",
      "Does your child have difficulty hearing on phone calls or online classes?",
      "Do teachers or family members feel your child does not hear properly at times?"
    ],
    speechChildQuestions: [
      "Does your child respond when called by name?",
      "Does your child maintain eye contact while communicating?",
      "Is your child able to understand simple instructions?",
      "Does your child use age-appropriate words or sentences?",
      "Is your child's speech clear and understandable to family members?",
      "Does your child have difficulty pronouncing certain sounds or words?",
      "Does your child get frustrated while trying to communicate?",
      "Does your child stammer or repeat words frequently while speaking?",
      "Does your child interact and communicate with other children comfortably?",
      "Do you feel your child may have a speech or language delay compared to children of the same age?",
      "Does your child's voice sound unusually hoarse, nasal, too soft, or unclear?",
      "Does your child pause, stretch sounds, or struggle to speak smoothly?",
      "Does your child avoid speaking in social situations or hesitate to communicate?"
    ],
    speechTeenQuestions: [
      "Do you feel confident while speaking with others?",
      "Do you experience difficulty expressing your thoughts clearly?",
      "Do people frequently ask you to repeat yourself?",
      "Do you stammer, hesitate, or get stuck while speaking?",
      "Do you avoid speaking in social or classroom situations?",
      "Does your voice sound hoarse, strained, too soft, or unclear?",
      "Do you have difficulty understanding conversations or instructions?",
      "Do you feel anxious or frustrated while communicating?",
      "Do you participate comfortably in group discussions or presentations?",
      "Do communication difficulties affect your academic or social life?"
    ],
    speechAdultQuestions: [
      "Do you have difficulty communicating clearly with others?",
      "Do people often ask you to repeat yourself?",
      "Do you experience stammering or hesitation while speaking?",
      "Does your voice frequently sound hoarse, weak, or strained?",
      "Do you experience difficulty finding the right words while speaking?",
      "Do communication difficulties affect your work or social interactions?",
      "Do you avoid conversations due to communication concerns?",
      "Do you feel frustrated while trying to communicate?",
      "Are you able to understand conversations and instructions comfortably?",
      "Have you noticed recent changes in your speech or communication abilities?"
    ],
    speechSeniorQuestions: [
      "Do you have difficulty speaking clearly or being understood by others?",
      "Do you experience frequent difficulty finding words during conversation?",
      "Has your voice become weaker, softer, or hoarse?",
      "Do you have difficulty understanding conversations?",
      "Do communication difficulties affect your daily activities or social interaction?",
      "Do you avoid conversations because of communication concerns?",
      "Do family members notice changes in your speech or communication abilities?",
      "Do you feel frustrated while trying to communicate?",
      "Are you able to communicate your needs comfortably?",
      "Have you noticed recent memory or communication difficulties?"
    ],
    hearingResults: {
      noReferral: {
        title: "No Referral",
        highlight: "Congratulations!",
        msg: "Based on your responses, you do not appear to have significant hearing difficulty at the moment.\n\nHowever, this screening is not a complete diagnostic test. For a detailed hearing evaluation and expert consultation, please contact us at 9548148852."
      },
      refer: {
        title: "Referral Recommended",
        highlight: "",
        msg: "Thank you for using our online hearing screening tool.\n\nBased on your responses, there may be signs of hearing difficulty that require further evaluation by a hearing care professional.\n\nThe good news is that early identification and timely intervention can make a significant difference.\n\nPlease contact us at 9548148852 or email us at Customercare@joyofhearing.net for detailed guidance and support.",
        footer: "Earlier the detection, easier the solution."
      }
    },
    speechResults: {
      speechChild: {
        green: { title: "No Major Concern Observed", highlight: "Congratulations!", msg: "Based on your responses, your child's speech, language, voice, and communication development currently do not show significant concerns.\n\nContinue encouraging regular communication, reading, social interaction, and language-building activities at home.\n\nPlease remember that this screening is not a diagnostic assessment. If you continue to have concerns about your child's communication development, we recommend consulting a Speech & Language Professional for a detailed evaluation." },
        yellow: { title: "Monitor Speech & Language Development", highlight: "", msg: "Your responses suggest that your child may be showing mild speech, language, voice, fluency, or communication-related concerns that should be monitored over time.\n\nEarly attention and supportive communication activities can positively support development.\n\nIf concerns continue or increase, a professional Speech & Language Evaluation is recommended for detailed guidance." },
        red: { title: "Professional Evaluation Recommended", highlight: "", msg: "Based on your responses, your child may benefit from a detailed Speech & Language Assessment by a qualified professional.\n\nEarly identification and timely intervention can significantly improve communication, learning, social interaction, and overall development.\n\nWe recommend scheduling a professional consultation for further guidance and support.", footer: "Earlier the Detection, Easier the Communication Development." }
      },
      speechTeen: {
        green: { title: "No Major Concern Observed", highlight: "", msg: "Based on your responses, no significant speech, language, fluency, or voice concerns are indicated at present.\n\nContinue practicing healthy communication habits and confidence-building activities." },
        yellow: { title: "Monitor Communication Development", highlight: "", msg: "Some responses indicate mild communication concerns that may require observation and monitoring.\n\nIf difficulties continue, consider consulting a Speech & Language Professional." },
        red: { title: "Professional Evaluation Recommended", highlight: "", msg: "Your responses suggest that you may benefit from a detailed Speech & Language Assessment by a qualified professional.\n\nEarly guidance and intervention can significantly improve communication confidence and quality of life." }
      },
      speechAdult: {
        green: { title: "No Major Concern Observed", highlight: "", msg: "Based on your responses, no major speech, language, fluency, or voice concerns are indicated at present." },
        yellow: { title: "Monitor Communication Health", highlight: "", msg: "Some responses indicate communication-related concerns that may require monitoring.\n\nIf symptoms continue or increase, professional consultation is recommended." },
        red: { title: "Professional Evaluation Recommended", highlight: "", msg: "Your responses suggest that you may benefit from a detailed Speech & Language Assessment by a qualified professional.\n\nEarly evaluation can help identify and manage communication difficulties effectively." }
      },
      speechSenior: {
        green: { title: "No Major Concern Observed", highlight: "", msg: "Based on the responses, no major speech, language, or communication concerns are indicated at present." },
        yellow: { title: "Monitor Communication Health", highlight: "", msg: "Some responses indicate mild communication concerns that should be monitored over time.\n\nProfessional guidance may be beneficial if concerns continue." },
        red: { title: "Professional Evaluation Recommended", highlight: "", msg: "The responses suggest that a detailed Speech & Language Evaluation may be beneficial.\n\nEarly identification can support better communication and quality of life." }
      }
    }
  },
  hi: {
    hearingScreening: "हियरिंग स्क्रीनिंग",
    speechScreening: "स्पीच और लैंग्वेज स्क्रीनिंग",
    whoIsTaking: "यह असेसमेंट कौन ले रहा है?",
    myself: "मैं खुद", lovedOne: "एक प्रियजन",
    relation: "संबंध चुनें",
    mom: "माँ", dad: "पिता", grandfather: "दादा", grandmother: "दादी",
    son: "बेटा", daughter: "बेटी", friend: "दोस्त", other: "अन्य",
    gender: "लिंग", male: "पुरुष", female: "महिला", genderOther: "अन्य",
    age: "आयु वर्ग क्या है?",
    child: "18 वर्ष से कम", youngAdult: "18 – 40 वर्ष", adult: "41 – 59 वर्ष", senior: "60 वर्ष से ऊपर",
    resultsReadyTitle: "आपके स्क्रीनिंग परिणाम तैयार हैं।",
    resultsReadySub: "स्क्रीनिंग परिणाम देखने के लिए कृपया व्यक्ति का विवरण भरें।",
    nameLabel: "पूरा नाम", mobileNum: "मोबाइल नंबर", emailLabel: "ईमेल आईडी",
    viewResultsBtn: "स्क्रीनिंग परिणाम देखें",
    bookAssessment: "क्लिनिकल असेसमेंट बुक करें", retake: "फिर से मूल्यांकन करें",
    yes: "हाँ", no: "नहीं", sometimes: "कभी-कभी",
    hearingIntroStat: "भारत में लगभग 6.3 करोड़ लोग सुनने की समस्या से पीड़ित हैं।",
    hearingIntroBody: "क्या आपको कभी-कभी स्पष्ट सुनने में कठिनाई होती है? श्रवण हानि अक्सर धीरे-धीरे विकसित होती है। यह 2-मिनट की स्क्रीनिंग लें।",
    hearingInstructions: "सभी प्रश्नों का उत्तर ध्यान से दें — हाँ, कभी-कभी, या नहीं में से एक चुनें। यदि आप हियरिंग एड उपयोगकर्ता हैं, तो बिना हियरिंग एड के सुनने के आधार पर उत्तर दें।",
    speechIntroBody: "क्या आपने खुद में या किसी प्रियजन में बोलने या भाषा की मुश्किल देखी है? जल्दी पहचान से जीवन की गुणवत्ता में सुधार हो सकता है।",
    speechInstructions: "सभी प्रश्नों का उत्तर हाँ, कभी-कभी, या नहीं में से चुनें। बटन के रंग चिंता के स्तर को दर्शाते हैं।",
    beginScreening: "स्क्रीनिंग शुरू करें",
    colourGuide: "रंग गाइड",
    colourRed: "लाल → अधिक चिंता",
    colourOrange: "नारंगी → मध्यम चिंता",
    colourGreen: "हरा → कम / कोई चिंता नहीं",
    speechAgeLabel: "आयु वर्ग चुनें",
    speechChildLabel: "2 – 12 वर्ष",
    speechTeenLabel: "13 – 18 वर्ष",
    speechAdultLabel: "19 – 59 वर्ष",
    speechSeniorLabel: "60+ वर्ष",
    speechChildResponder: "पूरा करने वाले: माता-पिता / अभिभावक",
    speechTeenResponder: "पूरा करने वाले: स्वयं या माता-पिता",
    speechAdultResponder: "पूरा करने वाले: स्वयं",
    speechSeniorResponder: "पूरा करने वाले: स्वयं या परिवार का सदस्य",
    hearingChildResponder: "पूरा करने वाले: स्वयं या माता-पिता/अभिभावक",
    hhieQuestions: [
      "क्या सुनने की समस्या नए लोगों से मिलने पर शर्मिंदगी कराती है?",
      "क्या सुनने की समस्या परिवार से बात करने में निराशा देती है?",
      "क्या धीमी आवाज़ सुनने में कठिनाई होती है?",
      "क्या सुनने की समस्या से आप खुद को असहाय महसूस करते हैं?",
      "क्या सुनने की समस्या दोस्तों से मिलने में कठिनाई करती है?",
      "क्या सुनने की समस्या के कारण सम्मेलनों में कम जाते हैं?",
      "क्या सुनने की समस्या परिवार से तर्क-वितर्क कराती है?",
      "क्या सुनने की समस्या टीवी या रेडियो सुनने में कठिनाई करती है?",
      "क्या सुनने की कठिनाई आपके सामाजिक जीवन को सीमित करती है?",
      "क्या सुनने की समस्या रेस्तरां में कठिनाई करती है?"
    ],
    childQuestions: [
      "क्या आपका बच्चा नाम पुकारने पर जवाब देता है?",
      "क्या आपका बच्चा अक्सर दूसरों से अपनी बात दोहराने के लिए कहता है?",
      "क्या आपका बच्चा टीवी/मोबाइल की आवाज़ दूसरों की पसंद से ज़्यादा बढ़ाता है?",
      "क्या आपके बच्चे को शोर-शराबे वाली जगहों पर बात समझने में दिक्कत होती है?",
      "क्या आपका बच्चा शिकायत करता है कि लोग साफ़ नहीं बोल रहे हैं?",
      "क्या आपका बच्चा बातचीत के दौरान असावधान या विचलित लगता है?",
      "क्या आपके बच्चे को कक्षा या समूह में सुनने में कठिनाई होती है?",
      "क्या आपका बच्चा बात करने पर धीरे जवाब देता है?",
      "क्या आपका बच्चा कानों में घंटी बजने या अन्य आवाज़ें आने की शिकायत करता है?",
      "क्या आपको लगता है कि आपके बच्चे की सुनने की समस्या उसके संचार या सीखने को प्रभावित करती है?",
      "क्या आपके बच्चे को फ़ोन कॉल या ऑनलाइन क्लास में सुनने में कठिनाई होती है?",
      "क्या शिक्षकों या परिवार के सदस्यों को लगता है कि आपका बच्चा कभी-कभी ठीक से नहीं सुनता?"
    ],
    speechChildQuestions: [
      "क्या आपका बच्चा नाम पुकारे जाने पर जवाब देता है?",
      "क्या आपका बच्चा बात करते समय आँख मिलाता है?",
      "क्या आपका बच्चा सरल निर्देश समझ सकता है?",
      "क्या आपका बच्चा उम्र के अनुसार शब्दों/वाक्यों का उपयोग करता है?",
      "क्या परिवार को बच्चे की बोली समझ में आती है?",
      "क्या बच्चे को कुछ ध्वनियों के उच्चारण में कठिनाई है?",
      "क्या बच्चा संवाद करने में निराश होता है?",
      "क्या बच्चा बोलते समय हकलाता या शब्द दोहराता है?",
      "क्या बच्चा अन्य बच्चों के साथ आराम से बातचीत करता है?",
      "क्या आपको लगता है कि बच्चे की भाषा उसी उम्र के बच्चों से पीछे है?",
      "क्या बच्चे की आवाज़ असामान्य रूप से भारी, नाक से, या अस्पष्ट है?",
      "क्या बच्चा रुकता है या ध्वनियों को खींचकर बोलने में संघर्ष करता है?",
      "क्या बच्चा सामाजिक स्थितियों में बोलने से बचता है?"
    ],
    speechTeenQuestions: [
      "क्या आप दूसरों से बात करते समय आत्मविश्वास महसूस करते हैं?",
      "क्या आपको अपने विचार स्पष्ट रूप से व्यक्त करने में कठिनाई होती है?",
      "क्या लोग अक्सर आपसे बात दोहराने को कहते हैं?",
      "क्या आप बोलते समय हकलाते, रुकते, या अटकते हैं?",
      "क्या आप सामाजिक या कक्षा स्थितियों में बोलने से बचते हैं?",
      "क्या आपकी आवाज़ भारी, तनावपूर्ण, या अस्पष्ट लगती है?",
      "क्या आपको बातचीत या निर्देश समझने में कठिनाई होती है?",
      "क्या आप संवाद करते समय चिंतित या निराश होते हैं?",
      "क्या आप समूह चर्चाओं में आराम से भाग लेते हैं?",
      "क्या संचार की कठिनाइयाँ आपके शैक्षणिक या सामाजिक जीवन को प्रभावित करती हैं?"
    ],
    speechAdultQuestions: [
      "क्या आपको दूसरों के साथ स्पष्ट रूप से संवाद करने में कठिनाई होती है?",
      "क्या लोग अक्सर आपसे बात दोहराने को कहते हैं?",
      "क्या आपको बोलते समय हकलाहट या झिझक होती है?",
      "क्या आपकी आवाज़ अक्सर भारी, कमज़ोर, या तनावपूर्ण लगती है?",
      "क्या बोलते समय सही शब्द खोजने में कठिनाई होती है?",
      "क्या संचार की कठिनाइयाँ आपके काम या सामाजिक जीवन को प्रभावित करती हैं?",
      "क्या आप संचार की चिंताओं के कारण बातचीत से बचते हैं?",
      "क्या आप संवाद करने में निराश महसूस करते हैं?",
      "क्या आप बातचीत और निर्देश आराम से समझ सकते हैं?",
      "क्या आपने हाल ही में अपनी बोली या संचार क्षमता में बदलाव देखा है?"
    ],
    speechSeniorQuestions: [
      "क्या आपको स्पष्ट बोलने या दूसरों द्वारा समझे जाने में कठिनाई है?",
      "क्या आपको बातचीत के दौरान शब्द खोजने में अक्सर कठिनाई होती है?",
      "क्या आपकी आवाज़ कमज़ोर, धीमी, या भारी हो गई है?",
      "क्या आपको बातचीत समझने में कठिनाई होती है?",
      "क्या संचार की कठिनाइयाँ दैनिक गतिविधियों को प्रभावित करती हैं?",
      "क्या आप संचार की चिंताओं के कारण बातचीत से बचते हैं?",
      "क्या परिवार के सदस्य आपकी बोली में बदलाव देखते हैं?",
      "क्या आप संवाद करने में निराश महसूस करते हैं?",
      "क्या आप अपनी ज़रूरतें आराम से बता सकते हैं?",
      "क्या आपने हाल ही में स्मृति या संचार में कठिनाइयाँ देखी हैं?"
    ],
    hearingResults: {
      noReferral: {
        title: "कोई रेफरल नहीं",
        highlight: "बधाई हो!",
        msg: "आपके जवाबों के आधार पर, इस समय आपको महत्वपूर्ण सुनने की कठिनाई नहीं दिखती।\n\nहालांकि, यह स्क्रीनिंग पूर्ण नैदानिक परीक्षण नहीं है। विस्तृत मूल्यांकन के लिए कृपया 9548148852 पर संपर्क करें।"
      },
      refer: {
        title: "रेफरल",
        highlight: "",
        msg: "हमारे ऑनलाइन हियरिंग स्क्रीनिंग टूल का उपयोग करने के लिए धन्यवाद।\n\nआपके जवाबों के आधार पर, सुनने की कठिनाई के संकेत हो सकते हैं जिनके लिए विशेषज्ञ मूल्यांकन की आवश्यकता है।\n\nजल्दी पहचान और समय पर उपचार से बड़ा अंतर पड़ सकता है।\n\nकृपया 9548148852 पर संपर्क करें या Customercare@joyofhearing.net पर ईमेल करें।",
        footer: "जितनी जल्दी पहचान, उतना आसान समाधान।"
      }
    },
    speechResults: {
      speechChild: {
        green: { title: "कोई बड़ी चिंता नहीं", highlight: "बधाई हो!", msg: "आपके जवाबों के आधार पर, आपके बच्चे का भाषण और भाषा विकास अभी महत्वपूर्ण चिंताएं नहीं दिखाता।\n\nघर पर नियमित संचार, पढ़ाई, और सामाजिक गतिविधियों को प्रोत्साहित करते रहें।" },
        yellow: { title: "भाषण विकास की निगरानी करें", highlight: "", msg: "आपके जवाब बताते हैं कि बच्चे में हल्की भाषण या संचार संबंधी चिंताएं हो सकती हैं।\n\nयदि चिंताएं बढ़ें, तो विशेषज्ञ मूल्यांकन की सिफारिश की जाती है।" },
        red: { title: "विशेषज्ञ मूल्यांकन की सिफारिश", highlight: "", msg: "आपके जवाबों के आधार पर, बच्चे को विस्तृत स्पीच और लैंग्वेज असेसमेंट से लाभ हो सकता है।\n\nजल्दी पहचान से संचार, सीखने और सामाजिक विकास में महत्वपूर्ण सुधार हो सकता है।", footer: "जितनी जल्दी पहचान, उतना आसान विकास।" }
      },
      speechTeen: {
        green: { title: "कोई बड़ी चिंता नहीं", highlight: "", msg: "आपके जवाबों के आधार पर, इस समय कोई महत्वपूर्ण भाषण या संचार चिंता नहीं दिखती।" },
        yellow: { title: "संचार विकास की निगरानी करें", highlight: "", msg: "कुछ जवाब हल्की संचार चिंताएं दर्शाते हैं। यदि कठिनाइयाँ जारी रहें, तो विशेषज्ञ से परामर्श लें।" },
        red: { title: "विशेषज्ञ मूल्यांकन की सिफारिश", highlight: "", msg: "आपके जवाब बताते हैं कि विस्तृत स्पीच और लैंग्वेज असेसमेंट फायदेमंद हो सकता है।" }
      },
      speechAdult: {
        green: { title: "कोई बड़ी चिंता नहीं", highlight: "", msg: "आपके जवाबों के आधार पर, इस समय कोई महत्वपूर्ण भाषण या आवाज़ संबंधी चिंता नहीं दिखती।" },
        yellow: { title: "संचार स्वास्थ्य की निगरानी करें", highlight: "", msg: "कुछ जवाब संचार संबंधी चिंताएं दर्शाते हैं। यदि लक्षण बढ़ें, तो विशेषज्ञ परामर्श की सिफारिश की जाती है।" },
        red: { title: "विशेषज्ञ मूल्यांकन की सिफारिश", highlight: "", msg: "आपके जवाब बताते हैं कि विस्तृत स्पीच और लैंग्वेज असेसमेंट फायदेमंद हो सकता है।" }
      },
      speechSenior: {
        green: { title: "कोई बड़ी चिंता नहीं", highlight: "", msg: "जवाबों के आधार पर, इस समय कोई महत्वपूर्ण भाषण या संचार चिंता नहीं दिखती।" },
        yellow: { title: "संचार स्वास्थ्य की निगरानी करें", highlight: "", msg: "कुछ जवाब हल्की संचार चिंताएं दर्शाते हैं जिन्हें समय के साथ देखा जाना चाहिए।" },
        red: { title: "विशेषज्ञ मूल्यांकन की सिफारिश", highlight: "", msg: "जवाब बताते हैं कि विस्तृत स्पीच और लैंग्वेज मूल्यांकन फायदेमंद हो सकता है।" }
      }
    }
  },
  pa: {
    hearingScreening: "ਹੀਅਰਿੰਗ ਸਕ੍ਰੀਨਿੰਗ",
    speechScreening: "ਸਪੀਚ ਅਤੇ ਲੈਂਗੂਏਜ ਸਕ੍ਰੀਨਿੰਗ",
    whoIsTaking: "ਇਹ ਅਸੈਸਮੈਂਟ ਕੌਣ ਲੈ ਰਿਹਾ ਹੈ?",
    myself: "ਮੈਂ ਖੁਦ", lovedOne: "ਇੱਕ ਪਿਆਰਾ",
    relation: "ਰਿਸ਼ਤਾ ਚੁਣੋ",
    mom: "ਮਾਂ", dad: "ਪਿਤਾ", grandfather: "ਦਾਦਾ", grandmother: "ਦਾਦੀ",
    son: "ਪੁੱਤਰ", daughter: "ਧੀ", friend: "ਦੋਸਤ", other: "ਹੋਰ",
    gender: "ਲਿੰਗ", male: "ਮਰਦ", female: "ਔਰਤ", genderOther: "ਹੋਰ",
    age: "ਉਮਰ ਵਰਗ ਕੀ ਹੈ?",
    child: "18 ਸਾਲ ਤੋਂ ਘੱਟ", youngAdult: "18 – 40 ਸਾਲ", adult: "41 – 59 ਸਾਲ", senior: "60 ਸਾਲ ਤੋਂ ਉੱਪਰ",
    resultsReadyTitle: "ਤੁਹਾਡੇ ਸਕ੍ਰੀਨਿੰਗ ਨਤੀਜੇ ਤਿਆਰ ਹਨ।",
    resultsReadySub: "ਸਕ੍ਰੀਨਿੰਗ ਨਤੀਜੇ ਦੇਖਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਵਿਅਕਤੀ ਦੀ ਜਾਣਕਾਰੀ ਭਰੋ।",
    nameLabel: "ਪੂਰਾ ਨਾਮ", mobileNum: "ਮੋਬਾਈਲ ਨੰਬਰ", emailLabel: "ਈਮੇਲ ਆਈਡੀ",
    viewResultsBtn: "ਸਕ੍ਰੀਨਿੰਗ ਨਤੀਜੇ ਦੇਖੋ",
    bookAssessment: "ਕਲੀਨਿਕਲ ਅਸੈਸਮੈਂਟ ਬੁੱਕ ਕਰੋ", retake: "ਦੁਬਾਰਾ ਮੁਲਾਂਕਣ ਕਰੋ",
    yes: "ਹਾਂ", no: "ਨਹੀਂ", sometimes: "ਕਦੇ-ਕਦੇ",
    hearingIntroStat: "ਭਾਰਤ ਵਿੱਚ ਲਗਭਗ 6.3 ਕਰੋੜ ਲੋਕ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਨਾਲ ਜਿਉਂਦੇ ਹਨ।",
    hearingIntroBody: "ਕੀ ਤੁਹਾਨੂੰ ਕਦੇ-ਕਦੇ ਸਾਫ਼ ਸੁਣਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੁੰਦੀ ਹੈ? ਸੁਣਨ ਦੀ ਕਮੀ ਅਕਸਰ ਹੌਲੀ-ਹੌਲੀ ਵਧਦੀ ਹੈ। ਇਹ 2-ਮਿੰਟ ਦੀ ਸਕ੍ਰੀਨਿੰਗ ਲਓ।",
    hearingInstructions: "ਸਾਰੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਧਿਆਨ ਨਾਲ ਦਿਓ। ਜੇ ਤੁਸੀਂ ਹੀਅਰਿੰਗ ਏਡ ਵਰਤਦੇ ਹੋ, ਤਾਂ ਬਿਨਾਂ ਏਡ ਦੇ ਸੁਣਨ ਦੇ ਆਧਾਰ 'ਤੇ ਜਵਾਬ ਦਿਓ।",
    speechIntroBody: "ਕੀ ਤੁਸੀਂ ਆਪਣੇ ਆਪ ਵਿੱਚ ਜਾਂ ਕਿਸੇ ਅਜ਼ੀਜ਼ ਵਿੱਚ ਬੋਲਣ ਦੀ ਮੁਸ਼ਕਲ ਦੇਖੀ ਹੈ? ਜਲਦੀ ਪਛਾਣ ਜੀਵਨ ਸੁਧਾਰ ਸਕਦੀ ਹੈ।",
    speechInstructions: "ਸਾਰੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਧਿਆਨ ਨਾਲ ਦਿਓ। ਬਟਨਾਂ ਦੇ ਰੰਗ ਚਿੰਤਾ ਦੇ ਪੱਧਰ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ।",
    beginScreening: "ਸਕ੍ਰੀਨਿੰਗ ਸ਼ੁਰੂ ਕਰੋ",
    colourGuide: "ਰੰਗ ਗਾਈਡ",
    colourRed: "ਲਾਲ → ਵਧੇਰੇ ਚਿੰਤਾ",
    colourOrange: "ਸੰਤਰੀ → ਮੱਧਮ ਚਿੰਤਾ",
    colourGreen: "ਹਰਾ → ਘੱਟ / ਕੋਈ ਚਿੰਤਾ ਨਹੀਂ",
    speechAgeLabel: "ਉਮਰ ਵਰਗ ਚੁਣੋ",
    speechChildLabel: "2 – 12 ਸਾਲ",
    speechTeenLabel: "13 – 18 ਸਾਲ",
    speechAdultLabel: "19 – 59 ਸਾਲ",
    speechSeniorLabel: "60+ ਸਾਲ",
    speechChildResponder: "ਭਰਨ ਵਾਲੇ: ਮਾਤਾ-ਪਿਤਾ / ਸਰਪ੍ਰਸਤ",
    speechTeenResponder: "ਭਰਨ ਵਾਲੇ: ਆਪ ਜਾਂ ਮਾਤਾ-ਪਿਤਾ",
    speechAdultResponder: "ਭਰਨ ਵਾਲੇ: ਆਪ",
    speechSeniorResponder: "ਭਰਨ ਵਾਲੇ: ਆਪ ਜਾਂ ਪਰਿਵਾਰ ਦਾ ਮੈਂਬਰ",
    hearingChildResponder: "ਭਰਨ ਵਾਲੇ: ਆਪ ਜਾਂ ਮਾਤਾ-ਪਿਤਾ/ਸਰਪ੍ਰਸਤ",
    hhieQuestions: [
      "ਕੀ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਨਵੇਂ ਲੋਕਾਂ ਨੂੰ ਮਿਲਣ ਵੇਲੇ ਸ਼ਰਮਿੰਦਗੀ ਮਹਿਸੂਸ ਕਰਾਉਂਦੀ ਹੈ?",
      "ਕੀ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਪਰਿਵਾਰ ਨਾਲ ਗੱਲ ਕਰਨ ਵੇਲੇ ਨਿਰਾਸ਼ਾ ਦਿੰਦੀ ਹੈ?",
      "ਕੀ ਧੀਮੀ ਆਵਾਜ਼ ਸੁਣਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੁੰਦੀ ਹੈ?",
      "ਕੀ ਤੁਸੀਂ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਕਾਰਨ ਆਪਣੇ ਆਪ ਨੂੰ ਅਸਮਰੱਥ ਮਹਿਸੂਸ ਕਰਦੇ ਹੋ?",
      "ਕੀ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਦੋਸਤਾਂ ਨੂੰ ਮਿਲਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਪੈਦਾ ਕਰਦੀ ਹੈ?",
      "ਕੀ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਕਾਰਨ ਧਾਰਮਿਕ ਸੇਵਾਵਾਂ ਵਿੱਚ ਘੱਟ ਜਾਂਦੇ ਹੋ?",
      "ਕੀ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਪਰਿਵਾਰ ਨਾਲ ਬਹਿਸ ਕਰਾਉਂਦੀ ਹੈ?",
      "ਕੀ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਟੈਲੀਵਿਜ਼ਨ ਸੁਣਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਕਰਦੀ ਹੈ?",
      "ਕੀ ਸੁਣਨ ਦੀ ਮੁਸ਼ਕਲ ਤੁਹਾਡੀ ਸਮਾਜਿਕ ਜ਼ਿੰਦਗੀ ਨੂੰ ਸੀਮਤ ਕਰਦੀ ਹੈ?",
      "ਕੀ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਰੈਸਟੋਰੈਂਟ ਵਿੱਚ ਮੁਸ਼ਕਲ ਪੈਦਾ ਕਰਦੀ ਹੈ?"
    ],
    childQuestions: [
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਨਾਮ ਪੁਕਾਰਨ 'ਤੇ ਜਵਾਬ ਦਿੰਦਾ ਹੈ?",
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਅਕਸਰ ਦੂਜਿਆਂ ਨੂੰ ਆਪਣੀ ਗੱਲ ਦੁਹਰਾਉਣ ਲਈ ਕਹਿੰਦਾ ਹੈ?",
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਟੀਵੀ/ਮੋਬਾਈਲ ਦੀ ਆਵਾਜ਼ ਦੂਜਿਆਂ ਦੀ ਪਸੰਦ ਨਾਲੋਂ ਵੱਧ ਵਧਾਉਂਦਾ ਹੈ?",
      "ਕੀ ਤੁਹਾਡੇ ਬੱਚੇ ਨੂੰ ਰੌਲੇ-ਰੱਪੇ ਵਾਲੀਆਂ ਥਾਵਾਂ 'ਤੇ ਗੱਲ ਸਮਝਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਆਉਂਦੀ ਹੈ?",
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਸ਼ਿਕਾਇਤ ਕਰਦਾ ਹੈ ਕਿ ਲੋਕ ਸਾਫ਼ ਨਹੀਂ ਬੋਲ ਰਹੇ ਹਨ?",
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਗੱਲਬਾਤ ਦੌਰਾਨ ਅਣਗੌਲਿਆ ਜਾਂ ਭਟਕਿਆ ਹੋਇਆ ਲੱਗਦਾ ਹੈ?",
      "ਕੀ ਤੁਹਾਡੇ ਬੱਚੇ ਨੂੰ ਕਲਾਸਰੂਮ ਜਾਂ ਸਮੂਹ ਵਿੱਚ ਸੁਣਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਆਉਂਦੀ ਹੈ?",
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਗੱਲ ਕਰਨ 'ਤੇ ਹੌਲੀ ਜਵਾਬ ਦਿੰਦਾ ਹੈ?",
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਕੰਨਾਂ ਵਿੱਚ ਘੰਟੀ ਵੱਜਣ ਜਾਂ ਹੋਰ ਆਵਾਜ਼ਾਂ ਆਉਣ ਦੀ ਸ਼ਿਕਾਇਤ ਕਰਦਾ ਹੈ?",
      "ਕੀ ਤੁਹਾਨੂੰ ਲੱਗਦਾ ਹੈ ਕਿ ਤੁਹਾਡੇ ਬੱਚੇ ਦੀ ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ ਉਸਦੇ ਸੰਚਾਰ ਜਾਂ ਸਿੱਖਣ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀ ਹੈ?",
      "ਕੀ ਤੁਹਾਡੇ ਬੱਚੇ ਨੂੰ ਫ਼ੋਨ ਕਾਲਾਂ ਜਾਂ ਆਨਲਾਈਨ ਕਲਾਸਾਂ ਵਿੱਚ ਸੁਣਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਆਉਂਦੀ ਹੈ?",
      "ਕੀ ਅਧਿਆਪਕਾਂ ਜਾਂ ਪਰਿਵਾਰ ਦੇ ਮੈਂਬਰਾਂ ਨੂੰ ਲੱਗਦਾ ਹੈ ਕਿ ਤੁਹਾਡਾ ਬੱਚਾ ਕਦੇ-ਕਦੇ ਠੀਕ ਤਰ੍ਹਾਂ ਨਹੀਂ ਸੁਣਦਾ?"
    ],
    speechChildQuestions: [
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਨਾਮ ਲੈ ਕੇ ਬੁਲਾਉਣ 'ਤੇ ਜਵਾਬ ਦਿੰਦਾ ਹੈ?",
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਗੱਲਬਾਤ ਕਰਦੇ ਸਮੇਂ ਅੱਖਾਂ ਦਾ ਸੰਪਰਕ ਬਣਾਉਂਦਾ ਹੈ?",
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਸਧਾਰਨ ਹਦਾਇਤਾਂ ਸਮਝ ਸਕਦਾ ਹੈ?",
      "ਕੀ ਤੁਹਾਡਾ ਬੱਚਾ ਉਮਰ ਅਨੁਸਾਰ ਸ਼ਬਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ?",
      "ਕੀ ਪਰਿਵਾਰ ਨੂੰ ਬੱਚੇ ਦੀ ਬੋਲੀ ਸਮਝ ਆਉਂਦੀ ਹੈ?",
      "ਕੀ ਬੱਚੇ ਨੂੰ ਕੁਝ ਆਵਾਜ਼ਾਂ ਦਾ ਉਚਾਰਨ ਕਰਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੈ?",
      "ਕੀ ਬੱਚਾ ਗੱਲਬਾਤ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਵਿੱਚ ਨਿਰਾਸ਼ ਹੁੰਦਾ ਹੈ?",
      "ਕੀ ਬੱਚਾ ਬੋਲਦੇ ਸਮੇਂ ਅਕਸਰ ਹਕਲਾਉਂਦਾ ਜਾਂ ਸ਼ਬਦ ਦੁਹਰਾਉਂਦਾ ਹੈ?",
      "ਕੀ ਬੱਚਾ ਦੂਜੇ ਬੱਚਿਆਂ ਨਾਲ ਆਸਾਨੀ ਨਾਲ ਗੱਲਬਾਤ ਕਰਦਾ ਹੈ?",
      "ਕੀ ਤੁਸੀਂ ਮਹਿਸੂਸ ਕਰਦੇ ਹੋ ਕਿ ਬੱਚੇ ਦੀ ਭਾਸ਼ਾ ਉਸੇ ਉਮਰ ਦੇ ਬੱਚਿਆਂ ਤੋਂ ਪਿੱਛੇ ਹੈ?",
      "ਕੀ ਬੱਚੇ ਦੀ ਆਵਾਜ਼ ਅਸਾਮਾਨਿਕ ਤੌਰ 'ਤੇ ਖੁਰਦਰੀ ਜਾਂ ਅਸਪੱਸ਼ਟ ਲੱਗਦੀ ਹੈ?",
      "ਕੀ ਬੱਚਾ ਬੋਲਦੇ ਸਮੇਂ ਰੁਕਦਾ ਜਾਂ ਆਵਾਜ਼ਾਂ ਖਿੱਚਦਾ ਹੈ?",
      "ਕੀ ਬੱਚਾ ਸਮਾਜਿਕ ਸਥਿਤੀਆਂ ਵਿੱਚ ਬੋਲਣ ਤੋਂ ਪਰਹੇਜ਼ ਕਰਦਾ ਹੈ?"
    ],
    speechTeenQuestions: [
      "ਕੀ ਤੁਸੀਂ ਦੂਜਿਆਂ ਨਾਲ ਗੱਲ ਕਰਦੇ ਸਮੇਂ ਆਤਮਵਿਸ਼ਵਾਸ ਮਹਿਸੂਸ ਕਰਦੇ ਹੋ?",
      "ਕੀ ਤੁਹਾਨੂੰ ਆਪਣੇ ਵਿਚਾਰ ਸਪੱਸ਼ਟ ਰੂਪ ਵਿੱਚ ਦੱਸਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੁੰਦੀ ਹੈ?",
      "ਕੀ ਲੋਕ ਅਕਸਰ ਤੁਹਾਨੂੰ ਦੁਹਰਾਉਣ ਲਈ ਕਹਿੰਦੇ ਹਨ?",
      "ਕੀ ਤੁਸੀਂ ਬੋਲਦੇ ਸਮੇਂ ਹਕਲਾਉਂਦੇ ਜਾਂ ਅਟਕਦੇ ਹੋ?",
      "ਕੀ ਤੁਸੀਂ ਸਮਾਜਿਕ ਸਥਿਤੀਆਂ ਵਿੱਚ ਬੋਲਣ ਤੋਂ ਪਰਹੇਜ਼ ਕਰਦੇ ਹੋ?",
      "ਕੀ ਤੁਹਾਡੀ ਆਵਾਜ਼ ਖੁਰਦਰੀ ਜਾਂ ਅਸਪੱਸ਼ਟ ਲੱਗਦੀ ਹੈ?",
      "ਕੀ ਤੁਹਾਨੂੰ ਗੱਲਬਾਤ ਸਮਝਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੁੰਦੀ ਹੈ?",
      "ਕੀ ਤੁਸੀਂ ਗੱਲਬਾਤ ਕਰਦੇ ਸਮੇਂ ਚਿੰਤਤ ਜਾਂ ਨਿਰਾਸ਼ ਹੁੰਦੇ ਹੋ?",
      "ਕੀ ਤੁਸੀਂ ਸਮੂਹ ਚਰਚਾਵਾਂ ਵਿੱਚ ਆਸਾਨੀ ਨਾਲ ਭਾਗ ਲੈਂਦੇ ਹੋ?",
      "ਕੀ ਸੰਚਾਰ ਦੀਆਂ ਮੁਸ਼ਕਲਾਂ ਤੁਹਾਡੇ ਸਮਾਜਿਕ ਜੀਵਨ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀਆਂ ਹਨ?"
    ],
    speechAdultQuestions: [
      "ਕੀ ਤੁਹਾਨੂੰ ਦੂਜਿਆਂ ਨਾਲ ਸਪੱਸ਼ਟ ਰੂਪ ਵਿੱਚ ਗੱਲ ਕਰਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੁੰਦੀ ਹੈ?",
      "ਕੀ ਲੋਕ ਅਕਸਰ ਤੁਹਾਨੂੰ ਦੁਹਰਾਉਣ ਲਈ ਕਹਿੰਦੇ ਹਨ?",
      "ਕੀ ਤੁਹਾਨੂੰ ਬੋਲਦੇ ਸਮੇਂ ਹਕਲਾਹਟ ਜਾਂ ਝਿਜਕ ਹੁੰਦੀ ਹੈ?",
      "ਕੀ ਤੁਹਾਡੀ ਆਵਾਜ਼ ਅਕਸਰ ਖੁਰਦਰੀ ਜਾਂ ਕਮਜ਼ੋਰ ਲੱਗਦੀ ਹੈ?",
      "ਕੀ ਬੋਲਦੇ ਸਮੇਂ ਸਹੀ ਸ਼ਬਦ ਲੱਭਣਾ ਮੁਸ਼ਕਲ ਹੁੰਦਾ ਹੈ?",
      "ਕੀ ਸੰਚਾਰ ਦੀਆਂ ਮੁਸ਼ਕਲਾਂ ਤੁਹਾਡੇ ਕੰਮ ਜਾਂ ਸਮਾਜਿਕ ਜੀਵਨ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀਆਂ ਹਨ?",
      "ਕੀ ਤੁਸੀਂ ਸੰਚਾਰ ਦੀਆਂ ਚਿੰਤਾਵਾਂ ਕਾਰਨ ਗੱਲਬਾਤ ਤੋਂ ਬਚਦੇ ਹੋ?",
      "ਕੀ ਤੁਸੀਂ ਗੱਲਬਾਤ ਕਰਦੇ ਸਮੇਂ ਨਿਰਾਸ਼ ਮਹਿਸੂਸ ਕਰਦੇ ਹੋ?",
      "ਕੀ ਤੁਸੀਂ ਗੱਲਬਾਤ ਅਤੇ ਹਦਾਇਤਾਂ ਆਸਾਨੀ ਨਾਲ ਸਮਝ ਸਕਦੇ ਹੋ?",
      "ਕੀ ਤੁਸੀਂ ਹਾਲ ਹੀ ਵਿੱਚ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਬਦਲਾਅ ਦੇਖਿਆ ਹੈ?"
    ],
    speechSeniorQuestions: [
      "ਕੀ ਤੁਹਾਨੂੰ ਸਪੱਸ਼ਟ ਬੋਲਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੁੰਦੀ ਹੈ?",
      "ਕੀ ਗੱਲਬਾਤ ਦੌਰਾਨ ਅਕਸਰ ਸ਼ਬਦ ਲੱਭਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੁੰਦੀ ਹੈ?",
      "ਕੀ ਤੁਹਾਡੀ ਆਵਾਜ਼ ਕਮਜ਼ੋਰ ਜਾਂ ਖੁਰਦਰੀ ਹੋ ਗਈ ਹੈ?",
      "ਕੀ ਤੁਹਾਨੂੰ ਗੱਲਬਾਤ ਸਮਝਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੁੰਦੀ ਹੈ?",
      "ਕੀ ਸੰਚਾਰ ਦੀਆਂ ਮੁਸ਼ਕਲਾਂ ਰੋਜ਼ਾਨਾ ਜ਼ਿੰਦਗੀ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀਆਂ ਹਨ?",
      "ਕੀ ਤੁਸੀਂ ਸੰਚਾਰ ਦੀਆਂ ਚਿੰਤਾਵਾਂ ਕਾਰਨ ਗੱਲਬਾਤ ਤੋਂ ਬਚਦੇ ਹੋ?",
      "ਕੀ ਪਰਿਵਾਰ ਦੇ ਮੈਂਬਰ ਤੁਹਾਡੀ ਬੋਲੀ ਵਿੱਚ ਬਦਲਾਅ ਦੇਖਦੇ ਹਨ?",
      "ਕੀ ਤੁਸੀਂ ਗੱਲਬਾਤ ਕਰਦੇ ਸਮੇਂ ਨਿਰਾਸ਼ ਮਹਿਸੂਸ ਕਰਦੇ ਹੋ?",
      "ਕੀ ਤੁਸੀਂ ਆਪਣੀਆਂ ਲੋੜਾਂ ਆਸਾਨੀ ਨਾਲ ਦੱਸ ਸਕਦੇ ਹੋ?",
      "ਕੀ ਤੁਸੀਂ ਹਾਲ ਹੀ ਵਿੱਚ ਯਾਦਦਾਸ਼ਤ ਜਾਂ ਸੰਚਾਰ ਵਿੱਚ ਮੁਸ਼ਕਲਾਂ ਦੇਖੀਆਂ ਹਨ?"
    ],
    hearingResults: {
      noReferral: {
        title: "ਕੋਈ ਰੈਫਰਲ ਨਹੀਂ",
        highlight: "ਵਧਾਈ ਹੋਵੇ!",
        msg: "ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਇਸ ਸਮੇਂ ਤੁਹਾਨੂੰ ਮਹੱਤਵਪੂਰਨ ਸੁਣਨ ਦੀ ਮੁਸ਼ਕਲ ਨਹੀਂ ਜਾਪਦੀ।\n\nਵਿਸਤ੍ਰਿਤ ਮੁਲਾਂਕਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ 9548148852 'ਤੇ ਸੰਪਰਕ ਕਰੋ।"
      },
      refer: {
        title: "ਰੈਫਰਲ",
        highlight: "",
        msg: "ਸਾਡੇ ਔਨਲਾਈਨ ਹੀਅਰਿੰਗ ਸਕ੍ਰੀਨਿੰਗ ਟੂਲ ਦੀ ਵਰਤੋਂ ਕਰਨ ਲਈ ਧੰਨਵਾਦ।\n\nਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਸੁਣਨ ਦੀ ਕਠਿਨਾਈ ਦੇ ਸੰਕੇਤ ਹੋ ਸਕਦੇ ਹਨ।\n\nਕਿਰਪਾ ਕਰਕੇ 9548148852 'ਤੇ ਸੰਪਰਕ ਕਰੋ।",
        footer: "ਜਿੰਨੀ ਜਲਦੀ ਪਛਾਣ, ਉੱਨਾ ਆਸਾਨ ਹੱਲ।"
      }
    },
    speechResults: {
      speechChild: {
        green: { title: "ਕੋਈ ਵੱਡੀ ਚਿੰਤਾ ਨਹੀਂ", highlight: "ਵਧਾਈ ਹੋਵੇ!", msg: "ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਤੁਹਾਡੇ ਬੱਚੇ ਦਾ ਭਾਸ਼ਣ ਵਿਕਾਸ ਮਹੱਤਵਪੂਰਨ ਚਿੰਤਾਵਾਂ ਨਹੀਂ ਦਿਖਾਉਂਦਾ।" },
        yellow: { title: "ਭਾਸ਼ਣ ਵਿਕਾਸ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ", highlight: "", msg: "ਜਵਾਬ ਹਲਕੀ ਭਾਸ਼ਣ ਚਿੰਤਾਵਾਂ ਦਿਖਾਉਂਦੇ ਹਨ। ਜੇ ਚਿੰਤਾਵਾਂ ਵਧਣ, ਤਾਂ ਮਾਹਰ ਮੁਲਾਂਕਣ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।" },
        red: { title: "ਮਾਹਰ ਮੁਲਾਂਕਣ ਦੀ ਸਿਫਾਰਸ਼", highlight: "", msg: "ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਬੱਚੇ ਨੂੰ ਵਿਸਤ੍ਰਿਤ ਸਪੀਚ ਅਸੈਸਮੈਂਟ ਤੋਂ ਲਾਭ ਹੋ ਸਕਦਾ ਹੈ।", footer: "ਜਿੰਨੀ ਜਲਦੀ ਪਛਾਣ, ਉੱਨਾ ਆਸਾਨ ਵਿਕਾਸ।" }
      },
      speechTeen: {
        green: { title: "ਕੋਈ ਵੱਡੀ ਚਿੰਤਾ ਨਹੀਂ", highlight: "", msg: "ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਇਸ ਸਮੇਂ ਕੋਈ ਮਹੱਤਵਪੂਰਨ ਭਾਸ਼ਣ ਚਿੰਤਾ ਨਹੀਂ ਦਿੱਖਦੀ।" },
        yellow: { title: "ਸੰਚਾਰ ਵਿਕਾਸ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ", highlight: "", msg: "ਕੁਝ ਜਵਾਬ ਹਲਕੀ ਚਿੰਤਾਵਾਂ ਦਿਖਾਉਂਦੇ ਹਨ। ਮੁਸ਼ਕਲਾਂ ਜਾਰੀ ਰਹਿਣ ਤੇ ਮਾਹਰ ਤੋਂ ਸਲਾਹ ਲਓ।" },
        red: { title: "ਮਾਹਰ ਮੁਲਾਂਕਣ ਦੀ ਸਿਫਾਰਸ਼", highlight: "", msg: "ਜਵਾਬ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਵਿਸਤ੍ਰਿਤ ਸਪੀਚ ਅਸੈਸਮੈਂਟ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ।" }
      },
      speechAdult: {
        green: { title: "ਕੋਈ ਵੱਡੀ ਚਿੰਤਾ ਨਹੀਂ", highlight: "", msg: "ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਇਸ ਸਮੇਂ ਕੋਈ ਮਹੱਤਵਪੂਰਨ ਭਾਸ਼ਣ ਚਿੰਤਾ ਨਹੀਂ ਦਿੱਖਦੀ।" },
        yellow: { title: "ਸੰਚਾਰ ਸਿਹਤ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ", highlight: "", msg: "ਕੁਝ ਜਵਾਬ ਸੰਚਾਰ ਚਿੰਤਾਵਾਂ ਦਿਖਾਉਂਦੇ ਹਨ। ਮੁਸ਼ਕਲਾਂ ਵਧਣ ਤੇ ਮਾਹਰ ਸਲਾਹ ਦੀ ਸਿਫਾਰਸ਼ ਹੈ।" },
        red: { title: "ਮਾਹਰ ਮੁਲਾਂਕਣ ਦੀ ਸਿਫਾਰਸ਼", highlight: "", msg: "ਜਵਾਬ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਵਿਸਤ੍ਰਿਤ ਸਪੀਚ ਅਸੈਸਮੈਂਟ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ।" }
      },
      speechSenior: {
        green: { title: "ਕੋਈ ਵੱਡੀ ਚਿੰਤਾ ਨਹੀਂ", highlight: "", msg: "ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਇਸ ਸਮੇਂ ਕੋਈ ਮਹੱਤਵਪੂਰਨ ਸੰਚਾਰ ਚਿੰਤਾ ਨਹੀਂ ਦਿੱਖਦੀ।" },
        yellow: { title: "ਸੰਚਾਰ ਸਿਹਤ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ", highlight: "", msg: "ਕੁਝ ਜਵਾਬ ਹਲਕੀ ਸੰਚਾਰ ਚਿੰਤਾਵਾਂ ਦਿਖਾਉਂਦੇ ਹਨ ਜਿਨ੍ਹਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕੀਤੀ ਜਾਣੀ ਚਾਹੀਦੀ ਹੈ।" },
        red: { title: "ਮਾਹਰ ਮੁਲਾਂਕਣ ਦੀ ਸਿਫਾਰਸ਼", highlight: "", msg: "ਜਵਾਬ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਵਿਸਤ੍ਰਿਤ ਸਪੀਚ ਮੁਲਾਂਕਣ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ।" }
      }
    }
  }
};

const relations = [
  { id: 'mom', icon: <><circle cx="12" cy="7" r="4"/><path d="M6.5 21v-2a5.5 5.5 0 0 1 11 0v2"/><path d="M4 21h16"/></> },
  { id: 'dad', icon: <><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></> },
  { id: 'grandfather', icon: <><circle cx="9" cy="7" r="3"/><path d="M3 21v-1a6 6 0 0 1 9-5.5"/><path d="M19 13v8"/><path d="M17 15h4"/></> },
  { id: 'grandmother', icon: <><circle cx="10" cy="8" r="3"/><circle cx="13" cy="4" r="1.5"/><path d="M4 21v-1a6 6 0 0 1 9.5-5.5"/><path d="M2 21h14"/></> },
  { id: 'son', icon: <><circle cx="12" cy="8" r="3.5"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/></> },
  { id: 'daughter', icon: <><circle cx="12" cy="8" r="3.5"/><path d="M8 21v-1a4 4 0 0 1 8 0v1"/><path d="M5 21h14"/></> },
  { id: 'friend', icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"/> },
  { id: 'other', icon: <path d="M12 5v14 M5 12h14"/> }
];

// Positive question indices per speech age group (Yes=0, Sometimes=2, No=4)
const SPEECH_POSITIVE_IDX: Record<string, number[]> = {
  speechChild: [0, 1, 2, 3, 4, 8],
  speechTeen: [0, 8],
  speechAdult: [8],
  speechSenior: [8],
};

export default function AssessmentQuiz() {
  const [lang, setLang] = useState<Language>('en');
  const [mode, setMode] = useState<'select' | 'hearing' | 'speech'>('select');
  const [introMode, setIntroMode] = useState<'hearing' | 'speech' | null>(null);
  const t = T[lang];

  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [name, setName] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [email, setEmail] = useState("");
  const [showResults, setShowResults] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);
  const [mobileTouched, setMobileTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);


  useEffect(() => {
    const titleEl = document.getElementById('assessment-title');
    const descEl = document.getElementById('assessment-desc');
    
    if (titleEl && descEl) {
      if (mode === 'speech') {
        titleEl.innerHTML = lang === 'hi' 
          ? `2-मिनट स्पीच और लैंग्वेज <span class="text-primary drop-shadow-[0_0_15px_rgba(238,49,55,0.3)]">स्क्रीनिंग।</span>`
          : lang === 'pa'
          ? `2-ਮਿੰਟ ਸਪੀਚ ਅਤੇ ਲੈਂਗੂਏਜ <span class="text-primary drop-shadow-[0_0_15px_rgba(238,49,55,0.3)]">ਸਕ੍ਰੀਨਿੰਗ।</span>`
          : `2-Minute Speech & Language <span class="text-primary drop-shadow-[0_0_15px_rgba(238,49,55,0.3)]">Screening.</span>`;
        descEl.innerHTML = lang === 'hi'
          ? `अपने संचार स्वास्थ्य के बारे में त्वरित जानकारी प्राप्त करने के लिए कुछ सरल प्रश्नों के उत्तर दें।`
          : lang === 'pa'
          ? `ਆਪਣੀ ਸੰਚਾਰ ਸਿਹਤ ਬਾਰੇ ਤੁਰੰਤ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕੁਝ ਸਧਾਰਨ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ।`
          : `Answer a few simple questions to get instant insights into your communication health.`;
      } else if (mode === 'hearing') {
        titleEl.innerHTML = lang === 'hi'
          ? `2-मिनट हियरिंग <span class="text-primary drop-shadow-[0_0_15px_rgba(238,49,55,0.3)]">स्क्रीनिंग।</span>`
          : lang === 'pa'
          ? `2-ਮਿੰਟ ਹੀਅਰਿੰਗ <span class="text-primary drop-shadow-[0_0_15px_rgba(238,49,55,0.3)]">ਸਕ੍ਰੀਨਿੰਗ।</span>`
          : `2-Minute Hearing <span class="text-primary drop-shadow-[0_0_15px_rgba(238,49,55,0.3)]">Screening.</span>`;
        descEl.innerHTML = lang === 'hi'
          ? `अपने श्रवण स्वास्थ्य के बारे में त्वरित जानकारी प्राप्त करने के लिए कुछ सरल प्रश्नों के उत्तर दें।`
          : lang === 'pa'
          ? `ਆਪਣੀ ਸੁਣਨ ਦੀ ਸਿਹਤ ਬਾਰੇ ਤੁਰੰਤ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕੁਝ ਸਧਾਰਨ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ।`
          : `Answer a few simple questions to get instant insights into your auditory health.`;
      } else {
        titleEl.innerHTML = lang === 'hi'
          ? `मुफ़्त ऑनलाइन <span class="text-primary drop-shadow-[0_0_15px_rgba(238,49,55,0.3)]">स्क्रीनिंग।</span>`
          : lang === 'pa'
          ? `ਮੁਫ਼ਤ ਆਨਲਾਈਨ <span class="text-primary drop-shadow-[0_0_15px_rgba(238,49,55,0.3)]">ਸਕ੍ਰੀਨਿੰਗ।</span>`
          : `Free Online <span class="text-primary drop-shadow-[0_0_15px_rgba(238,49,55,0.3)]">Screening.</span>`;
        descEl.innerHTML = lang === 'hi'
          ? `अपने सुनने या बोलने के स्वास्थ्य के बारे में त्वरित जानकारी प्राप्त करने के लिए नीचे दिए गए मूल्यांकन का चयन करें।`
          : lang === 'pa'
          ? `ਆਪਣੀ ਸੁਣਨ ਜਾਂ ਬੋਲਣ ਦੀ ਸਿਹਤ ਬਾਰੇ ਤੁਰੰਤ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਮੁਲਾਂਕਣ ਦੀ ਚੋਣ ਕਰੋ।`
          : `Select a screening below to get instant insights into your hearing or speech health.`;
      }
    }
  }, [mode, lang]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('mode');
    if (m === 'hearing' || m === 'speech') setIntroMode(m);
  }, []);

  const buildFlow = () => {
    let flow: any[] = [];
    if (mode === 'select') return flow;

    flow.push({ id: 'subject', type: 'choice', q: t.whoIsTaking, options: [{ l: t.myself, v: 'self' }, { l: t.lovedOne, v: 'other' }] });
    flow.push({ id: 'relation', type: 'visual', q: t.relation, condition: (ans: any) => ans.subject === 'other' });

    if (mode === 'hearing') {
      flow.push({ id: 'age', type: 'choice', q: t.age, options: [{ l: t.child, v: 'child' }, { l: t.youngAdult, v: 'young' }, { l: t.adult, v: 'adult' }, { l: t.senior, v: 'senior' }] });
      flow.push({ id: 'gender', type: 'choice', q: t.gender, options: [{ l: t.male, v: 'male' }, { l: t.female, v: 'female' }, { l: t.genderOther, v: 'other' }] });
      t.childQuestions.forEach((q, i) => {
        const isPositive = i === 0;
        const opts = isPositive 
          ? [{ l: t.yes, v: 0 }, { l: t.sometimes, v: 2 }, { l: t.no, v: 4 }]
          : [{ l: t.yes, v: 4 }, { l: t.sometimes, v: 2 }, { l: t.no, v: 0 }];
        flow.push({ id: `ch_${i}`, type: 'choice', q, options: opts, condition: (ans: any) => ans.age === 'child' });
      });
      t.hhieQuestions.forEach((q, i) => {
        flow.push({ id: `hhie_${i}`, type: 'choice', q, options: [{ l: t.yes, v: 4 }, { l: t.sometimes, v: 2 }, { l: t.no, v: 0 }], condition: (ans: any) => ans.age !== 'child' });
      });
    } else {
      flow.push({ id: 'speechAge', type: 'choice', q: t.speechAgeLabel, options: [
        { l: t.speechChildLabel, v: 'speechChild' },
        { l: t.speechTeenLabel, v: 'speechTeen' },
        { l: t.speechAdultLabel, v: 'speechAdult' },
        { l: t.speechSeniorLabel, v: 'speechSenior' },
      ]});
      flow.push({ id: 'gender', type: 'choice', q: t.gender, options: [{ l: t.male, v: 'male' }, { l: t.female, v: 'female' }, { l: t.genderOther, v: 'other' }] });

      const speechGroups: Record<string, { prefix: string; questions: readonly string[] }> = {
        speechChild: { prefix: 'spc', questions: t.speechChildQuestions },
        speechTeen: { prefix: 'spt', questions: t.speechTeenQuestions },
        speechAdult: { prefix: 'spa', questions: t.speechAdultQuestions },
        speechSenior: { prefix: 'sps', questions: t.speechSeniorQuestions },
      };
      Object.entries(speechGroups).forEach(([ageKey, { prefix, questions }]) => {
        const positiveIdx = SPEECH_POSITIVE_IDX[ageKey];
        questions.forEach((q, i) => {
          const isPositive = positiveIdx.includes(i);
          const opts = isPositive
            ? [{ l: t.yes, v: 0 }, { l: t.sometimes, v: 2 }, { l: t.no, v: 4 }]
            : [{ l: t.yes, v: 4 }, { l: t.sometimes, v: 2 }, { l: t.no, v: 0 }];
          flow.push({ id: `${prefix}_${i}`, type: 'choice', q, options: opts, condition: (ans: any) => ans.speechAge === ageKey });
        });
      });
    }
    return flow;
  };

  const quizFlow = useMemo(() => buildFlow(), [mode, lang]);

  const currentQuestionId = history.length > 0 ? history[history.length - 1] : (quizFlow.length > 0 ? quizFlow[0].id : null);
  const currentQuestionIndex = quizFlow.findIndex(q => q.id === currentQuestionId);
  const currentQuestion = quizFlow[currentQuestionIndex];

  const totalQuestions = useMemo(() => quizFlow.filter(q => !q.condition || q.condition(answers)).length, [answers, quizFlow]);

  const handleAnswer = (value: Answer) => {
    if (animating) return;
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    setAnimating(true);
    setTimeout(() => {
      let nextIndex = currentQuestionIndex + 1;
      let foundNext = false;
      while (nextIndex < quizFlow.length) {
        const nextQ = quizFlow[nextIndex];
        if (!nextQ.condition || nextQ.condition(newAnswers)) {
          setHistory([...history, nextQ.id]);
          foundNext = true;
          break;
        }
        nextIndex++;
      }
      if (!foundNext) setIsComplete(true);
      setAnimating(false);
    }, 400);
  };

  const handleBack = () => {
    if (history.length <= 1 || animating) return;
    setAnimating(true);
    setTimeout(() => {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setAnimating(false);
    }, 300);
  };

  const startQuiz = (m: 'hearing' | 'speech') => {
    setMode(m);
    setHistory(['subject']);
    setAnswers({});
    setIsComplete(false);
    setShowResults(false);
    setName("");
    setMobileNum("");
    setEmail("");
  };

  const calculateScore = () => {
    let score = 0;
    Object.keys(answers).forEach(k => {
      if (
        (k.startsWith('hhie_') || k.startsWith('ch_') ||
         k.startsWith('spc_') || k.startsWith('spt_') ||
         k.startsWith('spa_') || k.startsWith('sps_')) &&
        typeof answers[k] === 'number'
      ) {
        score += answers[k] as number;
      }
    });
    return score;
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const langMap: Record<Language, string> = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN' };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang];
    utterance.rate = 0.88;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const renderIntro = () => {
    const isHearing = introMode === 'hearing';
    const introBody = isHearing ? t.hearingIntroBody : t.speechIntroBody;
    const instructions = isHearing ? t.hearingInstructions : t.speechInstructions;
    const title = isHearing ? t.hearingScreening : t.speechScreening;
    const accentColor = isHearing ? '#EE3137' : '#f97316';

    return (
      <div className="w-full max-w-2xl mx-auto">
        {/* Language selector — always visible */}
        <div className="flex justify-center gap-3 mb-6">
          {(['en', 'hi', 'pa'] as Language[]).map(l => (
            <button key={l} onClick={() => setLang(l)} className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition-all ${lang === l ? 'bg-primary border-primary text-white' : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'}`}>
              {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
            </button>
          ))}
        </div>
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}></div>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" style={{ background: `${accentColor}18` }}></div>
          <button onClick={() => setIntroMode(null)} className="mb-6 p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-6 relative z-10">{title}</h2>
          {isHearing && (
            <div className="inline-block bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6 relative z-10">
              <p className="text-white/90 font-medium text-sm tracking-wide">{t.hearingIntroStat}</p>
            </div>
          )}
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 relative z-10">{introBody}</p>
          <div className="h-px bg-gradient-to-r from-white/20 to-transparent mb-8"></div>
          <div className="mb-8 relative z-10">
            <h3 className="text-white font-semibold text-lg mb-3">Instructions</h3>
            <p className="text-white/60 text-sm leading-relaxed">{instructions}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 relative z-10">
            <h4 className="text-white/80 font-semibold text-sm mb-4 uppercase tracking-widest">{t.colourGuide}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-red-500 shrink-0"></span><span className="text-white/70 text-sm">{t.colourRed}</span></div>
              <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-orange-500 shrink-0"></span><span className="text-white/70 text-sm">{t.colourOrange}</span></div>
              <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-green-500 shrink-0"></span><span className="text-white/70 text-sm">{t.colourGreen}</span></div>
            </div>
          </div>
          <button onClick={() => { startQuiz(introMode!); setIntroMode(null); }} className="w-full py-4 rounded-2xl font-semibold text-lg text-white transition-all hover:scale-[1.02] hover:shadow-xl relative z-10" style={{ background: accentColor }}>
            {t.beginScreening}
          </button>
        </div>
      </div>
    );
  };

  if (introMode !== null) return renderIntro();
  if (mode === 'select') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex justify-center gap-4 mb-8">
          {(['en', 'hi', 'pa'] as Language[]).map(l => (
            <button key={l} onClick={() => setLang(l)} className={`px-6 py-2 rounded-full font-semibold border transition-all ${lang === l ? 'bg-primary border-primary text-white' : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'}`}>
              {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => setIntroMode('hearing')} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 hover:bg-white/10 transition-all text-left group flex flex-col justify-between h-64">
            <h2 className="text-3xl font-semibold text-white tracking-tight">{t.hearingScreening}</h2>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              {/* Ear icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 0 4 0"/></svg>
            </div>
          </button>
          <button onClick={() => setIntroMode('speech')} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 hover:bg-white/10 transition-all text-left group flex flex-col justify-between h-64">
            <h2 className="text-3xl font-semibold text-white tracking-tight">{t.speechScreening}</h2>
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              {/* Speech bubble icon — 15th feedback */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="9" x2="15" y2="9" strokeWidth="1.5"/><line x1="9" y1="12.5" x2="13" y2="12.5" strokeWidth="1.5"/></svg>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Verification screen — 12th feedback & 4th Form Validation
  if (isComplete && !showResults) {
    const isNameValid = /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
    const isMobileValid = /^\d+$/.test(mobileNum) && mobileNum.trim().length >= 10;
    const isEmailValid = email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const canView = isNameValid && isMobileValid && isEmailValid;

    const countryCodes = [
      { code: '+91', label: '🇮🇳 +91' },
      { code: '+1', label: '🇺🇸 +1' },
      { code: '+44', label: '🇬🇧 +44' },
      { code: '+61', label: '🇦🇺 +61' },
      { code: '+971', label: '🇦🇪 +971' }
    ];

    return (
      <div className="w-full max-w-lg mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">{t.resultsReadyTitle}</h2>
          <p className="text-white/60 mt-2 text-sm leading-relaxed">{t.resultsReadySub}</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">{t.nameLabel} <span className="text-red-400">*</span></label>
            <input type="text" value={name} onChange={e => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} onBlur={() => setNameTouched(true)} className={`w-full bg-black/20 border ${nameTouched && !isNameValid ? 'border-red-500 focus:ring-red-500/50' : 'border-white/10 focus:ring-primary/50'} rounded-xl px-4 py-4 text-white font-medium focus:outline-none focus:ring-2 placeholder-white/30`} placeholder="Enter full name" />
            {nameTouched && !isNameValid && <p className="text-red-400 text-xs mt-1">Please enter a valid name (letters only, min 2 chars)</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">{t.mobileNum} <span className="text-red-400">*</span></label>
            <div className="flex gap-2">
              <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="w-1/3 sm:w-1/4 bg-black/20 border border-white/10 rounded-xl px-2 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none text-center cursor-pointer">
                {countryCodes.map(c => <option key={c.code} value={c.code} className="text-black">{c.label}</option>)}
              </select>
              <input type="tel" value={mobileNum} onChange={e => setMobileNum(e.target.value.replace(/\D/g, ''))} onBlur={() => setMobileTouched(true)} className={`flex-1 bg-black/20 border ${mobileTouched && !isMobileValid ? 'border-red-500 focus:ring-red-500/50' : 'border-white/10 focus:ring-primary/50'} rounded-xl px-4 py-4 text-white font-medium focus:outline-none focus:ring-2 placeholder-white/30`} placeholder="98765 43210" maxLength={15} />
            </div>
            {mobileTouched && !isMobileValid && <p className="text-red-400 text-xs mt-1">Please enter a valid mobile number (min 10 digits)</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">{t.emailLabel} <span className="text-white/30 font-normal text-xs ml-1">(Optional)</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)} className={`w-full bg-black/20 border ${emailTouched && !isEmailValid ? 'border-red-500 focus:ring-red-500/50' : 'border-white/10 focus:ring-primary/50'} rounded-xl px-4 py-4 text-white font-medium focus:outline-none focus:ring-2 placeholder-white/30`} placeholder="email@example.com" />
            {emailTouched && !isEmailValid && <p className="text-red-400 text-xs mt-1">Please enter a valid email address</p>}
          </div>
          <button onClick={() => setShowResults(true)} disabled={!canView} className={`w-full rounded-xl px-4 py-4 font-semibold text-lg transition-all mt-6 ${canView ? 'bg-primary text-white hover:bg-primary-hover shadow-lg cursor-pointer' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
            {t.viewResultsBtn}
          </button>
        </div>
      </div>
    );
  }

  const renderResult = () => {
    const score = calculateScore();
    const speechAge = answers.speechAge as string;

    let resultTitle = "";
    let resultHighlight = "";
    let resultMsg = "";
    let resultFooter = "";
    let gaugeColor = "#22c55e";
    let maxScore = 40;
    let pct = 0;

    if (mode === 'hearing') {
      const isChild = answers.age === 'child';
      const tier = isChild ? (score < 12 ? 'noReferral' : 'refer') : (score < 10 ? 'noReferral' : 'refer');
      const r = t.hearingResults[tier];
      resultTitle = r.title;
      resultHighlight = r.highlight;
      resultMsg = r.msg;
      resultFooter = (r as any).footer ?? "";
      gaugeColor = tier === 'noReferral' ? '#22c55e' : '#ff4444';
      maxScore = isChild ? 48 : 40;
      pct = Math.min(score / maxScore, 1);
    } else {
      const isChild = speechAge === 'speechChild';
      maxScore = isChild ? 52 : 40;
      let tier: 'green' | 'yellow' | 'red';
      if (isChild) {
        tier = score < 14 ? 'green' : score < 28 ? 'yellow' : 'red';
      } else {
        tier = score < 10 ? 'green' : score < 22 ? 'yellow' : 'red';
      }
      const speechResultsMap = t.speechResults as any;
      const r = speechResultsMap[speechAge]?.[tier] ?? { title: "", highlight: "", msg: "" };
      resultTitle = r.title;
      resultHighlight = r.highlight;
      resultMsg = r.msg;
      resultFooter = r.footer ?? "";
      gaugeColor = tier === 'green' ? '#22c55e' : tier === 'yellow' ? '#f97316' : '#ff4444';
      pct = Math.min(score / maxScore, 1);
    }

    const R = 80;
    const circ = 2 * Math.PI * R;
    const semi = circ / 2;
    const dashOffset = semi * (1 - pct);

    const msgParagraphs = resultMsg.split('\n\n');

    return (
      <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 p-8 md:p-14 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, ${gaugeColor}, transparent)` }}></div>

        {/* Gauge — no score number */}
        <div className="relative w-48 mx-auto mb-6">
          <svg viewBox="0 0 200 108" className="w-full overflow-visible">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14"
              strokeDasharray={`${semi.toFixed(1)} ${circ.toFixed(1)}`} transform="rotate(180 100 100)" strokeLinecap="round" />
            <circle cx="100" cy="100" r={R} fill="none" stroke={gaugeColor} strokeWidth="14"
              strokeDasharray={`${semi.toFixed(1)} ${circ.toFixed(1)}`} strokeDashoffset={dashOffset.toFixed(1)}
              transform="rotate(180 100 100)" strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
          </svg>
          {/* Tier indicator dot */}
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span className="w-4 h-4 rounded-full border-2 border-white/30" style={{ background: gaugeColor, boxShadow: `0 0 12px ${gaugeColor}80` }}></span>
          </div>
        </div>

        <h3 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-tight">{resultTitle}</h3>
        {resultHighlight && <p className="text-xl font-semibold mb-4" style={{ color: gaugeColor }}>{resultHighlight}</p>}

        <div className="text-white/70 text-base font-medium leading-relaxed mb-8 max-w-2xl mx-auto space-y-3 text-left">
          {msgParagraphs.map((para, i) => <p key={i}>{para}</p>)}
        </div>

        {resultFooter && (
          <div className="mb-8 p-4 rounded-2xl border" style={{ borderColor: `${gaugeColor}40`, background: `${gaugeColor}10` }}>
            <p className="font-semibold text-base" style={{ color: gaugeColor }}>{resultFooter}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={`${import.meta.env.BASE_URL}contact`} className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary-hover hover:scale-105 transition-all shadow-xl">
            {t.bookAssessment}
          </a>
          <button onClick={() => setMode('select')} className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all">
            {t.retake}
          </button>
        </div>
      </div>
    );
  };

  if (!currentQuestion && !isComplete) return null;

  // Colour by button POSITION (idx 0=Yes=green, 1=Sometimes=orange, 2=No=red)
  // This keeps visual consistency regardless of underlying score direction
  const positionColourMap: Array<{ selected: string; unselected: string }> = [
    { selected: 'bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.25)]',  unselected: 'bg-white/5 border-white/10 hover:border-green-400/50 hover:bg-green-500/10' },
    { selected: 'bg-orange-500/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]', unselected: 'bg-white/5 border-white/10 hover:border-orange-400/50 hover:bg-orange-500/10' },
    { selected: 'bg-red-500/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]',    unselected: 'bg-white/5 border-white/10 hover:border-red-400/50 hover:bg-red-500/10' },
  ];
  const positionDotColour: string[] = ['bg-green-500', 'bg-orange-500', 'bg-red-500'];

  const speechAgeTaken = mode === 'speech' && answers.speechAge;
  const hearingChildTaken = mode === 'hearing' && answers.age === 'child';
  
  const responderNote = speechAgeTaken ? ({
    speechChild: t.speechChildResponder,
    speechTeen: t.speechTeenResponder,
    speechAdult: t.speechAdultResponder,
    speechSenior: t.speechSeniorResponder,
  }[answers.speechAge as string] ?? '') : (hearingChildTaken ? t.hearingChildResponder : '');

  const isScoringQ = currentQuestion && (
    currentQuestion.id.startsWith('hhie_') || currentQuestion.id.startsWith('ch_') ||
    currentQuestion.id.startsWith('spc_') || currentQuestion.id.startsWith('spt_') ||
    currentQuestion.id.startsWith('spa_') || currentQuestion.id.startsWith('sps_')
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isComplete && showResults ? renderResult() : (
        <div className="relative">
          <div className="mb-6 md:mb-10 flex items-center gap-4 md:gap-6">
            <button onClick={handleBack} disabled={history.length <= 1} className={`p-3 rounded-full border transition-all ${history.length <= 1 ? 'border-white/5 text-white/20 cursor-not-allowed' : 'border-white/20 text-white hover:bg-white/10'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${(history.length / totalQuestions) * 100}%` }} />
            </div>
            {/* Compact language switcher always accessible in quiz */}
            <div className="flex gap-1.5">
              {(['en', 'hi', 'pa'] as Language[]).map(l => (
                <button key={l} onClick={() => { setLang(l); setHistory(['subject']); setAnswers({}); }} title={l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'} className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${lang === l ? 'bg-primary border-primary text-white' : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20'}`}>
                  {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'ਪੰ'}
                </button>
              ))}
            </div>
            <button onClick={() => setMode('select')} className="text-white/60 font-medium text-sm hover:text-white uppercase tracking-widest">Quit</button>
          </div>

          {responderNote && currentQuestion && currentQuestion.id !== 'speechAge' && (
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                {responderNote}
              </span>
            </div>
          )}

          <div className={`transition-all duration-400 ${animating ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[24px] md:rounded-[32px] p-6 md:p-10 lg:p-12 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              {currentQuestion && (
                <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
                  <h2 className="text-2xl md:text-4xl font-semibold text-white leading-tight tracking-tight flex-1 text-center">
                    {currentQuestion.q}
                  </h2>
                  <button
                    onClick={() => {
                      if (lang !== 'pa') {
                        const optionsText = currentQuestion.options ? currentQuestion.options.map((o: any) => o.l).join('. ') : '';
                        speak(`${currentQuestion.q}. ${optionsText}`);
                      }
                    }}
                    title={lang === 'pa' ? "Audio not available in Punjabi" : "Listen"}
                    disabled={lang === 'pa'}
                    className={`shrink-0 mt-1 w-9 h-9 rounded-full flex items-center justify-center transition-all ${lang === 'pa' ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white/60 hover:text-white cursor-pointer'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  </button>
                </div>
              )}

              {currentQuestion && currentQuestion.type === 'choice' && (() => {
                return (
                  <div className={`grid gap-3 md:gap-4 relative z-10 ${currentQuestion.options.length > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {currentQuestion.options.map((option: any, idx: number) => {
                      const isSelected = answers[currentQuestion.id] === option.v;
                      // For scoring questions use position-based colours (Yes=green, Sometimes=orange, No=red)
                      const posColours = isScoringQ && typeof option.v === 'number' ? positionColourMap[idx] ?? positionColourMap[0] : null;
                      const btnClass = posColours
                        ? (isSelected ? posColours.selected : posColours.unselected)
                        : (isSelected ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(238,49,55,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10');
                      return (
                        <button key={idx} onClick={() => handleAnswer(option.v)} className={`group relative overflow-hidden border rounded-xl md:rounded-2xl p-4 md:p-6 text-left transition-all duration-300 ${btnClass}`}>
                          <div className="flex items-center gap-3">
                            {isScoringQ && typeof option.v === 'number' && (
                              <span className={`w-3 h-3 rounded-full shrink-0 ${positionDotColour[idx] ?? 'bg-green-500'}`}></span>
                            )}
                            <span className="text-lg md:text-xl font-semibold text-white flex-1">{option.l}</span>
                            {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

              {currentQuestion && currentQuestion.type === 'visual' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                  {relations.map((rel) => {
                    const isSelected = answers[currentQuestion.id] === rel.id;
                    return (
                      <button key={rel.id} onClick={() => handleAnswer(rel.id)} className={`flex flex-col items-center justify-center p-6 border rounded-[24px] transition-all duration-300 ${isSelected ? 'bg-primary/20 border-primary shadow-lg scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                        <div className="w-16 h-16 rounded-full bg-white/10 mb-4 flex items-center justify-center text-white/80">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{rel.icon}</svg>
                        </div>
                        <span className="text-white font-semibold capitalize">{(t as any)[rel.id] || rel.id}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
