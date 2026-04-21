import fs from 'fs';

const geodataPath = '/Users/holmes/local_dev/semanticGIS/geodata_full.json';
const discardManifestPath = '/Users/holmes/local_dev/semanticGIS/DanishData/content/assets/lookup/discard-manifest.json';

const duplicateOwnerGroups = [
  {
    canonical: 'plan-og-landdistriksstyrelsen',
    variants: [
      'plan-og-landdistriksstyrelsen',
      'plan-og-landdistriktsstyrelsen',
      'Plan- og Landdistriksstyrelsen',
      'Plan- og Landdistriktsstyrelsen',
      'Plan og Landdistriksstyrelsen',
      'Plan og Landdistriktsstyrelsen',
    ],
  },
  {
    canonical: 'de-nationale-geologiske-undersoegelser-for-danmark-og-groenland',
    variants: [
      'de-nationale-geologiske-undersoegelser-for-danmark-og-groenland',
      'de-nationale-geologiske-undersoegelser-for-danmark-og-groenland-geus',
      'De Nationale Geologiske Undersøgelser for Danmark og Grønland',
      'De Nationale Geologiske Undersøgelser for Danmark og Grønland (GEUS)',
    ],
  },
  {
    canonical: 'dce-nationalt-center-for-miljoe-og-energi',
    variants: [
      'dce-nationalt-center-for-miljoe-og-energi',
      'dce-nationalt-center-for-miljoe-og-energi-aarhus-universitet',
      'DCE - Nationalt Center for Miljø og Energi',
      'DCE - Nationalt Center for Miljø og Energi, Aarhus Universitet',
    ],
  },
  {
    canonical: 'danmarks-meteorologisk-institut',
    variants: [
      'danmarks-meteorologisk-institut',
      'danmarks-meteorologiske-institut',
      'Danmarks Meteorologisk Institut',
      'Danmarks Meteorologiske Institut',
    ],
  },
  {
    canonical: 'institut-for-geovidenskab-og-naturforvaltning-ign-koebenhavns-universitet',
    variants: [
      'institut-for-geovidenskab-og-naturforvaltning-koebenhavns-universitet',
      'institut-for-geovidenskab-og-naturforvaltning-ign-koebenhavns-universitet',
      'Institut for Geovidenskab og Naturforvaltning, Københavns Universitet',
      'Institut for Geovidenskab og Naturforvaltning (IGN), Københavns Universitet',
    ],
  },
];

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function dmpSlug(dmpId) {
  const raw = String(dmpId || '');
  if (!raw) return '';
  const last = raw.includes(':') ? raw.split(':').pop() : raw;
  return slugify(last);
}

const geodata = JSON.parse(fs.readFileSync(geodataPath, 'utf-8'));
const discardManifest = JSON.parse(fs.readFileSync(discardManifestPath, 'utf-8'));

const records = Array.isArray(geodata)
  ? geodata
  : geodata?.records && Array.isArray(geodata.records)
    ? geodata.records
    : Object.values(geodata);

const excluded = new Set(discardManifest.excluded_from_dataset_generation || []);
const variantToCanonical = new Map();
for (const group of duplicateOwnerGroups) {
  for (const variant of group.variants) {
    variantToCanonical.set(slugify(variant), group.canonical);
  }
}

let ownerRenames = 0;
let recordsWithOwnerChanges = 0;
let discardedMarked = 0;

for (const record of records) {
  if (!record || typeof record !== 'object') continue;

  // 1) Normalize duplicate owner names to canonical (winner by dataset count)
  const organisations = Array.isArray(record.organisations) ? record.organisations : [];
  if (organisations.length > 0) {
    const rewritten = organisations.map((org) => {
      const key = slugify(org);
      const canonical = variantToCanonical.get(key);
      if (canonical && canonical !== org) {
        ownerRenames += 1;
        return canonical;
      }
      return org;
    });

    // De-duplicate while preserving order
    const seen = new Set();
    const deduped = [];
    for (const org of rewritten) {
      if (!seen.has(org)) {
        seen.add(org);
        deduped.push(org);
      }
    }

    const before = JSON.stringify(organisations);
    const after = JSON.stringify(deduped);
    if (before !== after) {
      record.organisations = deduped;
      recordsWithOwnerChanges += 1;
    }
  }

  // 2) Mark discarded records in source metadata
  const idSlug = slugify(record.id || record.sgis_id || '');
  const dmp = dmpSlug(record.dmp_id || '');
  const titleSlug = slugify(record.title || '');

  const shouldDiscard = excluded.has(idSlug) || excluded.has(dmp) || excluded.has(titleSlug);
  if (shouldDiscard) {
    if (record.discarded !== true) {
      discardedMarked += 1;
    }
    record.discarded = true;
    record.discard_reason =
      titleSlug.includes('groenland') || titleSlug.includes('greenland')
        ? 'greenland_out_of_scope'
        : 'inspire_service_or_access_path';
    record.discard_policy = 'exclude_from_dataset_generation';
    record.discarded_at = '2026-04-18';
  }
}

fs.writeFileSync(geodataPath, JSON.stringify(geodata, null, 2) + '\n', 'utf-8');

console.log(JSON.stringify({
  records_total: records.length,
  owner_rename_operations: ownerRenames,
  records_with_owner_changes: recordsWithOwnerChanges,
  records_marked_discarded_now: discardedMarked,
  records_discarded_total: records.filter((r) => r && r.discarded === true).length,
  duplicate_groups_applied: duplicateOwnerGroups.length,
}, null, 2));
