---
semantic_id: [unique_id_e.g._cph_bars_v1]
data_status: SANCTUARIED
provenance:
  source_origin: [e.g., OpenStreetMap / CVR Register]
  acquisition_date: 2026-03-29
  licence: [e.g., ODbL / CC-BY 4.0]
grounding_logic:
  type: [postgis / geopackage / api / cloud_raster]
  uri: [connection_string_or_relative_path]
  layer_filter: "[SQL_FILTER_E.g._status='active']"
  crs: "EPSG:25832"
privacy_governance:
  gdpr_classification: [Public / Pseudo-anonymised / Restricted]
  retention_period: [e.g., Project Duration + 5 years]
  access_requirements: [e.g., VPN / LDAP Credentials]
---

# Intent: Scientific Purpose

*Describe why this data exists in the project. What is its role in answering the Research Question?*

## Sanitisation Rituals

*Document how the "Wild" data was "Consecrated" for the sanctuary. List specific cleaning steps:*

1. **Geometric Fix:** [e.g., Snapping points to the street network]
2. **Attribute Pruning:** [e.g., Removed owner phone numbers for GDPR compliance]
3. **Temporal Filter:** [e.g., Removed venues closed before 2024]

## Attribute Ontology (Logical Data Types)

*Define the meaning and the NOIR level of key attributes to ground the AI Agent.*

| Attribute Name | Logical Type | Intent/Meaning |
| :--- | :--- | :--- |
| `venue_type` | **Nominal** | Categorical label (Bar, Pub, Club). No mathematical rank. |
| `noise_rank` | **Ordinal** | 1-5 scale of perceived intensity. Rank matters, distance doesn't. |
| `opening_hour` | **Interval** | Time of day. Differences are meaningful, but no absolute zero. |
| `capacity` | **Ratio** | Total number of persons. Has a true zero point. |

## Stewardship & Privacy Notes

*Address the 'Wicked Problems' here. Who owns this data? What are the ethical risks of using it? How do we ensure GDPR compliance?*

> **GDPR Note:** The raw extent contains PII (Personally Identifiable Information). This manifest serves as a sanitized proxy. The AI Agent is instructed to only use the `semantic_id` and never export raw address strings.
