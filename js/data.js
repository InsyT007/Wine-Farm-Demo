/**
 * Cape Town Farm — Enterprise Seed Data & Mock Architecture
 * Represents the initial database records for the agricultural estate prototype.
 */

export const INITIAL_DEPARTMENTS = [
  'Operations',
  'Vineyard',
  'Citrus',
  'Livestock',
  'Technical & Maintenance',
  'Administration & Finance',
  'Quality & Compliance',
  'Hospitality & Cellar'
];

export const INITIAL_JOBS = [
  {
    id: 'job-101',
    title: 'Senior Vineyard Manager',
    department: 'Vineyard',
    location: 'Stellenbosch / Cape Town Estate',
    type: 'Full-time',
    salary: 'ZAR 45,000 – 60,000 / month (Demonstration Range)',
    closingDate: '2026-09-30',
    status: 'published',
    createdBy: 'Helena van der Merwe (HR Lead)',
    createdAt: '2026-08-01',
    approvedBy: 'Kobus Malan (Operations Director)',
    approvedAt: '2026-08-03',
    description: 'We are seeking an experienced Senior Vineyard Manager to oversee 85 hectares of premium wine grape cultivars. You will lead soil stewardship, canopy management, sustainable irrigation, and harvest planning in close partnership with the Cellar Master.',
    responsibilities: [
      'Manage daily viticulture operations across Shiraz, Cabernet Sauvignon, Pinotage, and Chenin Blanc blocks.',
      'Supervise and mentor a seasonal and permanent team of 30+ vineyard operators.',
      'Execute precision irrigation and solar-powered moisture probe telemetry monitoring.',
      'Maintain rigorous organic and biological pest management standards in alignment with our sustainability charter.',
      'Collaborate with the Cellar Master during veraison and harvest to optimize phenolic ripeness and yield quality.'
    ],
    requirements: [
      'Tertiary qualification in Viticulture, Agronomy, or Agricultural Science (or equivalent practical experience).',
      'Minimum 6+ years in commercial wine grape production with leadership responsibility.',
      'Valid Code 08 / EB Drivers Licence.',
      'Proven knowledge of Cape floral terroir, integrated pest management (IPM), and GlobalG.A.P. standards.',
      'Fluent communication in English and Afrikaans or isiXhosa is advantageous.'
    ],
    customQuestions: [
      {
        id: 'q1',
        label: 'Years of practical experience in Cape viticulture or wine grape management:',
        type: 'select',
        options: ['1 - 3 years', '4 - 7 years', '8 - 12 years', '13+ years'],
        required: true
      },
      {
        id: 'q2',
        label: 'Which cultivars have you directly managed at harvest scale?',
        type: 'checkbox',
        options: ['Cabernet Sauvignon', 'Shiraz / Syrah', 'Chenin Blanc', 'Pinotage', 'Sauvignon Blanc', 'Other Red/White Varietals'],
        required: true
      },
      {
        id: 'q3',
        label: 'Describe your approach to water scarcity and canopy management during dry Cape summers:',
        type: 'textarea',
        placeholder: 'Briefly outline your irrigation scheduling, mulch application, and canopy density strategies...',
        required: true
      },
      {
        id: 'q4',
        label: 'Do you hold a valid pesticide application / chemical handling certificate (AVCASA / equivalent)?',
        type: 'radio',
        options: ['Yes, fully certified & valid', 'Previously certified (needs renewal)', 'No, but willing to certify'],
        required: true
      }
    ],
    requiredDocuments: ['cv', 'id', 'qualifications', 'license'],
    optionalDocuments: ['certificates', 'references']
  },
  {
    id: 'job-102',
    title: 'Agricultural Equipment & Fleet Technician',
    department: 'Technical & Maintenance',
    location: 'Cape Town Farm Workshop',
    type: 'Full-time',
    salary: 'ZAR 28,000 – 38,000 / month (Demonstration Range)',
    closingDate: '2026-09-25',
    status: 'published',
    createdBy: 'Helena van der Merwe (HR Lead)',
    createdAt: '2026-08-05',
    approvedBy: 'Kobus Malan (Operations Director)',
    approvedAt: '2026-08-06',
    description: 'Responsible for hands-on preventative maintenance, hydraulic troubleshooting, and emergency field repairs across our fleet of tractors, orchard sprayers, harvesters, and solar pump stations.',
    responsibilities: [
      'Service and maintain John Deere / Landini agricultural tractors, spray rigs, and hydraulic attachments.',
      'Maintain diesel telemetry logs and scheduled oil sampling records.',
      'Diagnose electrical, mechanical, and PTO faults in field conditions during critical harvest windows.',
      'Ensure strict safety compliance in the central workshop and chemical wash bays.',
      'Manage inventory of critical spares, bearings, hydraulic seals, and filters.'
    ],
    requirements: [
      'Trade Tested Diesel Mechanic, Agricultural Mechanic, or Millwright certification.',
      '3+ years hands-on experience maintaining agricultural tractors, implements, or heavy earthmoving equipment.',
      'Valid Code 10 or Code 14 Driver\'s License preferred.',
      'Strong diagnostic skills for electro-hydraulic systems and diesel injectors.'
    ],
    customQuestions: [
      {
        id: 'q1',
        label: 'Are you a certified Trade-Tested Artisan (Diesel Mechanic / Millwright / Agricultural)?',
        type: 'radio',
        options: ['Yes — Section 13 / 26D Trade Test Certified', 'Semi-skilled with 5+ years field experience', 'In apprenticeship training'],
        required: true
      },
      {
        id: 'q2',
        label: 'Primary equipment brands you have practical overhaul experience with:',
        type: 'checkbox',
        options: ['John Deere', 'Massey Ferguson', 'Landini / McCormick', 'New Holland', 'Kubota', 'Hydraulic Spray Rigs'],
        required: true
      },
      {
        id: 'q3',
        label: 'Driver\'s License Code held:',
        type: 'select',
        options: ['Code 08 (B/EB)', 'Code 10 (C1/EC1)', 'Code 14 (EC)', 'Tractor Operating Permit only'],
        required: true
      }
    ],
    requiredDocuments: ['cv', 'id', 'license'],
    optionalDocuments: ['qualifications', 'certificates']
  },
  {
    id: 'job-103',
    title: 'Citrus Orchard Team Supervisor',
    department: 'Citrus',
    location: 'Cape Town Farm Orchards',
    type: 'Full-time',
    salary: 'ZAR 22,000 – 30,000 / month (Demonstration Range)',
    closingDate: '2026-09-18',
    status: 'published',
    createdBy: 'Helena van der Merwe (HR Lead)',
    createdAt: '2026-08-08',
    approvedBy: 'Kobus Malan (Operations Director)',
    approvedAt: '2026-08-09',
    description: 'We are expanding our citrus orchards (Navels, Valencias, and Clementines). The Orchard Supervisor coordinates pruning, blossom care, integrated pest scouting, and field-to-packhouse harvest logistics.',
    responsibilities: [
      'Oversee orchard teams across 60 hectares of high-density citrus groves.',
      'Conduct weekly tree inspections for red scale, citrus thrips, and false codling moth.',
      'Coordinate accurate harvest picking buckets, bins, and transport to the cold storage packhouse.',
      'Supervise daily timekeeping, field occupational health & safety, and PPE distribution.'
    ],
    requirements: [
      'National Diploma in Agriculture or Citrus Production certificate (or 4+ years supervisory experience).',
      'Knowledge of export citrus quality standards (DAFF / CRI export protocols).',
      'Strong leadership skills and empathetic communication with farm teams.'
    ],
    customQuestions: [
      {
        id: 'q1',
        label: 'Years of supervisory experience in fruit or citrus orchards:',
        type: 'select',
        options: ['1 - 2 years', '3 - 5 years', '6+ years'],
        required: true
      },
      {
        id: 'q2',
        label: 'Experience with GlobalG.A.P. and export quality grading protocols:',
        type: 'radio',
        options: ['Extensive hands-on experience', 'Basic working knowledge', 'None, but quick to learn'],
        required: true
      }
    ],
    requiredDocuments: ['cv', 'id'],
    optionalDocuments: ['qualifications', 'references']
  },
  {
    id: 'job-104',
    title: 'Livestock & Pasture Assistant',
    department: 'Livestock',
    location: 'Cape Town Farm Pastures',
    type: 'Full-time',
    salary: 'ZAR 16,000 – 22,000 / month (Demonstration Range)',
    closingDate: '2026-09-22',
    status: 'published',
    createdBy: 'Helena van der Merwe (HR Lead)',
    createdAt: '2026-08-10',
    approvedBy: 'Kobus Malan (Operations Director)',
    approvedAt: '2026-08-11',
    description: 'Support daily ethical livestock husbandry for our grass-fed cattle herd and free-range flocks. Responsibilities include rotational strip grazing, fence maintenance, veterinary record-keeping, and animal welfare checks.',
    responsibilities: [
      'Manage daily rotational grazing paddocks and mobile solar fencing infrastructure.',
      'Administer planned inoculations, tick management, and mineral lick distributions under veterinary guidance.',
      'Maintain fresh water troughs, telemetry sensors, and pasture shade infrastructure.',
      'Assist in calving season monitoring and newborn animal identification tagging.'
    ],
    requirements: [
      'Prior experience in cattle or livestock farming in a South African pastoral setting.',
      'Genuine passion for low-stress animal handling and regenerative grazing practices.',
      'Physically fit, reliable, and willing to work outdoors in all weather conditions.'
    ],
    customQuestions: [
      {
        id: 'q1',
        label: 'Do you have experience with rotational high-density grazing and mobile electric fencing?',
        type: 'radio',
        options: ['Yes, experienced', 'Some experience', 'No experience with rotational systems'],
        required: true
      },
      {
        id: 'q2',
        label: 'Have you assisted in livestock calving/lambing and health monitoring?',
        type: 'radio',
        options: ['Yes, multiple seasons', 'Assisted occasionally', 'No prior experience'],
        required: true
      }
    ],
    requiredDocuments: ['cv', 'id'],
    optionalDocuments: ['references']
  },
  {
    id: 'job-105',
    title: 'Farm Administration & Logistics Coordinator',
    department: 'Administration & Finance',
    location: 'Estate Central Office',
    type: 'Full-time',
    salary: 'ZAR 24,000 – 32,000 / month (Demonstration Range)',
    closingDate: '2026-09-28',
    status: 'published',
    createdBy: 'Helena van der Merwe (HR Lead)',
    createdAt: '2026-08-12',
    approvedBy: 'Kobus Malan (Operations Director)',
    approvedAt: '2026-08-13',
    description: 'Ensure smooth operational coordination across procurement, seasonal staff onboarding, transport waybills, compliance documentation, and general estate administrative support.',
    responsibilities: [
      'Process supplier delivery notes, purchase orders, and fuel usage reconciliations.',
      'Maintain seasonal worker attendance records, employment contracts, and statutory UI-19 documentation.',
      'Coordinate freight booking and phytosanitary certificates for export fruit consignments.',
      'Act as central point of contact for estate visitors, inspectors, and contractors.'
    ],
    requirements: [
      'Grade 12 / Matric with Certificate or Diploma in Office Administration, Logistics, or Bookkeeping.',
      'Proficiency in Microsoft Excel / Google Sheets and basic ERP or farm management software.',
      'High attention to detail, confidentiality, and professional telephone etiquette.'
    ],
    customQuestions: [
      {
        id: 'q1',
        label: 'Demonstrated experience in agricultural payroll, waybills, or logistics administration:',
        type: 'select',
        options: ['1 - 3 years', '4 - 6 years', '7+ years'],
        required: true
      },
      {
        id: 'q2',
        label: 'Which accounting or agricultural admin software packages have you used?',
        type: 'textarea',
        placeholder: 'E.g. Sage Pastel, Xero, Agriware, FarmWorks, MS Excel advanced...',
        required: false
      }
    ],
    requiredDocuments: ['cv', 'id', 'qualifications'],
    optionalDocuments: ['references']
  },
  {
    id: 'job-106',
    title: 'Cellar & Fermentation Assistant (Harvest 2027)',
    department: 'Hospitality & Cellar',
    location: 'Estate Winery & Barrel Cellar',
    type: 'Seasonal',
    salary: 'ZAR 18,000 – 24,000 / month (Demonstration Range)',
    closingDate: '2026-10-15',
    status: 'pending_approval',
    createdBy: 'Helena van der Merwe (HR Lead)',
    createdAt: '2026-08-18',
    submittedAt: '2026-08-18',
    description: 'Hands-on cellar assistant role for the upcoming harvest cycle. Involves grape intake sorting, crusher/destemmer operation, punch-downs, barrel hygiene, and laboratory brix/pH sampling under the Cellar Master.',
    responsibilities: [
      'Operate grape sorting tables, pneumatic membrane press, and destemming machinery.',
      'Perform daily punch-downs (pigeage) and pump-overs during red wine fermentations.',
      'Carry out strict ozone and hot-water sanitisation of stainless steel tanks, pumps, and oak barrels.',
      'Take daily specific gravity, temperature, and refractive brix samples for cellar records.'
    ],
    requirements: [
      'Winemaking or SKOP certification advantageous, or prior cellar internship/harvest experience.',
      'Ability to work rotating shifts during peak harvest months (January – March).',
      'Knowledge of cellar safety protocols and confined space precautions.'
    ],
    customQuestions: [
      {
        id: 'q1',
        label: 'How many completed wine harvest cycles have you worked in a commercial cellar?',
        type: 'select',
        options: ['0 (First harvest / Entry-level)', '1 - 2 harvest seasons', '3 - 5 harvest seasons', '5+ seasons'],
        required: true
      },
      {
        id: 'q2',
        label: 'Are you available to work 12-hour shift rotations during peak harvest?',
        type: 'radio',
        options: ['Yes, fully available', 'Partial availability only', 'No'],
        required: true
      }
    ],
    requiredDocuments: ['cv', 'id'],
    optionalDocuments: ['qualifications', 'references']
  },
  {
    id: 'job-107',
    title: 'Solar Microgrid & Irrigation Electrician',
    department: 'Technical & Maintenance',
    location: 'Estate Utilities Hub',
    type: 'Full-time',
    salary: 'ZAR 35,000 – 48,000 / month (Demonstration Range)',
    closingDate: '2026-08-15',
    status: 'closed',
    closureReason: 'Application Deadline Reached',
    closedAt: '2026-08-16',
    createdBy: 'Helena van der Merwe (HR Lead)',
    createdAt: '2026-07-10',
    approvedBy: 'Kobus Malan (Operations Director)',
    approvedAt: '2026-07-12',
    description: 'Maintained the estate\'s 450kW photovoltaic solar array, commercial battery inverters, variable speed irrigation pump controllers, and electrical reticulation.',
    responsibilities: [
      'Maintenance of solar inverters, PV string combiners, and three-phase pump control panels.',
      'Preventative electrical testing (Megger, thermal imaging) across packhouses and cellar chillers.'
    ],
    requirements: [
      'Qualified Electrician with Wireman\'s License (Red Seal).',
      'Solar PV GreenCard or SAPVIA accreditation preferred.'
    ],
    customQuestions: [],
    requiredDocuments: ['cv', 'id', 'license', 'qualifications'],
    optionalDocuments: []
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-501',
    refNumber: 'APP-2026-84920',
    jobId: 'job-101',
    jobTitle: 'Senior Vineyard Manager',
    department: 'Vineyard',
    applicantName: 'Tshepo Mokwena',
    email: 'tshepo.mokwena@example.co.za',
    phone: '+27 (0)82 555 3190',
    dob: '1988-04-14',
    idNumber: '8804145021084',
    address: '14 Helderberg View Road, Somerset West, Western Cape, 7130',
    status: 'Shortlisted',
    appliedAt: '2026-08-14 09:32',
    talentPoolConsent: true,
    education: {
      highestLevel: 'Bachelor of Science in Agriculture (Viticulture & Oenology)',
      institution: 'Stellenbosch University',
      yearCompleted: '2011'
    },
    workExperience: [
      {
        company: 'Franschhoek Valley Vineyards',
        role: 'Assistant Vineyard Manager',
        duration: '2018 – 2026 (8 years)',
        responsibilities: 'Managed 60ha premium reds, oversaw seasonal labor force of 40 workers, implemented deficit irrigation telemetry.'
      },
      {
        company: 'Paarl Terroir Estate',
        role: 'Junior Viticulturist',
        duration: '2012 – 2018 (6 years)',
        responsibilities: 'Conducted block monitoring, soil nitrogen analysis, and harvest brix forecasting.'
      }
    ],
    skills: 'Deficit Irrigation, Canopy Management, IPM Biological Controls, GlobalG.A.P., John Deere Telemetry, Team Leadership',
    questionResponses: [
      { questionId: 'q1', label: 'Years of practical experience in Cape viticulture:', answer: '8 - 12 years' },
      { questionId: 'q2', label: 'Which cultivars have you directly managed:', answer: ['Cabernet Sauvignon', 'Shiraz / Syrah', 'Chenin Blanc', 'Pinotage'] },
      { questionId: 'q3', label: 'Approach to water scarcity and canopy management:', answer: 'I utilize continuous soil capacitance probes at 30cm and 60cm depths combined with NDVI drone mapping to time regulated deficit irrigation precisely between fruit set and veraison. We apply wheat straw mulch in high-radiation blocks to reduce evaporation by up to 35%.' },
      { questionId: 'q4', label: 'Valid pesticide application certificate:', answer: 'Yes, fully certified & valid' }
    ],
    documents: [
      { name: 'Tshepo_Mokwena_CV_2026.pdf', type: 'CV / Resume', size: '1.8 MB', date: '2026-08-14' },
      { name: 'National_ID_TshepoM.pdf', type: 'Identity Document', size: '920 KB', date: '2026-08-14' },
      { name: 'BSc_Agric_Degree_Certificate.pdf', type: 'Academic Qualification', size: '2.4 MB', date: '2026-08-14' },
      { name: 'AVCASA_Pesticide_Card.pdf', type: 'Professional License', size: '640 KB', date: '2026-08-14' }
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Helena van der Merwe (HR Lead)',
        timestamp: '2026-08-15 11:20',
        text: 'Strong candidate with exceptional academic pedigree and 14 years hands-on experience in Franschhoek. Thorough knowledge of drought-resistant rootstocks.'
      },
      {
        id: 'note-2',
        author: 'Kobus Malan (Operations Director)',
        timestamp: '2026-08-16 14:05',
        text: 'Recommended for 1st round panel interview with Cellar Master. References verified with Franschhoek Valley GM.'
      }
    ],
    auditTrail: [
      { timestamp: '2026-08-14 09:32', user: 'System (Online Portal)', event: 'Application received & reference APP-2026-84920 issued.' },
      { timestamp: '2026-08-15 10:15', user: 'Helena van der Merwe (HR Lead)', event: 'Status updated from "New Application" to "Under Review".' },
      { timestamp: '2026-08-16 14:10', user: 'Helena van der Merwe (HR Lead)', event: 'Status updated from "Under Review" to "Shortlisted".' }
    ]
  },
  {
    id: 'app-502',
    refNumber: 'APP-2026-92147',
    jobId: 'job-102',
    jobTitle: 'Agricultural Equipment & Fleet Technician',
    department: 'Technical & Maintenance',
    applicantName: 'Pieter Gouws',
    email: 'pieter.gouws.diesel@example.co.za',
    phone: '+27 (0)83 714 8832',
    dob: '1992-11-03',
    idNumber: '9211035189087',
    address: '8 Protea Avenue, Durbanville, Western Cape, 7550',
    status: 'Interview',
    appliedAt: '2026-08-12 16:45',
    talentPoolConsent: true,
    education: {
      highestLevel: 'Red Seal Trade Test (Diesel Mechanic Section 26D)',
      institution: 'Olifantsfontein Artisan Training Centre',
      yearCompleted: '2016'
    },
    workExperience: [
      {
        company: 'Overberg Agri Machinery',
        role: 'Senior Field Technician',
        duration: '2019 – 2026 (7 years)',
        responsibilities: 'Maintained fleet of 50+ John Deere and Landini tractors, overhauled hydraulic steering units and hydrostatic transmissions.'
      },
      {
        company: 'Boland Earthmoving Repairs',
        role: 'Apprentice Diesel Mechanic',
        duration: '2014 – 2019 (5 years)',
        responsibilities: 'Engine rebuilds, injector calibration, and preventative fleet service schedules.'
      }
    ],
    skills: 'Diesel Engine Rebuilds, Electro-Hydraulics, PTO Diagnostics, Welding & Fabrication, Auto-Electrical 12V/24V, Code 14 Driver',
    questionResponses: [
      { questionId: 'q1', label: 'Are you a certified Trade-Tested Artisan?', answer: 'Yes — Section 13 / 26D Trade Test Certified' },
      { questionId: 'q2', label: 'Primary equipment brands:', answer: ['John Deere', 'Landini / McCormick', 'Massey Ferguson', 'Hydraulic Spray Rigs'] },
      { questionId: 'q3', label: 'Driver\'s License Code:', answer: 'Code 14 (EC)' }
    ],
    documents: [
      { name: 'Pieter_Gouws_Resume.pdf', type: 'CV / Resume', size: '1.2 MB', date: '2026-08-12' },
      { name: 'Red_Seal_Trade_Certificate.pdf', type: 'Trade Qualification', size: '1.5 MB', date: '2026-08-12' },
      { name: 'Drivers_License_EC_Code14.pdf', type: 'Driver License', size: '820 KB', date: '2026-08-12' }
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Helena van der Merwe (HR Lead)',
        timestamp: '2026-08-13 08:30',
        text: 'Clean Trade Test certificate, Code 14 driving license with PrDP. Ideal candidate for our workshop.'
      },
      {
        id: 'note-2',
        author: 'Kobus Malan (Operations Director)',
        timestamp: '2026-08-14 16:00',
        text: 'Interview scheduled for 25 August at 10:00 at central workshop.'
      }
    ],
    auditTrail: [
      { timestamp: '2026-08-12 16:45', user: 'System (Online Portal)', event: 'Application received & reference APP-2026-92147 issued.' },
      { timestamp: '2026-08-13 09:00', user: 'Helena van der Merwe (HR Lead)', event: 'Status updated to "Under Review".' },
      { timestamp: '2026-08-14 11:30', user: 'Helena van der Merwe (HR Lead)', event: 'Status updated to "Shortlisted".' },
      { timestamp: '2026-08-17 14:00', user: 'Helena van der Merwe (HR Lead)', event: 'Status updated to "Interview". Invitation email dispatched.' }
    ]
  },
  {
    id: 'app-503',
    refNumber: 'APP-2026-61038',
    jobId: 'job-103',
    jobTitle: 'Citrus Orchard Team Supervisor',
    department: 'Citrus',
    applicantName: 'Nandi Sithole',
    email: 'nandi.sithole@example.co.za',
    phone: '+27 (0)71 902 4411',
    dob: '1995-07-22',
    idNumber: '9507220412089',
    address: '22 Orchard Lane, Paarl, Western Cape, 7646',
    status: 'New Application',
    appliedAt: '2026-08-20 14:15',
    talentPoolConsent: true,
    education: {
      highestLevel: 'Diploma in Plant Production (Citrus Specialisation)',
      institution: 'Cape Peninsula University of Technology (CPUT)',
      yearCompleted: '2019'
    },
    workExperience: [
      {
        company: 'Citrusdal Export Growers',
        role: 'Orchard Team Leader',
        duration: '2021 – 2026 (5 years)',
        responsibilities: 'Supervised 25 pickers across Valencia and Clementine orchards, monitored brix/acid ratios for packing.'
      }
    ],
    skills: 'Citrus Pest Scouting, GlobalG.A.P., Team Leadership, Pruning Coordination, Export Quality Standards',
    questionResponses: [
      { questionId: 'q1', label: 'Years of supervisory experience in fruit or citrus orchards:', answer: '3 - 5 years' },
      { questionId: 'q2', label: 'Experience with GlobalG.A.P. and export quality grading:', answer: 'Extensive hands-on experience' }
    ],
    documents: [
      { name: 'Nandi_Sithole_CV.pdf', type: 'CV / Resume', size: '1.4 MB', date: '2026-08-20' },
      { name: 'CPUT_Diploma_Plant_Production.pdf', type: 'Academic Qualification', size: '1.9 MB', date: '2026-08-20' }
    ],
    internalNotes: [],
    auditTrail: [
      { timestamp: '2026-08-20 14:15', user: 'System (Online Portal)', event: 'Application received & reference APP-2026-61038 issued.' }
    ]
  },
  {
    id: 'app-504',
    refNumber: 'APP-2026-10582',
    jobId: 'job-104',
    jobTitle: 'Livestock & Pasture Assistant',
    department: 'Livestock',
    applicantName: 'Sipho Ndlovu',
    email: 'sipho.ndlovu@example.co.za',
    phone: '+27 (0)76 339 1204',
    dob: '1998-02-19',
    idNumber: '9802195821081',
    address: 'Farm Cottage 4, Cape Town Farm Staff Village',
    status: 'Under Review',
    appliedAt: '2026-08-17 10:05',
    talentPoolConsent: true,
    education: {
      highestLevel: 'National Senior Certificate (Matric)',
      institution: 'Wellington Secondary School',
      yearCompleted: '2016'
    },
    workExperience: [
      {
        company: 'Swartland Pasture Cooperative',
        role: 'Livestock Handler',
        duration: '2019 – 2025 (6 years)',
        responsibilities: 'Daily cattle movements, paddock fence maintenance, feeding supplements, assist dipping and dosing.'
      }
    ],
    skills: 'Low-stress Cattle Handling, Solar Fencing, Animal Welfare, Herd Inoculations, Pasture Rotation',
    questionResponses: [
      { questionId: 'q1', label: 'Experience with rotational high-density grazing:', answer: 'Yes, experienced' },
      { questionId: 'q2', label: 'Assisted in livestock calving/lambing:', answer: 'Yes, multiple seasons' }
    ],
    documents: [
      { name: 'Sipho_Ndlovu_Resume.docx', type: 'CV / Resume', size: '640 KB', date: '2026-08-17' },
      { name: 'Certified_ID_SiphoNdlovu.pdf', type: 'Identity Document', size: '780 KB', date: '2026-08-17' }
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Helena van der Merwe (HR Lead)',
        timestamp: '2026-08-18 09:15',
        text: 'Local candidate with positive references from Swartland Cooperative. Solid understanding of pasture rotation.'
      }
    ],
    auditTrail: [
      { timestamp: '2026-08-17 10:05', user: 'System (Online Portal)', event: 'Application received & reference APP-2026-10582 issued.' },
      { timestamp: '2026-08-18 09:20', user: 'Helena van der Merwe (HR Lead)', event: 'Status updated to "Under Review".' }
    ]
  }
];

export const INITIAL_SIMULATED_EMAILS = [
  {
    id: 'email-1',
    timestamp: '2026-08-20 14:15',
    to: 'nandi.sithole@example.co.za',
    from: 'recruitment@capetownfarm.co.za',
    subject: 'Application Received — Citrus Orchard Team Supervisor (Ref: APP-2026-61038)',
    badge: 'Applicant Confirmation',
    preview: 'Thank you for applying for the Citrus Orchard Team Supervisor position at Cape Town Farm. Your application has been logged.',
    bodyHtml: `
      <div style="font-family: 'Avenir Next', sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e0d7cb; background: #faf6f0; color: #1b261f;">
        <div style="border-bottom: 2px solid #173125; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #173125; font-family: serif; font-size: 22px;">CAPE TOWN FARM</h2>
          <p style="margin: 4px 0 0; color: #c47a20; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">Estate Recruitment & Talent Portal</p>
        </div>
        <p>Dear <strong>Nandi Sithole</strong>,</p>
        <p>Thank you for submitting your application for the <strong>Citrus Orchard Team Supervisor</strong> position at Cape Town Farm.</p>
        <div style="background: #ffffff; padding: 16px; border: 1px solid #ded5c7; margin: 16px 0;">
          <p style="margin: 0 0 6px; font-size: 13px; color: #536556;">APPLICATION REFERENCE NUMBER:</p>
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #173125; letter-spacing: 0.05em;">APP-2026-61038</p>
        </div>
        <p>Our Human Resources team is currently reviewing submissions against the role criteria. If your profile is shortlisted, our talent coordinator will contact you directly to schedule an interview.</p>
        <p>You can reference this number for any future enquiries regarding your submission.</p>
        <hr style="border: 0; border-top: 1px solid #e0d7cb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #7b9874; margin: 0;">This is a simulated transactional notification generated by the Cape Town Farm prototype system.</p>
      </div>
    `
  },
  {
    id: 'email-2',
    timestamp: '2026-08-18 16:30',
    to: 'kobus.malan@capetownfarm.co.za',
    from: 'hr-system@capetownfarm.co.za',
    subject: 'Action Required: Requisition Approval for Cellar & Fermentation Assistant (Job ID: job-106)',
    badge: 'Operations Alert',
    preview: 'A new job vacancy has been created by HR and is awaiting your operational review and sign-off.',
    bodyHtml: `
      <div style="font-family: 'Avenir Next', sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e0d7cb; background: #faf6f0; color: #1b261f;">
        <div style="border-bottom: 2px solid #173125; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #173125; font-family: serif; font-size: 22px;">CAPE TOWN FARM</h2>
          <p style="margin: 4px 0 0; color: #c47a20; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">Operations Governance</p>
        </div>
        <p>Dear <strong>Kobus Malan</strong>,</p>
        <p>HR Lead Helena van der Merwe has submitted a new job requisition awaiting your approval:</p>
        <div style="background: #ffffff; padding: 16px; border: 1px solid #ded5c7; margin: 16px 0;">
          <p style="margin: 0 0 4px;"><strong>Position:</strong> Cellar & Fermentation Assistant (Harvest 2027)</p>
          <p style="margin: 0 0 4px;"><strong>Department:</strong> Hospitality & Cellar</p>
          <p style="margin: 0 0 4px;"><strong>Proposed Compensation:</strong> ZAR 18,000 – 24,000 / month</p>
          <p style="margin: 0;"><strong>Closing Date:</strong> 2026-10-15</p>
        </div>
        <p>Please access your Operations Dashboard to review the full job specification, questions, and approve or request revisions with feedback.</p>
        <hr style="border: 0; border-top: 1px solid #e0d7cb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #7b9874; margin: 0;">Automated internal workflow dispatch.</p>
      </div>
    `
  }
];

export const ESTATE_PRODUCE = [
  {
    id: 'prod-1',
    category: 'Grapes & Viticulture',
    title: 'Wine Grapes',
    image: 'Img-Assets/Wine-Grapes.jpg',
    lead: 'Premium cool-climate cultivars nurtured on granite slopes.',
    details: 'Our 85 hectares of high-elevation vineyards produce Cabernet Sauvignon, Shiraz, Pinotage, Chenin Blanc, and Sauvignon Blanc. Low-yield pruning, canopy micro-management, and solar-powered drip irrigation deliver concentrated fruit with balanced natural acidity.',
    stats: [
      { label: 'Cultivars', val: '5 Heritage Varietals' },
      { label: 'Elevation', val: '240m – 410m ASL' },
      { label: 'Harvest Cycle', val: 'Late Jan – Late March' }
    ]
  },
  {
    id: 'prod-2',
    category: 'Citrus Groves',
    title: 'Sunlit Citrus',
    image: 'Img-Assets/Orange Trees.jpg',
    lead: 'Export-grade Valencias, Navels, and Clementines grown with precision care.',
    details: 'Our citrus orchards thrive under abundant sunshine and crisp Atlantic night breezes. Integrated biological pest control and micro-jet irrigation ensure vibrant color, high juice percentage, and compliance with GlobalG.A.P. and SIZA ethical standards.',
    stats: [
      { label: 'Orchard Extent', val: '60 Hectares' },
      { label: 'Varieties', val: 'Navels, Valencias, Clementines' },
      { label: 'Quality', val: 'Export Grade 1 & Local Premium' }
    ]
  },
  {
    id: 'prod-3',
    category: 'Ethical Livestock',
    title: 'Pasture Cattle',
    image: 'Img-Assets/Cows.jpg',
    lead: 'Pasture-raised cattle integrated into regenerative soil health cycles.',
    details: 'Our herd grazes on rotated multi-species pastures of clover, rye, and lucerne. This rotational strip-grazing stimulates deep root growth, naturally cycles nitrogen into the soil, and eliminates synthetic feedlots.',
    stats: [
      { label: 'Farming Approach', val: 'Rotational Strip Grazing' },
      { label: 'Dietary Standard', val: '100% Grass-Fed & Foraged' },
      { label: 'Veterinary Charter', val: 'Ethical, Low-Stress Handling' }
    ]
  },
  {
    id: 'prod-4',
    category: 'Field Resiliency',
    title: 'Resilient Crops',
    image: 'Img-Assets/Cows 2.jpg',
    lead: 'Cover cropping, heritage grains, and regenerative multi-layer fields.',
    details: 'We rotate winter barley, oats, and nitrogen-fixing legumes between commercial harvests. This holistic crop rotation breaks pest cycles naturally, builds organic soil biomass, and prevents erosion across slopes.',
    stats: [
      { label: 'Cover Strategy', val: 'Multi-Species Biomass' },
      { label: 'Tillage Method', val: 'Zero-Till & Minimal Soil Disturbance' },
      { label: 'Soil Organic Carbon', val: '+2.4% Average Increase' }
    ]
  }
];

export const ESTATE_WINES = [
  {
    id: 'wine-1',
    name: 'Estate Reserve Cabernet Sauvignon',
    vintage: '2023 (Illustrative Vintage)',
    style: 'Bold, structured, and age-worthy',
    alc: '14.5% Vol',
    notes: 'Hand-picked from 28-year-old bush vines on decomposed granite. Deep cassis, cedar box, crushed fynbos herbs, and graphite minerality. Matured for 20 months in French oak barriques (40% new).',
    pairing: 'Slow-roasted Karoo lamb shank, aged cheddar, wild mushroom risotto.',
    cellarPotential: '12 – 15 years from harvest.'
  },
  {
    id: 'wine-2',
    name: 'Old Vine Chenin Blanc',
    vintage: '2024 (Illustrative Vintage)',
    style: 'Complex, textured, and vibrantly mineral',
    alc: '13.5% Vol',
    notes: 'Harvested at dawn from dryland heritage bush vines planted in 1982. White peach, honeyed pear, lime blossom, and toasted brioche. Spontaneous wild yeast fermentation in 500L seasoned oak puncheons.',
    pairing: 'West Coast rock lobster, grilled linefish, Cape Malay spiced poultry.',
    cellarPotential: '8 – 10 years.'
  },
  {
    id: 'wine-3',
    name: 'Heritage Shiraz',
    vintage: '2023 (Illustrative Vintage)',
    style: 'Savoury, dark-fruited, and layered with spice',
    alc: '14.0% Vol',
    notes: 'Grown on cool south-facing clay-loam parcels. Black cherry, cracked black pepper, smoked charcuterie, and dark violets. Fine-grained tannins with vibrant natural freshness.',
    pairing: 'Braised beef brisket, wood-fired game loin, charcuterie platters.',
    cellarPotential: '10 – 12 years.'
  },
  {
    id: 'wine-4',
    name: 'Estate Signature Cape Blend',
    vintage: '2022 (Illustrative Vintage)',
    style: 'Harmonious, rich, and deeply rooted in South African heritage',
    alc: '14.5% Vol',
    notes: 'A master blend of Pinotage (45%), Cabernet Sauvignon (35%), and Shiraz (20%). Ripe black plums, dark cocoa, sweet baking spice, and a velvety, lingering finish.',
    pairing: 'Prime ribeye steak, ostrich fillet, rich venison potjie.',
    cellarPotential: '10 – 14 years.'
  }
];

export const ESTATE_PEOPLE = [
  {
    name: 'Helena van der Merwe',
    role: 'Head of Human Resources & Talent Development',
    division: 'Leadership & Administration',
    tenure: '9 Years with Estate',
    bio: 'Championing fair labor practices, continuous adult education, and community apprenticeship pipelines across all farm divisions.'
  },
  {
    name: 'Kobus Malan',
    role: 'Operations & Agricultural Director',
    division: 'Farm Operations & Engineering',
    tenure: '14 Years with Estate',
    bio: 'Overseeing multi-divisional agricultural engineering, precision irrigation telemetry, and integrated estate logistics.'
  },
  {
    name: 'Siphamandla Dlamini',
    role: 'Master Viticulturist',
    division: 'Vineyard & Terroir',
    tenure: '11 Years with Estate',
    bio: 'Directing the seasonal rhythms of our 85-hectare vineyards with deep respect for soil microbiology and drought-resilient canopy management.'
  },
  {
    name: 'Dr. Anelise Bester',
    role: 'Cellar Master & Oenologist',
    division: 'Hospitality & Winemaking',
    tenure: '7 Years with Estate',
    bio: 'Guiding our low-intervention winemaking philosophy to translate unique granite terroir into world-class, balanced estate wines.'
  },
  {
    name: 'Jabulani Khumalo',
    role: 'Livestock & Pasture Manager',
    division: 'Livestock & Regeneration',
    tenure: '8 Years with Estate',
    bio: 'Pioneering rotational mob-grazing systems that naturally fertilize pastures while ensuring the highest standards of animal welfare.'
  },
  {
    name: 'Marius Engelbrecht',
    role: 'Chief Fleet & Technical Engineer',
    division: 'Technical & Infrastructure',
    tenure: '12 Years with Estate',
    bio: 'Leading the technical workshop team in maintaining 40+ agricultural machinery units and our 450kW solar microgrid.'
  }
];
