#!/usr/bin/env python3
"""
Update sphere pages, Leaves/index.md, and sphere-index.v1.json
to reflect the new twig pages and leaves.
"""

import json
import re
import sys
from pathlib import Path

if __name__ == "__main__":
    print(
        "update_sphere_pages.py is retired. Update the markdown sources directly and rebuild with the Node scripts.",
        file=sys.stderr,
    )
    raise SystemExit(1)

BASE = Path("/Users/holmes/local_dev/semanticGIS/DanishData/content")
SPHERE_BASE = BASE / "SPHERE"


# ═══════════════════════════════════════════════════════════════════════════════
# MAPPING: subsphere_id → twig page path (from SPHERE root)
# ═══════════════════════════════════════════════════════════════════════════════

SUBSPHERE_LINKS = {
    # Socio-Technical
    "Socio_technical_infrastructure": "Socio_Technical/Infrastructure/index",
    "Socio_technical_services": "Socio_Technical/Services/index",
    "Socio_technical_socioeconomic": "Socio_Technical/Socioeconomic/index",
    "Socio_technical_governance": "Socio_Technical/Governance/index",
    "Socio_technical_ict": "Socio_Technical/ICT/index",
    "Socio_technical_contaminants": "Socio_Technical/Contaminants/index",
    "Socio_technical_hazard_vulnerability_risk": "Socio_Technical/Hazard_Vulnerability_Risk/index",
    "Socio_technical_resource_utilisation": "Socio_Technical/Resource_Utilisation/index",
    # Atmosphere
    "atmosphere_climate": "Atmosphere/Climate/index",
    "atmosphere_weather": "Atmosphere/Weather/index",
    "atmosphere_composition": "Atmosphere/Composition/index",
    "atmosphere_contaminants": "Atmosphere/Contaminants/index",
    # Biosphere
    "Vegetation": "Biosphere/Vegetation/index",
    "Fauna": "Biosphere/Fauna/index",
    "biosphere_microbial": "Biosphere/Microbial/index",
    "biosphere_ecosystems": "Biosphere/Ecosystems/index",
    "biosphere_contaminants": "Biosphere/Contaminants/index",
    # Hydrosphere
    "hydrosphere_freshwater_surface": "Hydrosphere/Freshwater_Surface/index",
    "hydrosphere_groundwater": "Hydrosphere/Groundwater/index",
    "hydrosphere_marine": "Hydrosphere/Marine/index",
    "hydrosphere_cryosphere": "Hydrosphere/Cryosphere/index",
    "hydrosphere_atmosphericwater": "Hydrosphere/Atmospheric_Water/index",
    "hydrosphere_contaminants": "Hydrosphere/Contaminants/index",
    # Lithosphere
    "lithosphere_geology": "Lithosphere/Geology/index",
    "lithosphere_tectonics": "Lithosphere/Tectonics/index",
    "lithosphere_resources": "Lithosphere/Resources/index",
    "lithosphere_hazards": "Lithosphere/Hazards/index",
    "lithosphere_contaminants": "Lithosphere/Contaminants/index",
    # Pedosphere
    "pedosphere_soil_properties": "Pedosphere/Soil_Properties/index",
    "pedosphere_soil_types_mapping": "Pedosphere/Soil_Types_Mapping/index",
    "pedosphere_soil_moisture_temperature": "Pedosphere/Soil_Moisture_Temperature/index",
    "pedosphere_soil_erosion_sedimentation": "Pedosphere/Soil_Erosion_Sedimentation/index",
    "pedosphere_contaminants": "Pedosphere/Contaminants/index",
    # Toposphere
    "Topography": "Toposphere/Topography/index",
    "toposphere_surface_radiative_thermal": "Toposphere/Surface_Radiative_Thermal/index",
    "toposphere_surface_physical": "Toposphere/Surface_Physical/index",
    "toposphere_imagery": "Toposphere/Imagery/index",
    # LandUseLandCover
    "landuselancover_classified_products": "LandUseLandCover/Classified_Products/index",
    "landuselancover_change_monitoring": "LandUseLandCover/Change_Monitoring/index",
    "landuselancover_general_reference": "LandUseLandCover/General_Reference/index",
}


def linkify_subsphere(subsphere_id):
    """Return a wikilink for a subsphere."""
    path = SUBSPHERE_LINKS.get(subsphere_id)
    if path:
        return f"[[SPHERE/{path}|{subsphere_id}]]"
    return f"`{subsphere_id}`"


def update_sphere_page(filepath):
    """Replace backtick subsphere references with wikilinks in a sphere page."""
    text = filepath.read_text()
    new_text = text
    
    for subsphere_id, twig_path in SUBSPHERE_LINKS.items():
        # Pattern 1: backtick reference at start of list item: `subsphere_id`:
        old = f"`{subsphere_id}`:"
        new = f"[[SPHERE/{twig_path}|{subsphere_id}]]:"
        new_text = new_text.replace(old, new)
        
        # Pattern 2: backtick reference in body text: `subsphere_id`
        old2 = f"`{subsphere_id}`"
        new2 = f"[[SPHERE/{twig_path}|{subsphere_id}]]"
        new_text = new_text.replace(old2, new2)

    if new_text != text:
        filepath.write_text(new_text)
        return True
    return False


def update_socio_technical():
    """Socio_Technical uses **bold** format, not backticks — handle specially."""
    filepath = SPHERE_BASE / "Socio_Technical" / "index.md"
    text = filepath.read_text()
    new_text = text
    
    # Map bold subsphere labels to wikilinks
    bold_replacements = {
        "**Socio_technical_infrastructure:**": "**[[SPHERE/Socio_Technical/Infrastructure/index|Socio_technical_infrastructure]]:**",
        "**Socio_technical_services**:": "**[[SPHERE/Socio_Technical/Services/index|Socio_technical_services]]**:",
        "**Socio_technical_socioeconomic**:": "**[[SPHERE/Socio_Technical/Socioeconomic/index|Socio_technical_socioeconomic]]**:",
        "**Socio_technical_ict**:": "**[[SPHERE/Socio_Technical/ICT/index|Socio_technical_ict]]**:",
        "**Socio_technical_contaminants**:": "**[[SPHERE/Socio_Technical/Contaminants/index|Socio_technical_contaminants]]**:",
        "**Socio_technical_hazard_vulnerability_risk**:": "**[[SPHERE/Socio_Technical/Hazard_Vulnerability_Risk/index|Socio_technical_hazard_vulnerability_risk]]**:",
        "**Socio_technical_resource_utilisation**:": "**[[SPHERE/Socio_Technical/Resource_Utilisation/index|Socio_technical_resource_utilisation]]**:",
    }
    
    for old, new in bold_replacements.items():
        new_text = new_text.replace(old, new)
    
    # Also add new leaves to the leaf table
    new_leaves_section = """
### Grunddata Leaves

| Leaf | Question | Subsphere |
|---|---|---|
| [[Leaves/dar-addresses\\|Addresses]] | Where is a property located by its official address? | Socio_technical_governance |
| [[Leaves/bbr-buildings\\|Buildings and Housing]] | What buildings exist at a location? | Socio_technical_infrastructure |
| [[Leaves/dagi-administrative-units\\|Administrative Units]] | Which administrative area does a location belong to? | Socio_technical_governance |
| [[Leaves/mat-cadastral-parcels\\|Cadastral Parcels]] | What are the legal boundaries of land? | Socio_technical_governance |
| [[Leaves/ds-geographical-names\\|Geographical Names]] | What is the official name of a place? | Socio_technical_governance |
| [[Leaves/person-population\\|Population Distribution]] | How is the population distributed? | Socio_technical_socioeconomic |
| [[Leaves/geodk-transport\\|Transport Networks]] | What transport routes and networks exist? | Socio_technical_infrastructure |"""
    
    # Insert new leaves section after the existing CVR leaves table
    if "### Grunddata Leaves" not in new_text:
        # Find the end of CVR Leaves table (after the last CVR row)
        marker = "| [[Leaves/cvr-financial-profile"
        idx = new_text.find(marker)
        if idx != -1:
            # Find end of that line
            end_of_line = new_text.index("\n", idx)
            new_text = new_text[:end_of_line + 1] + new_leaves_section + new_text[end_of_line + 1:]
    
    if new_text != text:
        filepath.write_text(new_text)
        print("  ✓ Socio_Technical/index.md")


def update_toposphere():
    """Toposphere uses mixed format — Topography is already linked, others use backticks."""
    filepath = SPHERE_BASE / "Toposphere" / "index.md"
    text = filepath.read_text()
    new_text = text
    
    # Replace backtick subsphere refs
    for subsphere_id in ["toposphere_surface_radiative_thermal", "toposphere_surface_physical", "toposphere_imagery"]:
        twig_path = SUBSPHERE_LINKS[subsphere_id]
        old = f"`{subsphere_id}`:"
        new = f"[[SPHERE/{twig_path}|{subsphere_id}]]:"
        new_text = new_text.replace(old, new)
        old2 = f"`{subsphere_id}`"
        new2 = f"[[SPHERE/{twig_path}|{subsphere_id}]]"
        new_text = new_text.replace(old2, new2)
    
    # Also replace toposphere_topography → Topography refs 
    old = "`toposphere_topography`"
    new = "[[SPHERE/Toposphere/Topography/index|Topography]]"
    new_text = new_text.replace(old, new)
    
    # Add Toposphere leaves section if missing
    new_leaves_section = """
---

## Leaves

| Leaf | Question | Subsphere |
|---|---|---|
| [[Leaves/dhm-elevation\\|Elevation Models]] | What is the elevation at a given location? | Topography |
| [[Leaves/orthoimagery\\|Orthoimagery]] | What does the Earth's surface look like? | toposphere_imagery |"""
    
    if "## Leaves" not in new_text:
        # Add before the Cross-Domain Leaves section
        marker = "## Cross-Domain Leaves"
        idx = new_text.find(marker)
        if idx != -1:
            new_text = new_text[:idx] + new_leaves_section.lstrip() + "\n\n" + new_text[idx:]
    
    if new_text != text:
        filepath.write_text(new_text)
        print("  ✓ Toposphere/index.md")


def update_leaves_index():
    """Add 9 new leaves to Leaves/index.md."""
    filepath = BASE / "Leaves" / "index.md"
    text = filepath.read_text()
    
    new_section = """
### Grunddata Leaves

These leaves decompose core Danish registries into semantic aspects:

| Leaf | Question it answers |
|---|---|
| [[Leaves/dar-addresses\\|Addresses]] | Where is a property located by its official address? |
| [[Leaves/bbr-buildings\\|Buildings and Housing]] | What buildings exist at a location? |
| [[Leaves/dagi-administrative-units\\|Administrative Units]] | Which administrative area does a location belong to? |
| [[Leaves/mat-cadastral-parcels\\|Cadastral Parcels]] | What are the legal boundaries of land? |
| [[Leaves/ds-geographical-names\\|Geographical Names]] | What is the official name of a place? |
| [[Leaves/dhm-elevation\\|Elevation Models]] | What is the elevation at a given location? |
| [[Leaves/orthoimagery\\|Orthoimagery]] | What does the Earth's surface look like? |
| [[Leaves/person-population\\|Population Distribution]] | How is the population distributed? |
| [[Leaves/geodk-transport\\|Transport Networks]] | What transport routes and networks exist? |

### Toposphere
- [[Leaves/dhm-elevation|Elevation Models]]
- [[Leaves/orthoimagery|Orthoimagery]]"""
    
    # Replace the "All Leaves by Sphere" section to add new leaves
    old_all_leaves = """## All Leaves by Sphere

### Socio-Technical
- [[Leaves/cvr-industry-classification|Business Industry Classification]]
- [[Leaves/cvr-spatial-footprint|Business Spatial Footprint]]
- [[Leaves/cvr-ownership-structure|Business Ownership Structure]]
- [[Leaves/cvr-financial-profile|Business Financial Profile]]

---"""
    
    new_all_leaves = """## All Leaves by Sphere

### Socio-Technical
- [[Leaves/cvr-industry-classification|Business Industry Classification]]
- [[Leaves/cvr-spatial-footprint|Business Spatial Footprint]]
- [[Leaves/cvr-ownership-structure|Business Ownership Structure]]
- [[Leaves/cvr-financial-profile|Business Financial Profile]]
- [[Leaves/dar-addresses|Addresses]]
- [[Leaves/bbr-buildings|Buildings and Housing]]
- [[Leaves/dagi-administrative-units|Administrative Units]]
- [[Leaves/mat-cadastral-parcels|Cadastral Parcels]]
- [[Leaves/ds-geographical-names|Geographical Names]]
- [[Leaves/person-population|Population Distribution]]
- [[Leaves/geodk-transport|Transport Networks]]

### Toposphere
- [[Leaves/dhm-elevation|Elevation Models]]
- [[Leaves/orthoimagery|Orthoimagery]]

---"""
    
    new_text = text.replace(old_all_leaves, new_all_leaves)
    
    # Add the Grunddata Leaves table after the Pilot Leaves table
    if "### Grunddata Leaves" not in new_text:
        marker = "## All Leaves by Sphere"
        idx = new_text.find(marker)
        if idx != -1:
            new_text = new_text[:idx] + new_section + "\n\n" + new_text[idx:]
    
    filepath.write_text(new_text)
    print("  ✓ Leaves/index.md")


def update_sphere_index_json():
    """Add subspheres to all spheres and new leaves to sphere-index.v1.json."""
    filepath = BASE / "assets" / "sphere-index.v1.json"
    data = json.loads(filepath.read_text())
    
    # Add subspheres to spheres that don't have them
    subsphere_map = {
        "atmosphere": ["atmosphere_climate", "atmosphere_weather", "atmosphere_composition", "atmosphere_contaminants"],
        "biosphere": ["Vegetation", "Fauna", "biosphere_microbial", "biosphere_ecosystems", "biosphere_contaminants"],
        "hydrosphere": ["hydrosphere_freshwater_surface", "hydrosphere_groundwater", "hydrosphere_marine", "hydrosphere_cryosphere", "hydrosphere_atmosphericwater", "hydrosphere_contaminants"],
        "lithosphere": ["lithosphere_geology", "lithosphere_tectonics", "lithosphere_resources", "lithosphere_hazards", "lithosphere_contaminants"],
        "pedosphere": ["pedosphere_soil_properties", "pedosphere_soil_types_mapping", "pedosphere_soil_moisture_temperature", "pedosphere_soil_erosion_sedimentation", "pedosphere_contaminants"],
        "toposphere": ["Topography", "toposphere_surface_radiative_thermal", "toposphere_surface_physical", "toposphere_imagery"],
        "land-use-land-cover": ["landuselancover_classified_products", "landuselancover_change_monitoring", "landuselancover_general_reference"],
    }
    
    for sphere in data["spheres"]:
        sid = sphere["id"]
        if sid in subsphere_map and "subspheres" not in sphere:
            sphere["subspheres"] = subsphere_map[sid]
    
    # Add new leaves
    new_leaves = [
        {
            "id": "dar-addresses",
            "title": "Addresses",
            "path": "/Leaves/dar-addresses",
            "sphere": "socio-technical",
            "subsphere": "socio_technical_governance",
            "collection": "DanmarksAdresser",
            "collection_path": "/Datasets-by-Collection/Grunddatamodellen/DanmarksAdresser/",
            "question": "Where is a property located by its official address?",
            "entities": ["adresse", "adressepunkt", "husnummer", "navngivenvej", "postnummer"],
            "key_attributes": ["adressebetegnelse", "husnummertekst", "postnr", "postnrnavn", "etage", "doer"],
            "lianas": [],
            "services": {}
        },
        {
            "id": "bbr-buildings",
            "title": "Buildings and Housing",
            "path": "/Leaves/bbr-buildings",
            "sphere": "socio-technical",
            "subsphere": "socio_technical_infrastructure",
            "collection": "BygningerOgBoliger",
            "collection_path": "/Datasets-by-Collection/BygningerOgBoliger/",
            "question": "What buildings exist at a location and what are their characteristics?",
            "entities": ["bygning", "enhed", "etage", "opgang", "grund", "tekniskanlæg"],
            "key_attributes": ["byg_anvendelse", "byg_opfoerelsesaar", "byg_areal", "byg_antal_etager", "byg_varmeinstallation"],
            "lianas": [],
            "services": {}
        },
        {
            "id": "dagi-administrative-units",
            "title": "Administrative Units",
            "path": "/Leaves/dagi-administrative-units",
            "sphere": "socio-technical",
            "subsphere": "socio_technical_governance",
            "collection": "DAGI",
            "collection_path": "/Datasets-by-Collection/Grunddatamodellen/DAGI/",
            "question": "Which administrative area does a location belong to?",
            "entities": ["kommune", "region", "sogn", "retskreds", "politikreds", "opstillingskreds", "afstemningsomraade"],
            "key_attributes": ["kommunekode", "regionskode", "navn", "geometri"],
            "lianas": [],
            "services": {}
        },
        {
            "id": "mat-cadastral-parcels",
            "title": "Cadastral Parcels",
            "path": "/Leaves/mat-cadastral-parcels",
            "sphere": "socio-technical",
            "subsphere": "socio_technical_governance",
            "collection": "Matrikel",
            "collection_path": "/Datasets-by-Collection/Grunddatamodellen/Matrikel/",
            "question": "What are the legal boundaries and ownership of land?",
            "entities": ["jordstykke", "matrikelnummer", "ejerlav", "skelforretning"],
            "key_attributes": ["matrikelnummer", "ejerlavskode", "registreretareal", "arealberegningsmetode", "geometri"],
            "lianas": [],
            "services": {}
        },
        {
            "id": "ds-geographical-names",
            "title": "Geographical Names",
            "path": "/Leaves/ds-geographical-names",
            "sphere": "socio-technical",
            "subsphere": "socio_technical_governance",
            "collection": "Stednavne",
            "collection_path": "/Datasets-by-Collection/Grunddatamodellen/Stednavne/",
            "question": "What is the official name of a place or feature?",
            "entities": ["stednavn", "stednavntype"],
            "key_attributes": ["navn", "stednavntype", "geometri", "sprog"],
            "lianas": [],
            "services": {}
        },
        {
            "id": "dhm-elevation",
            "title": "Elevation Models",
            "path": "/Leaves/dhm-elevation",
            "sphere": "toposphere",
            "subsphere": "Topography",
            "collection": "DHMOprindelse",
            "collection_path": "/Datasets-by-Collection/Grunddatamodellen/DHMOprindelse/",
            "question": "What is the elevation at a given location?",
            "entities": ["DHM/Punktsky", "DHM/Terræn", "DHM/Overflade"],
            "key_attributes": ["elevation_value", "horizontal_accuracy", "vertical_accuracy", "acquisition_date"],
            "lianas": ["hydrosphere"],
            "services": {}
        },
        {
            "id": "orthoimagery",
            "title": "Orthoimagery",
            "path": "/Leaves/orthoimagery",
            "sphere": "toposphere",
            "subsphere": "toposphere_imagery",
            "collection": "GeoDanmark",
            "collection_path": "/Datasets-by-Collection/Grunddatamodellen/GeoDanmark/",
            "question": "What does the Earth's surface look like at a location?",
            "entities": ["orthophoto", "image_tile"],
            "key_attributes": ["acquisition_date", "ground_resolution", "spectral_bands", "cloud_cover"],
            "lianas": ["land-use-land-cover"],
            "services": {}
        },
        {
            "id": "person-population",
            "title": "Population Distribution",
            "path": "/Leaves/person-population",
            "sphere": "socio-technical",
            "subsphere": "socio_technical_socioeconomic",
            "collection": "Person",
            "collection_path": "/Datasets-by-Collection/Grunddatamodellen/Person/",
            "question": "How is the population distributed and what are its characteristics?",
            "entities": ["person", "civilstand", "statsborgerskab"],
            "key_attributes": ["foedselsdato", "koen", "civilstand", "adresseringsnavn", "kommunekode"],
            "lianas": [],
            "services": {}
        },
        {
            "id": "geodk-transport",
            "title": "Transport Networks",
            "path": "/Leaves/geodk-transport",
            "sphere": "socio-technical",
            "subsphere": "socio_technical_infrastructure",
            "collection": "GeoDanmark",
            "collection_path": "/Datasets-by-Collection/Grunddatamodellen/GeoDanmark/",
            "question": "What transport routes and networks exist?",
            "entities": ["vejmidte", "jernbane", "sti", "faergerute", "lufthavn"],
            "key_attributes": ["vejklasse", "vejnavn", "hastighed", "belægning", "geometri"],
            "lianas": [],
            "services": {}
        },
    ]
    
    existing_ids = {l["id"] for l in data["leaves"]}
    for leaf in new_leaves:
        if leaf["id"] not in existing_ids:
            data["leaves"].append(leaf)
    
    # Add new lianas
    new_lianas = [
        {
            "from_leaf": "dhm-elevation",
            "from_sphere": "toposphere",
            "to_sphere": "hydrosphere",
            "rationale": "Elevation drives water flow direction, flood modelling, and catchment delineation"
        },
        {
            "from_leaf": "orthoimagery",
            "from_sphere": "toposphere",
            "to_sphere": "land-use-land-cover",
            "rationale": "Imagery is the primary source for deriving land cover and land use classifications"
        },
    ]
    
    existing_lianas = {(l["from_leaf"], l["to_sphere"]) for l in data["lianas"]}
    for liana in new_lianas:
        if (liana["from_leaf"], liana["to_sphere"]) not in existing_lianas:
            data["lianas"].append(liana)
    
    filepath.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print("  ✓ sphere-index.v1.json")


def main():
    print("═══ Updating Sphere Pages ═══\n")
    
    # Spheres with backtick-format subspheres
    backtick_spheres = [
        "Atmosphere/Atmosphere.md",
        "Biosphere/Biosphere.md",
        "Hydrosphere/Hydrosphere.md",
        "Lithosphere/Lithosphere.md",
        "Pedosphere/Pedosphere.md",
        "LandUseLandCover/LandUseLandCover.md",
    ]
    
    for rel_path in backtick_spheres:
        filepath = SPHERE_BASE / rel_path
        if filepath.exists():
            if update_sphere_page(filepath):
                print(f"  ✓ {rel_path}")
            else:
                print(f"  - {rel_path} (no changes)")
        else:
            print(f"  ! {rel_path} not found")
    
    # Special handling for Socio_Technical and Toposphere
    update_socio_technical()
    update_toposphere()
    
    print("\n═══ Updating Leaves Index ═══\n")
    update_leaves_index()
    
    print("\n═══ Updating sphere-index.v1.json ═══\n")
    update_sphere_index_json()
    
    print("\n✅ All updates complete")


if __name__ == "__main__":
    main()
