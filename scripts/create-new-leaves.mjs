import fs from 'fs';
import path from 'path';

const leavesDir = '/Users/holmes/local_dev/semanticGIS/DanishData/content/Leaves';

// Define new leaves based on gap analysis recommendations
const newLeaves = [
  {
    fileName: 'environmental-noise.md',
    title: 'Environmental Noise & Air Transport',
    sphere: 'Biosphere',
    subsphere: 'biosphere_monitoring',
    concept: 'Sound level measurements and noise mapping from road, rail, and aviation infrastruc' +
      'ture across Denmark, including regulatory monitoring and public health assessment zones.',
    question: 'What noise levels and exposure zones exist at this location?',
    realisations: [
      'Støj fra jernbaner i by, 1,5m',
      'Støj fra større jernbaner',
      'Støj fra større vejanlæg',
      'Støj fra vejanlæg',
      'Lufthavnsarrondissement',
      'Lден - Samlet',
      'Lnight - Samlet'
    ],
    tags: ['biosphere_monitoring', 'environmental_health', 'noise_regulation'],
    entities: ['noise_measurement', 'noise_exposure_zone', 'transport_corridor', 'agglomeration'],
    related_leaves: ['Atmospheric Deposition and Emissions', 'Energy Infrastructure', 'Transport Networks']
  },
  {
    fileName: 'spatial-planning-decisions.md',
    title: 'Spatial Planning & Municipal Decisions',
    sphere: 'Socio_Technical',
    subsphere: 'planning_regulation',
    concept: 'Municipal and regional planning datasets from PlanDK registry, covering land use designations, ' +
      'zoning decisions, building constraints, and planning areas at municipal, regional, and national levels.',
    question: 'What planning designations, zoning constraints, or development restrictions apply here?',
    realisations: [
      'Administrative skel - PlanDK',
      'Fredede områder',
      'Fjernvarmeplanlægning',
      'Kommuneplaner',
      'Regionplaner',
      'Store husdyrbrug - PlanDK',
      'Anvendelse af vandløb'
    ],
    tags: ['planning_regulation', 'land_use', 'zoning'],
    entities: ['planning_area', 'zoning_constraint', 'administrative_boundary', 'building_restriction'],
    related_leaves: ['Land Use Agriculture', 'Administrative Units', 'Transport Networks']
  },
  {
    fileName: 'drinking-water-protection.md',
    title: 'Drinking Water & Water Source Protection',
    sphere: 'Socio_Technical',
    subsphere: 'water_resource_management',
    concept: 'Groundwater source protection zones, drinking water supply infrastructure, and ' +
      'water source vulnerability assessments for public and private water supplies.',
    question: 'What drinking water source protection zones or supply infrastructure exist here?',
    realisations: [
      'VP3 - Dybe drikkevandsforekomster',
      'VP3 - Regionale drikkevandsforekomster',
      'VP3 - Terrænnære drikkevandsforekomster',
      'Sensitive Drinking Water Supply Areas',
      'Well Head Protection Areas',
      'Areas for Groundwater Protection'
    ],
    tags: ['water_resources', 'public_health', 'infrastructure'],
    entities: ['water_source', 'protection_zone', 'vulnerability_assessment', 'supply_infrastructure'],
    related_leaves: ['Groundwater Bodies', 'Protected Water Use Zones', 'Surface Freshwater Bodies']
  },
  {
    fileName: 'natura-2000-habitats.md',
    title: 'Natura 2000 & EU Biodiversity Directives',
    sphere: 'Biosphere',
    subsphere: 'biosphere_conservation',
    concept: 'Natura 2000 protected habitat areas and species protection zones designated under ' +
      'EU Birds Directive and Habitats Directive, including Special Protection Areas (SPAs) and Special Areas of Conservation (SACs).',
    question: 'What Natura 2000 designations or habitat network requirements apply here?',
    realisations: [
      'Natura 2000 Bird Protection Areas',
      'Natura 2000 Habitat Areas',
      'Conservation Orders',
      'Habitat/Species Management Areas'
    ],
    tags: ['biosphere_conservation', 'protected_habitat', 'eu_directive'],
    entities: ['natura_2000_site', 'spa_designation', 'sac_designation', 'habitat_type', 'protected_species'],
    related_leaves: ['Nature Protection Areas', 'Habitat Extent', 'Species Conservation Concern']
  },
  {
    fileName: 'forest-management.md',
    title: 'Forest Ecosystems & Management',
    sphere: 'Biosphere',
    subsphere: 'biosphere_management',
    concept: 'Forest areas, management units, forest types, and woodland restoration areas including ' +
      'plantation plans, unmanaged forest designations, and sustainable forestry operations.',
    question: 'What forest types, management units, or restoration initiatives are present here?',
    realisations: [
      'Forest Type Map',
      'Management Units',
      'Urørt skov, tilsagn',
      'Skovrejsning',
      'NPF Artsindeks',
      'HNV - Skov'
    ],
    tags: ['biosphere_management', 'forest_conservation', 'sustainable_use'],
    entities: ['forest_area', 'management_unit', 'forest_type', 'plantation', 'restoration_area'],
    related_leaves: ['Habitat Extent', 'Habitat Condition', 'Agricultural Land Management']
  },
  {
    fileName: 'fisheries-management.md',
    title: 'Fisheries Monitoring & Management',
    sphere: 'Socio_Technical',
    subsphere: 'blue_economy_resources',
    concept: 'Fisheries intensity, vessel monitoring, aquaculture locations, and fishing effort data ' +
      'including AIS (Automatic Identification System) density maps and catch/effort statistics.',
    question: 'What fisheries activities, vessel density, or aquaculture operations occur here?',
    realisations: [
      'Skibstrafik, Årligt gennemsnit',
      'AIS density plot',
      'NP3 - Analyseret fiskeriintensitet',
      'Aquaculture Plants',
      'VP3 - Analyseret fiskeriintensitet'
    ],
    tags: ['blue_economy', 'fisheries', 'maritime_monitoring'],
    entities: ['fishing_area', 'vessel_density', 'aquaculture_site', 'fishing_intensity', 'marine_resource'],
    related_leaves: ['Marine and Coastal Waters', 'Nautical Traffic']
  },
  {
    fileName: 'transport-networks.md',
    title: 'Transport Infrastructure Networks',
    sphere: 'Socio_Technical',
    subsphere: 'socio_technical_infrastructure',
    concept: 'Road, rail, pipeline, and utility corridors including road centerlines, administrative ' +
      'access restrictions, transport corridors for regional planning, and railway interest areas.',
    question: 'What transport networks, corridors, or access restrictions exist at this location?',
    realisations: [
      'Vejmidter med vejnavne',
      'Transportkorridorer (Fingerplan)',
      'BaneDanmark Interesseområder',
      'Adgangsbegrænsning (Statsvej)',
      'Jernbane',
      'Gastransmissionsledning'
    ],
    tags: ['socio_technical_infrastructure', 'transport', 'connectivity'],
    entities: ['transport_corridor', 'road_centerline', 'railway_line', 'pipeline', 'restriction_zone'],
    related_leaves: ['Energy Infrastructure', 'Administrative Units', 'Buildings']
  }
];

// Template function
function generateLeafMarkdown(leaf) {
  let md = `---\n`;
  md += `title: ${leaf.title}\n`;
  md += `type: leaf\n`;
  md += `draft: false\n`;
  md += `sphere: ${leaf.sphere}\n`;
  md += `subsphere: ${leaf.subsphere}\n`;
  md += `concept: >\n`;
  md += `  ${leaf.concept}\n`;
  md += `question: >\n`;
  md += `  ${leaf.question}\n`;
  md += `realisations:\n\n`;
  for (const r of leaf.realisations) {
    md += `  - ${r}\n`;
  }
  md += `\nthreads: []\n`;
  md += `tags:\n\n`;
  for (const t of leaf.tags) {
    md += `  - ${t}\n`;
  }
  md += `\nprimary_collection: ${leaf.realisations[0]}\n`;
  md += `entities:\n\n`;
  for (const e of leaf.entities) {
    md += `  - ${e}\n`;
  }
  md += `\nkey_attributes:\n`;
  md += `  - identifier\n`;
  md += `  - designation\n`;
  md += `  - temporal_validity\n`;
  md += `\nservices: {}\n`;
  md += `---\n\n`;
  
  md += `> Cognised existence: ${leaf.concept.split(',')[0].toLowerCase()}.\n\n`;
  md += `## Core Question\n\n${leaf.question}\n\n`;
  md += `## Scope\n\n`;
  md += `- New leaf created from gap analysis of unmatched datasets\n`;
  md += `- Typical realisations listed below\n`;
  md += `- Expected to capture ${leaf.realisations.length}+ dataset categories\n\n`;
  md += `## Typical Realisations\n\n`;
  for (const r of leaf.realisations) {
    md += `- ${r}\n`;
  }
  md += `\n## Realised By Links\n\n`;
  md += `(Links will be populated after dataset reconciliation)\n\n`;
  md += `## Related Leaves\n\n`;
  for (const related of leaf.related_leaves) {
    md += `- [[Leaves/${related.toLowerCase().replace(/ /g, '-')}|${related}]]\n`;
  }
  
  return md;
}

// Generate and write leaves
let created = [];
for (const leaf of newLeaves) {
  const filePath = path.join(leavesDir, leaf.fileName);
  const content = generateLeafMarkdown(leaf);
  
  fs.writeFileSync(filePath, content);
  created.push({
    fileName: leaf.fileName,
    title: leaf.title,
    realisations: leaf.realisations.length
  });
  
  console.log(`✓ Created: ${leaf.title} (${leaf.realisations.length} realisations)`);
}

console.log(`\n✓ All ${created.length} new leaves created successfully`);
console.log(`\nNext step: Run dataset reconciliation to populate "Realised By Links" sections`);
