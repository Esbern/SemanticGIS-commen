#!/usr/bin/env python3
"""
Generate twig (subsphere) pages, new leaves, and update classical theme pages
to create proper links throughout the SPHERE tree.
"""

import os
import sys
from pathlib import Path

if __name__ == "__main__":
    print(
        "generate_twigs_and_leaves.py is retired. Use the Node migration, rebuild, audit, and site-build commands instead.",
        file=sys.stderr,
    )
    raise SystemExit(1)

SPHERE_BASE = Path("/Users/holmes/local_dev/semanticGIS/DanishData/content/SPHERE")
LEAVES_BASE = Path("/Users/holmes/local_dev/semanticGIS/DanishData/content/Leaves")
CLASS_BASE = Path("/Users/holmes/local_dev/semanticGIS/DanishData/content/Classical Classifications")

# ═══════════════════════════════════════════════════════════════════════════════
# TWIG (SUBSPHERE) DEFINITIONS — 38 new pages (Governance + Topography exist)
# ═══════════════════════════════════════════════════════════════════════════════

TWIGS = {
    # ── SOCIO-TECHNICAL (7 new, Governance exists) ──────────────────────────
    "Socio_Technical/Infrastructure": {
        "title": "Infrastructure",
        "aliases": ["Socio_technical_infrastructure", "Infrastructure"],
        "sphere": "Socio-Technical",
        "sphere_path": "Socio_Technical",
        "subsphere_id": "Socio_technical_infrastructure",
        "content": """Physical and organisational networks form the backbone of urban and rural life. This twig covers the hard infrastructure that enables human settlement and economic activity — the roads we drive on, the pipes that carry water, the cables that transmit power and data, and the buildings that shelter activities.

## Scope

Infrastructure data describes **constructed physical systems** and their spatial extent:

- **Transportation networks**: Roads, railways, bicycle paths, pedestrian routes, bridges, tunnels, airports, harbours, ferry routes
- **Utility grids**: Electricity transmission/distribution, gas pipelines, district heating networks, water supply mains, sewage/stormwater systems
- **Built environment**: Buildings, structures, dams, levees, wind turbines, solar farms
- **Waste management**: Landfills, recycling centres, waste treatment plants
- **Communication networks**: Fibre optic routes, mobile tower sites (physical infrastructure aspect — data flows are in [[SPHERE/Socio_Technical/ICT/index|ICT]])

## Key Distinction: Infrastructure vs Services

Infrastructure is the **physical asset**; the service it enables sits in [[SPHERE/Socio_Technical/Services/index|Services]]. A hospital building is infrastructure; the healthcare it provides is a service. A power line is infrastructure; the energy distribution service is Services.

## Relevant Danish Data

- **[[Datasets by Collection/BygningerOgBoliger/index|BygningerOgBoliger (BBR)]]** — Denmark's building and housing register. Every building has a footprint, use code, construction year, and technical attributes.
- **[[Datasets by Collection/Grunddatamodellen/GeoDanmark/index|GeoDanmark]]** — The authoritative topographic vector dataset: roads, buildings, railways, technical installations.
- **[[Datasets by Collection/Grunddatamodellen/Ejendomsvurdering/index|Ejendomsvurdering]]** — Property valuations reflecting the economic dimension of built infrastructure.

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Structure | [[Classical Classifications/ISO 19115/structure\\|Structure]] |
| ISO 19115 | Transportation | [[Classical Classifications/ISO 19115/transportation\\|Transportation]] |
| ISO 19115 | Utilities/Communication | [[Classical Classifications/ISO 19115/utilitiesCommunication\\|Utilities/Communication]] |
| INSPIRE | Buildings | [[Classical Classifications/INSPIRE/buildings\\|Buildings]] |
| INSPIRE | Transport Networks | [[Classical Classifications/INSPIRE/transport-networks\\|Transport Networks]] |
| INSPIRE | Production and Industrial Facilities | [[Classical Classifications/INSPIRE/production-and-industrial-facilities\\|Production and Industrial Facilities]] |
| UN-GGIM | Buildings and Settlements | [[Classical Classifications/UN-GGIM/buildings-and-settlements\\|Buildings and Settlements]] |
| UN-GGIM | Physical Infrastructure | [[Classical Classifications/UN-GGIM/physical-infrastructure\\|Physical Infrastructure]] |
| UN-GGIM | Transport Networks | [[Classical Classifications/UN-GGIM/transport-networks\\|Transport Networks]] |""",
    },
    "Socio_Technical/Services": {
        "title": "Services",
        "aliases": ["Socio_technical_services", "Services"],
        "sphere": "Socio-Technical",
        "sphere_path": "Socio_Technical",
        "subsphere_id": "Socio_technical_services",
        "content": """Organised activities and institutions that provide essential functions to populations. Where [[SPHERE/Socio_Technical/Infrastructure/index|Infrastructure]] is the physical asset, Services describes what those assets *deliver* — healthcare, education, emergency response, commercial services, environmental monitoring.

## Scope

- **Healthcare**: Hospitals, clinics, pharmacies, ambulance stations, health districts
- **Education**: Schools, universities, kindergartens, educational districts
- **Public safety**: Police stations, fire stations, emergency services
- **Commercial services**: Retail locations, financial services, postal offices
- **Environmental monitoring**: Observation stations, measurement networks, sensors deployed to monitor physical spheres (a key **liana** — the stations are Socio-Technical services, but what they observe spans Atmosphere, Hydrosphere, Pedosphere, Biosphere)
- **Water/energy services**: Water treatment plants, wastewater facilities, power generation (the service dimension of utility infrastructure)

## Key Liana: Environmental Monitoring

Environmental monitoring facilities are a classic cross-sphere concept. The **station** itself (its location, operator, calibration) is a Socio-Technical service. But the **observations** it produces belong to whichever sphere is being measured — air quality data goes to [[SPHERE/Atmosphere/index|Atmosphere]], water quality to [[SPHERE/Hydrosphere/index|Hydrosphere]], soil samples to [[SPHERE/Pedosphere/index|Pedosphere]].

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Health | [[Classical Classifications/ISO 19115/health\\|Health]] |
| INSPIRE | Environmental Monitoring Facilities | [[Classical Classifications/INSPIRE/environmental-monitoring-facilities\\|Environmental Monitoring Facilities]] |
| INSPIRE | Human Health and Safety | [[Classical Classifications/INSPIRE/human-health-and-safety\\|Human Health and Safety]] |
| INSPIRE | Utility and Governmental Services | [[Classical Classifications/INSPIRE/utility-and-governmental-services\\|Utility and Governmental Services]] |""",
    },
    "Socio_Technical/Socioeconomic": {
        "title": "Socioeconomic",
        "aliases": ["Socio_technical_socioeconomic", "Socioeconomic"],
        "sphere": "Socio-Technical",
        "sphere_path": "Socio_Technical",
        "subsphere_id": "Socio_technical_socioeconomic",
        "content": """Data describing human populations, their economic activities, and social organisation. This is where demographics meet economics — population counts, workforce data, income levels, business composition, consumption patterns.

## Scope

- **Demographics**: Population counts, age/gender distribution, migration, household composition
- **Economy**: Business activity, industry composition, employment, GDP, trade, investment
- **Ownership**: Property ownership, company ownership structures, beneficial ownership
- **Income and wealth**: Personal income, corporate revenue, property values
- **Social indicators**: Education levels, health outcomes, inequality measures

## The CVR Leaves

The Central Business Register ([[Datasets by Collection/CentraleVirksomhedsregister/index|CVR]]) is the richest Danish dataset in this twig. Its complexity motivated the creation of SPHERE's leaf structure:

- [[Leaves/cvr-industry-classification|Business Industry Classification]] — What economic activity does a business perform?
- [[Leaves/cvr-ownership-structure|Business Ownership Structure]] — Who owns and controls this business?
- [[Leaves/cvr-financial-profile|Business Financial Profile]] — What is the financial and employment state?

## Relevant Danish Data

- **[[Datasets by Collection/CentraleVirksomhedsregister/index|CVR]]** — Organizations, activities, employment, structure, accounts
- **[[Datasets by Collection/Grunddatamodellen/Person/index|Person]]** — Individual persons, legal identities, civil status
- **[[Datasets by Collection/Grunddatamodellen/Ejerfortegnelsen/index|Ejerfortegnelsen]]** — Property ownership linking persons/orgs to land
- **[[Datasets by Collection/Grunddatamodellen/Ejendomsvurdering/index|Ejendomsvurdering]]** — Property valuations reflecting economic activity

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Economy | [[Classical Classifications/ISO 19115/economy\\|Economy]] |
| ISO 19115 | Society | [[Classical Classifications/ISO 19115/society\\|Society]] |
| INSPIRE | Population Distribution | [[Classical Classifications/INSPIRE/population-distribution\\|Population Distribution]] |
| UN-GGIM | Population Distribution | [[Classical Classifications/UN-GGIM/population-distribution\\|Population Distribution]] |""",
    },
    "Socio_Technical/ICT": {
        "title": "Information and Communication Technology",
        "aliases": ["Socio_technical_ict", "ICT"],
        "sphere": "Socio-Technical",
        "sphere_path": "Socio_Technical",
        "subsphere_id": "Socio_technical_ict",
        "content": """Information and communication technologies, data flows, and the digital infrastructure that enables modern spatial data systems. This twig covers the *data layer* rather than the physical cables (which are [[SPHERE/Socio_Technical/Infrastructure/index|Infrastructure]]).

## Scope

- **Geodetic reference frames**: The mathematical models (ETRS89, DVR90, WGS84) that make all spatial data interoperable
- **Coordinate reference systems**: Projections, transformations, datum definitions
- **Spatial data infrastructure (SDI)**: Metadata catalogs, CSW services, INSPIRE discovery services, WFS/WMS endpoints
- **Sensor networks**: IoT sensor data streams, smart city platforms (the data flow, not the physical device)
- **Digital platforms**: Data portals, APIs, digital twins, open data catalogues
- **Grid systems**: Statistical grids, DGGS (H3, S2, DGGAL) as algorithmic spatial frameworks

## Key Role: The Enabling Layer

ICT is the enabling layer for all other twigs. Without geodetic reference frames, no spatial data is interoperable. Without SDI, no data is discoverable. This twig doesn't describe the *world* — it describes the *systems we use to describe the world*.

## Relevant Danish Data

- **[[Data Portals/Datafordeleren/index|Datafordeleren]]** — Denmark's spatial data distribution platform
- **[[Datasets by Collection/Grunddatamodellen/Fikspunkter/index|Fikspunkter]]** — Geodetic control points
- **[[Datasets by Collection/Grunddatamodellen/index|Grunddatamodellen]]** — The overarching data model framework

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Location | [[Classical Classifications/ISO 19115/location\\|Location]] |
| INSPIRE | Coordinate Reference Systems | [[Classical Classifications/INSPIRE/coordinate-reference-systems\\|Coordinate Reference Systems]] |
| INSPIRE | Geographical Grid Systems | [[Classical Classifications/INSPIRE/geographical-grid-systems\\|Geographical Grid Systems]] |
| UN-GGIM | Global Geodetic Reference Frame | [[Classical Classifications/UN-GGIM/global-geodetic-reference-frame\\|GGRF]] |""",
    },
    "Socio_Technical/Contaminants": {
        "title": "Contaminants (Human Exposure)",
        "aliases": ["Socio_technical_contaminants", "Human Contaminant Exposure"],
        "sphere": "Socio-Technical",
        "sphere_path": "Socio_Technical",
        "subsphere_id": "Socio_technical_contaminants",
        "content": """Data on human-generated contamination sources, pathways of human exposure, and health impacts. Every sphere has its own contaminants subclass for pollutants *within that medium* — this twig specifically addresses the **human side**: where contamination originates from human activity and how it affects human populations.

## Scope

- **Industrial emission points**: Factory stacks, discharge pipes, point-source pollution locations
- **Hazardous waste sites**: Contaminated land registries, brownfield databases
- **Pollution regulations**: Emission permits, discharge limits, compliance monitoring
- **Human disease distribution**: Spatial epidemiology, disease clusters, health exposure mapping
- **Human exposure assessment**: Dose-response models, proximity analysis to contamination sources

## Distinction from Other Contaminant Subclasses

Each sphere has a `_contaminants` subclass — but they describe different things:
- **Atmosphere contaminants**: Pollutants *in the air* (NO₂, PM2.5)
- **Hydrosphere contaminants**: Pollutants *in water* (heavy metals, microplastics)
- **Socio-Technical contaminants**: The *human source* and *human impact* — where pollution comes from, and what it does to people

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Health | [[Classical Classifications/ISO 19115/health\\|Health]] |
| ISO 19115 | Environment | [[Classical Classifications/ISO 19115/environment\\|Environment]] |
| INSPIRE | Human Health and Safety | [[Classical Classifications/INSPIRE/human-health-and-safety\\|Human Health and Safety]] |""",
    },
    "Socio_Technical/Hazard_Vulnerability_Risk": {
        "title": "Hazard, Vulnerability, and Risk",
        "aliases": ["Socio_technical_hazard_vulnerability_risk", "Risk Assessment"],
        "sphere": "Socio-Technical",
        "sphere_path": "Socio_Technical",
        "subsphere_id": "Socio_technical_hazard_vulnerability_risk",
        "content": """Risk assessment data combining natural or anthropogenic hazards with human vulnerability and exposure. The *hazard* itself (earthquake, flood, storm) originates in a physical sphere. This twig addresses the *risk to humans* — what happens when the hazard meets human settlements, infrastructure, and populations.

## The Risk Triangle

Risk = Hazard × Exposure × Vulnerability

- **Hazard**: The physical event (from [[SPHERE/Lithosphere/Hazards/index|Lithosphere Hazards]], [[SPHERE/Hydrosphere/index|Hydrosphere flooding]], [[SPHERE/Atmosphere/index|Atmosphere storms]])
- **Exposure**: Which populations and assets are physically located in the hazard zone
- **Vulnerability**: How susceptible those populations/assets are to damage

This twig stores the *combined assessment* — maps showing which areas face high risk from multiple hazards overlaid with population density and infrastructure value.

## Scope

- **Multi-hazard risk mapping**: Combined risk indices from multiple natural hazards
- **Population vulnerability**: Socioeconomic vulnerability indicators spatially mapped
- **Critical infrastructure exposure**: Which hospitals, power plants, transport links are in hazard zones
- **Climate adaptation**: Future risk projections under climate scenarios
- **Insurance and loss models**: Expected economic loss from natural disasters

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| INSPIRE | Natural Risk Zones | [[Classical Classifications/INSPIRE/natural-risk-zones\\|Natural Risk Zones]] |""",
    },
    "Socio_Technical/Resource_Utilisation": {
        "title": "Resource Utilisation",
        "aliases": ["Socio_technical_resource_utilisation", "Resource Utilisation"],
        "sphere": "Socio-Technical",
        "sphere_path": "Socio_Technical",
        "subsphere_id": "Socio_technical_resource_utilisation",
        "content": """Quantification of human extraction, harvesting, consumption, and production from natural systems. This is where human activity physically takes from nature — measured volumes of water, harvested biomass, extracted minerals, caught fish, felled timber.

## Scope

- **Water abstraction**: Measured volumes of groundwater and surface water extracted for human use
- **Agriculture and aquaculture**: Crop yields, livestock production, fish catches, timber harvests
- **Mining and quarrying**: Mineral extraction quantities, gravel/sand extraction, fossil fuel production
- **Energy production**: Renewable energy generation from natural sources (hydropower, wind, solar, biomass)
- **Fishing**: Catch volumes, landing statistics, quota utilisation

## Key Distinction: Resource vs Utilisation

The *natural resource* itself sits in the physical sphere — mineral deposits in [[SPHERE/Lithosphere/Resources/index|Lithosphere Resources]], fish stocks in [[SPHERE/Biosphere/Fauna/index|Biosphere Fauna]], timber in [[SPHERE/Biosphere/Vegetation/index|Biosphere Vegetation]]. This twig records *how much humans take* — the utilisation volume that connects human activity to natural stock.

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Farming | [[Classical Classifications/ISO 19115/farming\\|Farming]] |
| INSPIRE | Agricultural and Aquaculture Facilities | [[Classical Classifications/INSPIRE/agricultural-aquaculture-facilities\\|Agricultural Facilities]] |""",
    },
    # ── ATMOSPHERE (4 new) ──────────────────────────────────────────────────
    "Atmosphere/Climate": {
        "title": "Climate",
        "aliases": ["atmosphere_climate", "Climate"],
        "sphere": "Atmosphere",
        "sphere_path": "Atmosphere",
        "subsphere_id": "atmosphere_climate",
        "content": """Long-term weather patterns and trends — the statistical description of the atmosphere over decades to millennia. Where [[SPHERE/Atmosphere/Weather/index|Weather]] captures today's conditions, Climate describes what is *normal* and how it is changing.

## Scope

- **Historical climate records**: Temperature series, precipitation normals, wind climatologies spanning 30+ years
- **Climate zones and classifications**: Köppen-Geiger zones, bioclimatic regions
- **Climate projections**: Future temperature and precipitation under IPCC scenarios (RCP/SSP pathways)
- **Greenhouse gas concentrations**: Long-term CO₂, CH₄, N₂O trends as climate drivers (as atmospheric composition affecting climate — the *emissions* belong in [[SPHERE/Socio_Technical/Contaminants/index|Contaminants]])
- **Climate indices**: NAO, ENSO, PDO, drought indices, growing degree days

## Denmark-Specific Context

Denmark's climate data comes primarily from DMI (Danish Meteorological Institute). Key products include:
- Climate normals (30-year reference periods)
- Regional climate model projections for Denmark
- Historical station records dating back to the mid-1800s

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Climatology/Meteorology/Atmosphere | [[Classical Classifications/ISO 19115/climatologyMeteorologyAtmosphere\\|Climatology/Meteorology/Atmosphere]] |
| INSPIRE | Meteorological Geographical Features | [[Classical Classifications/INSPIRE/meteorological-geographical-features\\|Meteorological Geographical Features]] |""",
    },
    "Atmosphere/Weather": {
        "title": "Weather",
        "aliases": ["atmosphere_weather", "Weather"],
        "sphere": "Atmosphere",
        "sphere_path": "Atmosphere",
        "subsphere_id": "atmosphere_weather",
        "content": """Short-term atmospheric conditions and phenomena — hours to days. Temperature, precipitation, wind, pressure, humidity, cloud cover, and their forecasts.

## Scope

- **Observations**: Station measurements of temperature, precipitation, wind speed/direction, pressure, humidity, visibility
- **Radar and satellite**: Precipitation radar composites, cloud imagery, lightning detection
- **Numerical weather prediction**: Forecasts from NWP models (HARMONIE, ECMWF)
- **Severe weather**: Storm warnings, extreme precipitation events, heat waves, frost events
- **Derived products**: Heat index, wind chill, evapotranspiration estimates

## Key Distinction: Weather vs Climate

Weather is what you get; climate is what you expect. Weather data has *temporal resolution* of minutes to days. If the dataset describes conditions over 30+ years as statistical summaries, it's [[SPHERE/Atmosphere/Climate/index|Climate]].

## Precipitation Cross-Sphere Note

Precipitation falls as weather but *lands* in the Hydrosphere. Rainfall measurements are atmosphere_weather; the resulting streamflow is [[SPHERE/Hydrosphere/Freshwater_Surface/index|freshwater_surface]]; soil moisture response is [[SPHERE/Pedosphere/Soil_Moisture_Temperature/index|Pedosphere soil moisture]].

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Climatology/Meteorology/Atmosphere | [[Classical Classifications/ISO 19115/climatologyMeteorologyAtmosphere\\|Climatology/Meteorology/Atmosphere]] |
| INSPIRE | Atmospheric Conditions | [[Classical Classifications/INSPIRE/atmospheric-conditions\\|Atmospheric Conditions]] |
| INSPIRE | Meteorological Geographical Features | [[Classical Classifications/INSPIRE/meteorological-geographical-features\\|Meteorological Geographical Features]] |""",
    },
    "Atmosphere/Composition": {
        "title": "Atmospheric Composition",
        "aliases": ["atmosphere_composition", "Atmospheric Composition"],
        "sphere": "Atmosphere",
        "sphere_path": "Atmosphere",
        "subsphere_id": "atmosphere_composition",
        "content": """The gaseous and particulate makeup of the atmosphere — major gases, trace gases, aerosols, and their spatial distribution. This is the *background chemistry* of the air, distinct from pollutant concentrations which are [[SPHERE/Atmosphere/Contaminants/index|Atmosphere Contaminants]].

## Scope

- **Major atmospheric gases**: N₂, O₂, Ar, CO₂ (as background composition)
- **Trace gases**: Water vapour profiles, ozone column, methane background levels
- **Aerosols**: Natural aerosol loading (dust, sea salt, volcanic), aerosol optical depth
- **Atmospheric profiles**: Vertical soundings, radiosonde data, lidar profiles

## Distinction from Contaminants

The boundary between composition and contaminants is contextual. Background CO₂ levels as an atmospheric property = composition. Elevated CO₂ from industrial emission = [[SPHERE/Atmosphere/Contaminants/index|contaminant]]. If the focus is "what's in the air naturally?", it's composition. If the focus is "what pollutants are present?", it's contaminants.

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Climatology/Meteorology/Atmosphere | [[Classical Classifications/ISO 19115/climatologyMeteorologyAtmosphere\\|Climatology/Meteorology/Atmosphere]] |""",
    },
    "Atmosphere/Contaminants": {
        "title": "Atmospheric Contaminants",
        "aliases": ["atmosphere_contaminants", "Air Quality"],
        "sphere": "Atmosphere",
        "sphere_path": "Atmosphere",
        "subsphere_id": "atmosphere_contaminants",
        "content": """Pollutants present in the atmosphere — measurements, models, and indices describing air quality. The *source* of emissions is [[SPHERE/Socio_Technical/Contaminants/index|Socio-Technical Contaminants]]; this twig records what is actually *in the air*.

## Scope

- **Measured pollutant concentrations**: NO₂, PM2.5, PM10, O₃ (tropospheric ozone), SO₂, CO
- **Air quality indices**: AQI, CAQI, and national air quality classifications
- **Ozone-depleting substances**: CFCs, HCFCs in the stratosphere
- **Modelled air quality**: Dispersion models, chemical transport models
- **Emission inventories** (atmospheric side): What goes into the atmosphere — the spatial distribution of emissions in the air column

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Environment | [[Classical Classifications/ISO 19115/environment\\|Environment]] |
| INSPIRE | Atmospheric Conditions | [[Classical Classifications/INSPIRE/atmospheric-conditions\\|Atmospheric Conditions]] |""",
    },
    # ── BIOSPHERE (5 new) ───────────────────────────────────────────────────
    "Biosphere/Vegetation": {
        "title": "Vegetation",
        "aliases": ["Vegetation", "biosphere_vegetation"],
        "sphere": "Biosphere",
        "sphere_path": "Biosphere",
        "subsphere_id": "Vegetation",
        "content": """Plant life in all its forms — from individual species to forest ecosystems. Vegetation data describes the presence, type, health, and productivity of plant cover.

## Scope

- **Forest types**: Deciduous, coniferous, mixed forest classification and boundaries
- **Crop types and health**: Agricultural crop identification, NDVI, chlorophyll indices
- **Species distribution**: Where specific plant species occur (presence/absence, abundance)
- **Primary productivity**: GPP, NPP, biomass estimates from remote sensing
- **Phenology**: Green-up dates, senescence, growing season length

## Cross-Sphere Connections

Vegetation sits at the intersection of several spheres:
- **Pedosphere**: Soil properties determine what grows — and plant roots shape soil development
- **Atmosphere**: Vegetation drives carbon cycling, transpiration, albedo modification
- **Hydrosphere**: Riparian vegetation influences water quality and bank stability
- **LandUseLandCover**: Vegetation classification is a major component of land cover maps

Agricultural crops here represent the *biological organism*. The *harvest yield* (how much humans take) is [[SPHERE/Socio_Technical/Resource_Utilisation/index|Resource Utilisation]].

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Biota | [[Classical Classifications/ISO 19115/biota\\|Biota]] |
| INSPIRE | Species Distribution | [[Classical Classifications/INSPIRE/species-distribution\\|Species Distribution]] |""",
    },
    "Biosphere/Fauna": {
        "title": "Fauna",
        "aliases": ["Fauna", "biosphere_fauna"],
        "sphere": "Biosphere",
        "sphere_path": "Biosphere",
        "subsphere_id": "Fauna",
        "content": """Animal life — species distribution, population dynamics, wildlife corridors, migration routes. Fauna data covers all non-human animal life from insects to whales.

## Scope

- **Species distribution**: Occurrence records, range maps, habitat suitability models
- **Population counts**: Census data for wildlife, fish stock assessments, bird colony counts
- **Wildlife corridors**: Movement pathways, migration routes, ecological connectivity
- **Marine fauna**: Fish stock biomass, cetacean sightings, benthic community surveys
- **Invasive species**: Distribution and spread of non-native animal species

## Key Distinction

- **Fish stock** (the biological population) → Fauna
- **Fish catch** (how much humans harvest) → [[SPHERE/Socio_Technical/Resource_Utilisation/index|Resource Utilisation]]
- **Aquatic habitat** (the water body) → [[SPHERE/Hydrosphere/index|Hydrosphere]]

Human population data is explicitly *excluded* from Fauna — it belongs in [[SPHERE/Socio_Technical/Socioeconomic/index|Socioeconomic]].

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Biota | [[Classical Classifications/ISO 19115/biota\\|Biota]] |
| INSPIRE | Species Distribution | [[Classical Classifications/INSPIRE/species-distribution\\|Species Distribution]] |""",
    },
    "Biosphere/Microbial": {
        "title": "Microbial Life",
        "aliases": ["biosphere_microbial", "Microbial"],
        "sphere": "Biosphere",
        "sphere_path": "Biosphere",
        "subsphere_id": "biosphere_microbial",
        "content": """Microorganisms and their activity — soil microbiomes, aquatic bacteria, fungal networks, pathogen distribution. This twig covers life at the microscopic scale, which plays outsized roles in nutrient cycling, decomposition, and disease.

## Scope

- **Soil microbiomes**: Bacterial and fungal communities in soil, mycorrhizal networks
- **Aquatic microorganisms**: Freshwater and marine bacteria, phytoplankton, algal blooms
- **Pathogen distribution**: Spatial occurrence of disease-causing organisms *in the environment* (the pathogen as organism, not human disease — that's [[SPHERE/Socio_Technical/Contaminants/index|Contaminants]])
- **Decomposition**: Microbial activity rates, organic matter breakdown

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Biota | [[Classical Classifications/ISO 19115/biota\\|Biota]] |""",
    },
    "Biosphere/Ecosystems": {
        "title": "Ecosystems",
        "aliases": ["biosphere_ecosystems", "Ecosystems"],
        "sphere": "Biosphere",
        "sphere_path": "Biosphere",
        "subsphere_id": "biosphere_ecosystems",
        "content": """Ecological units and their characteristics — ecoregions, habitat types, biodiversity hotspots, ecosystem health metrics. Where Vegetation and Fauna describe individual organisms, Ecosystems describes *communities and their interactions*.

## Scope

- **Ecoregions**: Biogeographic zones with shared ecological characteristics
- **Habitat types**: Natura 2000 habitat classifications, EUNIS habitat types
- **Biodiversity hotspots**: Areas of exceptional species richness or endemism
- **Ecosystem health**: Indicators of ecological integrity, disturbance levels, recovery status
- **Protected area ecology**: Ecological justification for conservation — why a site is protected

## Habitats and Protected Sites

INSPIRE's "Habitats and Biotopes" maps directly here. INSPIRE's "Protected Sites" is split — the *ecological rationale* belongs in Ecosystems, but the *legal designation* as a governance act belongs in [[SPHERE/Socio_Technical/Governance/index|Governance]].

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Biota | [[Classical Classifications/ISO 19115/biota\\|Biota]] |
| INSPIRE | Bio-geographical Regions | [[Classical Classifications/INSPIRE/bio-geographical-regions\\|Bio-geographical Regions]] |
| INSPIRE | Habitats and Biotopes | [[Classical Classifications/INSPIRE/habitats-and-biotopes\\|Habitats and Biotopes]] |""",
    },
    "Biosphere/Contaminants": {
        "title": "Biosphere Contaminants",
        "aliases": ["biosphere_contaminants", "Bioaccumulation"],
        "sphere": "Biosphere",
        "sphere_path": "Biosphere",
        "subsphere_id": "biosphere_contaminants",
        "content": """Pollutants within living organisms or their accumulation in biological systems — bioaccumulation, pesticide residues, disease spread in wildlife. This twig records what contaminants do *within the living world*.

## Scope

- **Bioaccumulation**: Heavy metals in fish tissues, persistent organic pollutants in marine mammals
- **Pesticide residues**: Concentrations in crops, soil organisms, and non-target species
- **Wildlife disease**: Spread of pathogens within non-human populations (avian influenza routes, chronic wasting disease)
- **Ecosystem disruption**: Algal blooms from nutrient loading, invasive pathogen impacts

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Environment | [[Classical Classifications/ISO 19115/environment\\|Environment]] |""",
    },
    # ── HYDROSPHERE (6 new) ─────────────────────────────────────────────────
    "Hydrosphere/Freshwater_Surface": {
        "title": "Freshwater Surface Water",
        "aliases": ["hydrosphere_freshwater_surface", "Freshwater", "Inland Waters"],
        "sphere": "Hydrosphere",
        "sphere_path": "Hydrosphere",
        "subsphere_id": "hydrosphere_freshwater_surface",
        "content": """Rivers, lakes, wetlands, reservoirs, and drainage systems — the visible freshwater on the land surface. This is the twig for hydrographic data describing water bodies, their flow, and their characteristics.

## Scope

- **Rivers and streams**: Channel geometry, streamflow measurements, catchment boundaries, stream order
- **Lakes and ponds**: Extent, depth, volume, water level monitoring
- **Wetlands**: Bog, fen, marsh classification and delineation
- **Reservoirs**: Artificial water bodies, dam locations, storage capacity
- **Drainage**: Drainage networks, tile drain systems, storm drainage routes
- **Estuaries**: Transitional waters where freshwater meets marine (shared with [[SPHERE/Hydrosphere/Marine/index|Marine]])

## Key Distinction: Water Body vs Water Quality

This twig describes the *water body itself* — its geometry, flow, and physical state. The *quality* of the water (pollutant concentrations) is [[SPHERE/Hydrosphere/Contaminants/index|Hydrosphere Contaminants]]. The *organisms in the water* are [[SPHERE/Biosphere/index|Biosphere]].

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Inland Waters | [[Classical Classifications/ISO 19115/inlandWaters\\|Inland Waters]] |
| INSPIRE | Hydrography | [[Classical Classifications/INSPIRE/hydrography\\|Hydrography]] |
| UN-GGIM | Water | [[Classical Classifications/UN-GGIM/water\\|Water]] |""",
    },
    "Hydrosphere/Groundwater": {
        "title": "Groundwater",
        "aliases": ["hydrosphere_groundwater", "Groundwater"],
        "sphere": "Hydrosphere",
        "sphere_path": "Hydrosphere",
        "subsphere_id": "hydrosphere_groundwater",
        "content": """Water beneath the Earth's surface in soil pores and rock fractures. Groundwater is invisible but accounts for a vast share of freshwater resources, making it critical for water supply and ecosystem support.

## Scope

- **Groundwater levels**: Monitoring well data, piezometric surfaces, hydraulic head
- **Aquifer characteristics**: Permeability, transmissivity, storage coefficient, aquifer boundaries
- **Groundwater flow**: Flow direction and velocity, recharge zones, discharge areas (springs)
- **Groundwater–surface water interaction**: Base flow contribution to rivers, spring-fed wetlands

## Cross-Sphere Connections

- **Lithosphere**: Aquifer geometry is determined by geological formations — [[SPHERE/Lithosphere/Geology/index|Geology]]
- **Pedosphere**: Infiltration through soil recharges groundwater — [[SPHERE/Pedosphere/Soil_Properties/index|Soil Properties]]
- **Socio-Technical**: Water abstraction volumes — [[SPHERE/Socio_Technical/Resource_Utilisation/index|Resource Utilisation]]

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Inland Waters | [[Classical Classifications/ISO 19115/inlandWaters\\|Inland Waters]] |
| INSPIRE | Hydrography | [[Classical Classifications/INSPIRE/hydrography\\|Hydrography]] |
| UN-GGIM | Water | [[Classical Classifications/UN-GGIM/water\\|Water]] |""",
    },
    "Hydrosphere/Marine": {
        "title": "Marine Waters",
        "aliases": ["hydrosphere_marine", "Marine", "Oceans"],
        "sphere": "Hydrosphere",
        "sphere_path": "Hydrosphere",
        "subsphere_id": "hydrosphere_marine",
        "content": """Oceans, seas, and coastal waters — their physical properties, circulation, and dynamics. This twig covers the marine water mass itself, including its temperature structure, salinity, currents, and tides.

## Scope

- **Sea surface**: Temperature (as a water mass property), salinity, wave height, current direction
- **Water column**: Temperature profiles, salinity stratification, mixed layer depth
- **Tides and waves**: Tidal gauges, wave buoy data, tidal models
- **Currents**: Surface and deep ocean circulation, coastal currents
- **Bathymetry**: Water depth (shared with [[SPHERE/Toposphere/Topography/index|Topography]] for seafloor geometry)
- **Sea regions**: Named sea areas, maritime zones, EEZ boundaries

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Oceans | [[Classical Classifications/ISO 19115/oceans\\|Oceans]] |
| INSPIRE | Hydrography | [[Classical Classifications/INSPIRE/hydrography\\|Hydrography]] |
| INSPIRE | Oceanographic Geographical Features | [[Classical Classifications/INSPIRE/oceanographic-geographical-features\\|Oceanographic Geographical Features]] |
| INSPIRE | Sea Regions | [[Classical Classifications/INSPIRE/sea-regions\\|Sea Regions]] |
| UN-GGIM | Water | [[Classical Classifications/UN-GGIM/water\\|Water]] |""",
    },
    "Hydrosphere/Cryosphere": {
        "title": "Cryosphere",
        "aliases": ["hydrosphere_cryosphere", "Cryosphere", "Ice"],
        "sphere": "Hydrosphere",
        "sphere_path": "Hydrosphere",
        "subsphere_id": "hydrosphere_cryosphere",
        "content": """Frozen water in all its forms — glaciers, ice sheets, sea ice, permafrost, seasonal snow cover. While Denmark proper has limited cryosphere data, Greenland makes this twig critical for the Danish realm.

## Scope

- **Glaciers**: Ice mass, flow velocity, calving fronts, volume change (Greenland ice sheet)
- **Sea ice**: Extent, thickness, concentration, ice type classification
- **Permafrost**: Distribution, active layer depth, ground temperature (Greenland, Arctic)
- **Seasonal snow**: Snow cover extent, snow depth, snow water equivalent (SWE)

## Greenland Context

The Greenland Ice Sheet is one of the most studied cryospheric features on Earth. Danish institutions (GEUS, DMI) produce critical datasets on ice mass balance, firn temperature, and meltwater runoff that feed into global sea level projections.

## Classical Theme Mappings

No direct classical theme — cryosphere data is typically classified under Inland Waters (ISO) or Hydrography (INSPIRE) for ice sheets, and Meteorological Features for snow cover.""",
    },
    "Hydrosphere/Atmospheric_Water": {
        "title": "Atmospheric Water",
        "aliases": ["hydrosphere_atmosphericwater", "Atmospheric Water", "Precipitation"],
        "sphere": "Hydrosphere",
        "sphere_path": "Hydrosphere",
        "subsphere_id": "hydrosphere_atmosphericwater",
        "content": """Water in the atmosphere — precipitation, humidity, cloud properties, water vapour. This is the *hydrological* view of atmospheric moisture, complementing the *meteorological* view in [[SPHERE/Atmosphere/Weather/index|Weather]].

## Scope

- **Precipitation**: Rainfall totals, snowfall amounts, mixed precipitation, gauge and radar data
- **Humidity**: Relative and absolute humidity, dew point
- **Cloud properties**: Cloud cover, liquid water content, cloud type
- **Water vapour**: Column-integrated water vapour, vertical profiles
- **Evapotranspiration**: Actual and potential ET as the return flux

## Why This Exists Alongside Atmosphere Weather

Precipitation is simultaneously an atmospheric phenomenon and a hydrological input. The *measurement* of rainfall is [[SPHERE/Atmosphere/Weather/index|Weather]]. The *hydrological significance* — how much water reaches the ground and enters the water cycle — lives here. Many precipitation datasets serve both purposes, so this twig enables discovery from the water cycle perspective.

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Climatology/Meteorology/Atmosphere | [[Classical Classifications/ISO 19115/climatologyMeteorologyAtmosphere\\|Climatology/Meteorology/Atmosphere]] |""",
    },
    "Hydrosphere/Contaminants": {
        "title": "Water Contaminants",
        "aliases": ["hydrosphere_contaminants", "Water Quality"],
        "sphere": "Hydrosphere",
        "sphere_path": "Hydrosphere",
        "subsphere_id": "hydrosphere_contaminants",
        "content": """Pollutants in water bodies — chemical, physical, and biological water quality measurements. This twig records what is *in the water*, not where the pollution comes from (that's [[SPHERE/Socio_Technical/Contaminants/index|Socio-Technical Contaminants]]).

## Scope

- **Chemical pollutants**: Heavy metals, pesticides, pharmaceuticals, microplastics in water
- **Nutrient loading**: Nitrogen, phosphorus concentrations causing eutrophication
- **Physical parameters**: Turbidity, dissolved oxygen, conductivity, temperature anomalies
- **Biological indicators**: E. coli counts, algal bloom extent, chlorophyll-a concentrations
- **Water quality indices**: WQI, ecological status under the EU Water Framework Directive

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Environment | [[Classical Classifications/ISO 19115/environment\\|Environment]] |
| INSPIRE | Environmental Monitoring Facilities | [[Classical Classifications/INSPIRE/environmental-monitoring-facilities\\|Environmental Monitoring Facilities]] |""",
    },
    # ── LITHOSPHERE (5 new) ─────────────────────────────────────────────────
    "Lithosphere/Geology": {
        "title": "Geology",
        "aliases": ["lithosphere_geology", "Geology", "Bedrock"],
        "sphere": "Lithosphere",
        "sphere_path": "Lithosphere",
        "subsphere_id": "lithosphere_geology",
        "content": """Rocks, minerals, and geological formations — the structure and composition of the Earth's crust. Geological data describes what the ground is *made of* and how it got there.

## Scope

- **Geological maps**: Bedrock geology, surficial geology, geological unit boundaries
- **Borehole data**: Subsurface stratigraphy from drilling logs, geological cross-sections
- **Structural geology**: Fault lines, fold axes, dip/strike measurements
- **Geochemistry**: Chemical composition of rock formations, radiometric dating
- **Geomorphology**: Landform classification based on geological processes (glacial, fluvial, aeolian)

## Denmark-Specific Context

Denmark's geology is dominated by Quaternary deposits (glacial tills, outwash sands) overlying Cretaceous–Paleogene chalk and limestone. GEUS (Geological Survey of Denmark and Greenland) is the authoritative source. The Jupiter database contains tens of thousands of borehole records.

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Geoscientific Information | [[Classical Classifications/ISO 19115/geoscientificInformation\\|Geoscientific Information]] |
| INSPIRE | Geology | [[Classical Classifications/INSPIRE/geology\\|Geology]] |
| UN-GGIM | Geology and Soils | [[Classical Classifications/UN-GGIM/geology-and-soils\\|Geology and Soils]] |""",
    },
    "Lithosphere/Tectonics": {
        "title": "Tectonics",
        "aliases": ["lithosphere_tectonics", "Tectonics", "Seismic"],
        "sphere": "Lithosphere",
        "sphere_path": "Lithosphere",
        "subsphere_id": "lithosphere_tectonics",
        "content": """Crustal movements, earthquakes, and volcanic activity. Denmark is tectonically quiet but not inactive — the country experiences minor earthquakes, and the subsurface is influenced by post-glacial rebound and salt tectonics.

## Scope

- **Seismic activity**: Earthquake epicentres, magnitude, depth, focal mechanisms
- **Fault lines**: Mapped tectonic faults, potential rupture zones
- **Crustal deformation**: Post-glacial rebound rates, GPS-measured uplift/subsidence
- **Volcanic activity**: Not relevant for Denmark, but included for completeness

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Geoscientific Information | [[Classical Classifications/ISO 19115/geoscientificInformation\\|Geoscientific Information]] |""",
    },
    "Lithosphere/Resources": {
        "title": "Geological Resources",
        "aliases": ["lithosphere_resources", "Mineral Resources", "Energy Resources"],
        "sphere": "Lithosphere",
        "sphere_path": "Lithosphere",
        "subsphere_id": "lithosphere_resources",
        "content": """Geological resources — mineral deposits, fossil fuel reservoirs, geothermal potential, construction materials. This twig records where resources *exist in the ground*. How much humans extract is [[SPHERE/Socio_Technical/Resource_Utilisation/index|Resource Utilisation]].

## Scope

- **Mineral deposits**: Metal ores, industrial minerals, rare earth elements
- **Construction materials**: Gravel, sand, clay, limestone quarry sites
- **Fossil fuels**: Oil and gas reservoirs, coal deposits (historically in Denmark: North Sea oil/gas)
- **Geothermal energy**: Subsurface temperature gradients, geothermal reservoir characterisation

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Geoscientific Information | [[Classical Classifications/ISO 19115/geoscientificInformation\\|Geoscientific Information]] |
| INSPIRE | Energy Resources | [[Classical Classifications/INSPIRE/energy-resources\\|Energy Resources]] |
| INSPIRE | Mineral Resources | [[Classical Classifications/INSPIRE/mineral-resources\\|Mineral Resources]] |""",
    },
    "Lithosphere/Hazards": {
        "title": "Lithospheric Hazards",
        "aliases": ["lithosphere_hazards", "Geological Hazards"],
        "sphere": "Lithosphere",
        "sphere_path": "Lithosphere",
        "subsphere_id": "lithosphere_hazards",
        "content": """Natural hazards originating from lithospheric processes — the *physical hazard* itself, not the risk to humans (that's [[SPHERE/Socio_Technical/Hazard_Vulnerability_Risk/index|Hazard, Vulnerability, and Risk]]).

## Scope

- **Landslide susceptibility**: Slope stability mapping, landslide inventories, susceptibility models
- **Ground stability**: Sinkhole locations, subsidence maps, karst features
- **Seismic hazard**: Probabilistic seismic hazard maps, peak ground acceleration
- **Coastal erosion**: Cliff retreat rates (the geological process — coastal flood risk is [[SPHERE/Socio_Technical/Hazard_Vulnerability_Risk/index|risk]])

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| INSPIRE | Natural Risk Zones | [[Classical Classifications/INSPIRE/natural-risk-zones\\|Natural Risk Zones]] |""",
    },
    "Lithosphere/Contaminants": {
        "title": "Lithosphere Contaminants",
        "aliases": ["lithosphere_contaminants", "Geological Contamination"],
        "sphere": "Lithosphere",
        "sphere_path": "Lithosphere",
        "subsphere_id": "lithosphere_contaminants",
        "content": """Naturally occurring pollutants within geological formations and contamination of the subsurface. This covers *geological* contamination — radon from bedrock, heavy metals in rock formations, contaminated groundwater source zones.

## Scope

- **Radon mapping**: Natural radon emission from geological formations
- **Heavy metals in bedrock**: Naturally elevated arsenic, lead, or cadmium in geological units
- **Contaminated land registry**: Sites where subsurface is contaminated (industrial legacy, landfills)
- **Source zone characterisation**: DNAPL plumes, contaminant migration in fractured rock

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Environment | [[Classical Classifications/ISO 19115/environment\\|Environment]] |""",
    },
    # ── PEDOSPHERE (5 new) ──────────────────────────────────────────────────
    "Pedosphere/Soil_Properties": {
        "title": "Soil Properties",
        "aliases": ["pedosphere_soil_properties", "Soil Properties"],
        "sphere": "Pedosphere",
        "sphere_path": "Pedosphere",
        "subsphere_id": "pedosphere_soil_properties",
        "content": """Measured physical, chemical, and biological attributes of soil — what the soil *is* at a given location. This is the analytical data from soil sampling and laboratory analysis.

## Scope

- **Physical properties**: Texture (sand/silt/clay fractions), bulk density, porosity, structure
- **Chemical properties**: pH, organic carbon content, CEC, nutrient levels (N, P, K)
- **Biological properties**: Microbial biomass, enzyme activity, earthworm counts
- **Hydraulic properties**: Infiltration rate, field capacity, wilting point, hydraulic conductivity
- **Depth profiles**: Properties measured at multiple depths through the soil profile

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| INSPIRE | Soil | [[Classical Classifications/INSPIRE/soil\\|Soil]] |
| UN-GGIM | Geology and Soils | [[Classical Classifications/UN-GGIM/geology-and-soils\\|Geology and Soils]] |""",
    },
    "Pedosphere/Soil_Types_Mapping": {
        "title": "Soil Types and Mapping",
        "aliases": ["pedosphere_soil_types_mapping", "Soil Classification"],
        "sphere": "Pedosphere",
        "sphere_path": "Pedosphere",
        "subsphere_id": "pedosphere_soil_types_mapping",
        "content": """Soil classification and spatial mapping — categorical data about what *type* of soil exists where. Where [[SPHERE/Pedosphere/Soil_Properties/index|Soil Properties]] gives measured values, this twig gives classifications.

## Scope

- **Soil taxonomic units**: WRB (World Reference Base), USDA Soil Taxonomy, national systems
- **Soil maps**: National/regional maps showing soil type distribution
- **Soil associations**: Mapping units grouping related soil types
- **Parent material mapping**: Relationship between surface geology and soil type

## Denmark-Specific Context

Danish soil mapping is well-developed. The national soil classification covers agricultural and forest soils, with detailed data on soil type, organic matter content, and groundwater table depth. GEUS provides geological parent material maps that directly link to [[SPHERE/Lithosphere/Geology/index|Lithosphere Geology]].

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Geoscientific Information | [[Classical Classifications/ISO 19115/geoscientificInformation\\|Geoscientific Information]] |
| INSPIRE | Soil | [[Classical Classifications/INSPIRE/soil\\|Soil]] |
| UN-GGIM | Geology and Soils | [[Classical Classifications/UN-GGIM/geology-and-soils\\|Geology and Soils]] |""",
    },
    "Pedosphere/Soil_Moisture_Temperature": {
        "title": "Soil Moisture and Temperature",
        "aliases": ["pedosphere_soil_moisture_temperature", "Soil Moisture"],
        "sphere": "Pedosphere",
        "sphere_path": "Pedosphere",
        "subsphere_id": "pedosphere_soil_moisture_temperature",
        "content": """Dynamic water and heat content within soil profiles — time-varying states rather than static properties. This twig captures the *current condition* of the soil.

## Scope

- **Soil moisture**: Volumetric water content, matric potential, sensor network time series
- **Soil temperature**: Temperature at various depths, frost depth, freeze/thaw dynamics
- **Remote sensing products**: Satellite-derived soil moisture (SMAP, SMOS, Sentinel-1)
- **Drought indicators**: Soil moisture deficit, plant-available water stress

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| INSPIRE | Soil | [[Classical Classifications/INSPIRE/soil\\|Soil]] |""",
    },
    "Pedosphere/Soil_Erosion_Sedimentation": {
        "title": "Soil Erosion and Sedimentation",
        "aliases": ["pedosphere_soil_erosion_sedimentation", "Soil Erosion"],
        "sphere": "Pedosphere",
        "sphere_path": "Pedosphere",
        "subsphere_id": "pedosphere_soil_erosion_sedimentation",
        "content": """Soil loss, deposition, and land degradation processes — the dynamic reshaping of the soil landscape. This twig tracks how soil moves and where it accumulates.

## Scope

- **Erosion rates**: Measured or modelled soil loss (USLE/RUSLE, PESERA)
- **Erodibility indices**: K-factor, slope-length factor, rainfall erosivity
- **Sediment yield**: Suspended sediment in rivers as a proxy for upstream erosion
- **Deposition**: Colluvial and alluvial sediment accumulation zones
- **Land degradation**: Desertification risk, soil sealing, compaction

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| INSPIRE | Soil | [[Classical Classifications/INSPIRE/soil\\|Soil]] |""",
    },
    "Pedosphere/Contaminants": {
        "title": "Soil Contaminants",
        "aliases": ["pedosphere_contaminants", "Soil Contamination"],
        "sphere": "Pedosphere",
        "sphere_path": "Pedosphere",
        "subsphere_id": "pedosphere_contaminants",
        "content": """Pollutants within the soil matrix — heavy metals, organic pollutants, and their spatial distribution. This is what's *in the soil*, complementing [[SPHERE/Socio_Technical/Contaminants/index|Socio-Technical Contaminants]] (the human source) and [[SPHERE/Lithosphere/Contaminants/index|Lithosphere Contaminants]] (geological sources).

## Scope

- **Heavy metal contamination**: Cd, Pb, Zn, Cu, Hg concentrations in topsoil
- **Organic pollutants**: PAHs, PCBs, PFAS, petroleum hydrocarbons in soil
- **Pesticide residues**: Agricultural pesticide concentrations in soil profiles
- **Nutrient excess**: Nitrate leaching risk, phosphorus saturation levels
- **Contaminated site registers**: Point-source contaminated land inventories

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Environment | [[Classical Classifications/ISO 19115/environment\\|Environment]] |
| INSPIRE | Soil | [[Classical Classifications/INSPIRE/soil\\|Soil]] |""",
    },
    # ── TOPOSPHERE (2 new — Topography exists) ──────────────────────────────
    "Toposphere/Surface_Radiative_Thermal": {
        "title": "Surface Radiative and Thermal Properties",
        "aliases": ["toposphere_surface_radiative_thermal", "Surface Temperature"],
        "sphere": "Toposphere",
        "sphere_path": "Toposphere",
        "subsphere_id": "toposphere_surface_radiative_thermal",
        "content": """Energy exchange properties of the Earth's surface — how the surface absorbs, reflects, and emits radiation. This twig describes the surface as an *energy interface*, distinct from air temperature (Atmosphere) or water temperature (Hydrosphere).

## Scope

- **Albedo**: Surface reflectivity at various wavelengths
- **Land Surface Temperature (LST)**: Skin temperature from thermal infrared sensors
- **Sea Surface Temperature (SST)**: As a surface property (water mass temperature is [[SPHERE/Hydrosphere/Marine/index|Marine]])
- **Surface emissivity**: Thermal emission characteristics
- **Net radiation**: Surface energy balance components

## Classical Theme Mappings

No direct classical theme — surface radiative properties are typically classified under Imagery/BaseMaps (ISO) or distributed across Atmospheric Conditions and Orthoimagery (INSPIRE).""",
    },
    "Toposphere/Surface_Physical": {
        "title": "Surface Physical Properties",
        "aliases": ["toposphere_surface_physical", "Surface Roughness"],
        "sphere": "Toposphere",
        "sphere_path": "Toposphere",
        "subsphere_id": "toposphere_surface_physical",
        "content": """Physical characteristics of the surface that influence interactions between spheres — roughness, permeability, and resistance properties. The surface as a *boundary condition* for hydrological and atmospheric models.

## Scope

- **Surface roughness**: Aerodynamic roughness length (z₀) for wind modelling, hydraulic roughness for overland flow
- **Aerodynamic resistance**: Resistance to turbulent heat/moisture exchange
- **Infiltration capacity**: As a surface interface property (soil-specific infiltration is [[SPHERE/Pedosphere/Soil_Properties/index|Soil Properties]])
- **Impervious surface**: Fraction of sealed/paved ground

## Classical Theme Mappings

No direct classical theme — surface physical properties are implicit in elevation models and land cover classifications.""",
    },
    "Toposphere/Imagery": {
        "title": "Imagery",
        "aliases": ["toposphere_imagery", "Imagery", "Orthoimagery", "Remote Sensing"],
        "sphere": "Toposphere",
        "sphere_path": "Toposphere",
        "subsphere_id": "toposphere_imagery",
        "content": """Raw or processed aerial and satellite imagery — direct visual representations of the Earth's surface. Imagery is the *source material* from which many other datasets are derived: land cover maps, building footprints, forest inventories, and change detection products.

## Scope

- **Orthophotos**: Geometrically corrected aerial photographs, typically at 10-25 cm resolution for Denmark
- **Satellite imagery**: Multispectral (Sentinel-2, Landsat), radar (Sentinel-1), very high resolution (commercial)
- **Historical imagery**: Archived aerial photos dating back decades, invaluable for change analysis
- **Image mosaics**: Seamless composites covering large areas at a single conceptual timestamp
- **LiDAR point clouds**: As raw 3D surface representation (derived DEMs are [[SPHERE/Toposphere/Topography/index|Topography]])

## Key Distinction: Imagery vs Classified Products

Raw imagery lives here. When imagery is *classified* into thematic categories (forest, urban, water), the classified product moves to [[SPHERE/LandUseLandCover/Classified_Products/index|LandUseLandCover Classified Products]]. The imagery twig is the **source**; LULC is the **derived product**.

## Denmark-Specific Context

Denmark has excellent orthophoto coverage through Dataforsyningen (SDFI), with nationwide orthophotos updated regularly. GeoDanmark also provides orthophoto products. Historical aerial photos from the 1940s–1990s are available through Historiske Kort.

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Imagery/BaseMaps/EarthCover | [[Classical Classifications/ISO 19115/imageryBaseMapsEarthCover\\|Imagery/BaseMaps/EarthCover]] |
| INSPIRE | Orthoimagery | [[Classical Classifications/INSPIRE/orthoimagery\\|Orthoimagery]] |
| UN-GGIM | Orthoimagery | [[Classical Classifications/UN-GGIM/orthoimagery\\|Orthoimagery]] |""",
    },
    # ── LAND USE / LAND COVER (3 new) ───────────────────────────────────────
    "LandUseLandCover/Classified_Products": {
        "title": "Classified Products",
        "aliases": ["landuselancover_classified_products", "Land Cover Maps"],
        "sphere": "LandUseLandCover",
        "sphere_path": "LandUseLandCover",
        "subsphere_id": "landuselancover_classified_products",
        "content": """Standard land cover and land use maps where the surface is divided into thematic categories. This is the core LULC product — maps of forests, agricultural lands, urban areas, water bodies, bare land, and settlements.

## Scope

- **National land cover**: Danish-specific land cover/use classifications
- **European products**: CORINE Land Cover, Urban Atlas, Copernicus Land Monitoring Service
- **Detailed urban classification**: Residential, commercial, industrial, mixed-use zones
- **Agricultural classification**: Crop type maps, field boundary delineation
- **Natural cover**: Forest type, grassland, heathland, wetland classification

## The Bridge Sphere

LULC is inherently cross-domain — this is its defining characteristic:
- **Land cover** (what the surface *looks like*) connects to [[SPHERE/Biosphere/index|Biosphere]], [[SPHERE/Hydrosphere/index|Hydrosphere]], [[SPHERE/Pedosphere/index|Pedosphere]]
- **Land use** (what humans *do* on the surface) connects to [[SPHERE/Socio_Technical/index|Socio-Technical]]
- **Source data** comes from [[SPHERE/Toposphere/Imagery/index|Toposphere Imagery]]

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Imagery/BaseMaps/EarthCover | [[Classical Classifications/ISO 19115/imageryBaseMapsEarthCover\\|Imagery/BaseMaps/EarthCover]] |
| INSPIRE | Land Cover and Use | [[Classical Classifications/INSPIRE/land-cover-and-use\\|Land Cover and Use]] |
| UN-GGIM | Land Cover and Land Use | [[Classical Classifications/UN-GGIM/land-cover-and-land-use\\|Land Cover and Land Use]] |""",
    },
    "LandUseLandCover/Change_Monitoring": {
        "title": "Change Monitoring",
        "aliases": ["landuselancover_change_monitoring", "LULC Change"],
        "sphere": "LandUseLandCover",
        "sphere_path": "LandUseLandCover",
        "subsphere_id": "landuselancover_change_monitoring",
        "content": """Data specifically tracking changes in land use and land cover over time — deforestation, urban sprawl, agricultural intensification, wetland loss.

## Scope

- **LULC transition matrices**: From-to change between classification categories
- **Deforestation/afforestation**: Forest cover change maps
- **Urban sprawl**: Expansion of built-up areas over time
- **Agricultural change**: Field boundary changes, crop rotation, land abandonment
- **Historical comparisons**: Multi-epoch land cover datasets designed for change analysis

## Key Distinction

A single land cover map snapshot is a [[SPHERE/LandUseLandCover/Classified_Products/index|Classified Product]]. A dataset explicitly designed to show *change* (two or more epochs compared) lives here.

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| INSPIRE | Land Cover and Use | [[Classical Classifications/INSPIRE/land-cover-and-use\\|Land Cover and Use]] |""",
    },
    "LandUseLandCover/General_Reference": {
        "title": "General Reference Maps",
        "aliases": ["landuselancover_general_reference", "Base Maps"],
        "sphere": "LandUseLandCover",
        "sphere_path": "LandUseLandCover",
        "subsphere_id": "landuselancover_general_reference",
        "content": """Multi-thematic, general-purpose maps that partition the surface for broad understanding or navigation. These aren't single-theme datasets — they combine land cover, infrastructure, water features, and place names into a unified representation.

## Scope

- **Topographic map sheets**: National map series (1:25k, 1:50k, 1:100k), both current and historical
- **OpenStreetMap**: Crowd-sourced general-purpose spatial data
- **General reference datasets**: GeoDanmark vector data (roads + buildings + water + land cover in one package)
- **Historical maps**: Digitised historical map sheets showing past land use patterns

## Denmark-Specific Context

- **GeoDanmark**: The authoritative multi-theme vector dataset combining buildings, roads, water features, vegetation, and more
- **Historiske Kort**: Digitised historical map sheets from the 1800s–1900s, invaluable for change analysis
- **Kortforsyningen**: SDFI's map tile services providing rendered base maps

## Classical Theme Mappings

| Standard | Theme | Link |
|---|---|---|
| ISO 19115 | Imagery/BaseMaps/EarthCover | [[Classical Classifications/ISO 19115/imageryBaseMapsEarthCover\\|Imagery/BaseMaps/EarthCover]] |""",
    },
}


# ═══════════════════════════════════════════════════════════════════════════════
# NEW LEAVES — 9 dataset-backed leaves from classical themes
# ═══════════════════════════════════════════════════════════════════════════════

NEW_LEAVES = [
    {
        "filename": "dar-addresses.md",
        "title": "Addresses",
        "sphere": "Socio_Technical",
        "subsphere": "Socio_technical_governance",
        "collection": "DanmarksAdresser",
        "concept": "Address identification",
        "question": "Where is a property located by its official address?",
        "entities": ["adresse", "adressepunkt", "husnummer", "navngivenvej", "postnummer"],
        "key_attributes": ["adressebetegnelse", "husnummertekst", "postnr", "postnrnavn", "etage", "doer"],
        "lianas": [],
        "classical_refs": [
            ("ISO 19115", "Location", "Classical Classifications/ISO 19115/location"),
            ("INSPIRE", "Addresses", "Classical Classifications/INSPIRE/addresses"),
            ("UN-GGIM", "Addresses", "Classical Classifications/UN-GGIM/addresses"),
        ],
        "body": """Addresses are the universal join key for Danish data. Nearly every register — from CVR to BBR to Person — references addresses in [[Datasets by Collection/Grunddatamodellen/DanmarksAdresser/index|DAR (DanmarksAdresser)]]. An address connects a human activity to a point in space.

## Source Entities

| Entity | Role |
|---|---|
| **adresse** | The full address (dwelling-level: floor + door) |
| **husnummer** | House number on a named road |
| **navngivenvej** | Named road (street) |
| **adressepunkt** | Geographic coordinate of the address |
| **postnummer** | Postal code area |

## Key Attributes

| Attribute | Description | Notes |
|---|---|---|
| `adressebetegnelse` | Full formatted address string | Human-readable composite |
| `husnummertekst` | House number including letter suffix | e.g., "12A" |
| `postnr` | 4-digit postal code | Links to postal geography |
| `etage` | Floor number | For apartment addresses |
| `doer` | Door identifier | "tv", "th", "mf", or number |

## Why Addresses Matter for Spatial Analysis

DAR is the **geocoding backbone** of Danish data. Any register that stores address references can be geocoded by joining to DAR's `adressepunkt`. This leaf is the starting point for spatial analysis across all Grunddata registries.

See also [[Leaves/cvr-spatial-footprint|Business Spatial Footprint]] which depends on DAR for geocoding CVR addresses.

## Access

- **GraphQL**: Query `adresse` with filters on `postnr`, `kommunekode`, `vejnavn`
- **File Download**: Bulk `adresse` + `adressepunkt` + `husnummer` exports
- **DAWA**: The free address web API at https://api.dataforsyningen.dk/adresser""",
    },
    {
        "filename": "bbr-buildings.md",
        "title": "Buildings and Housing",
        "sphere": "Socio_Technical",
        "subsphere": "Socio_technical_infrastructure",
        "collection": "BygningerOgBoliger",
        "concept": "Building registry",
        "question": "What buildings exist at a location and what are their characteristics?",
        "entities": ["bygning", "enhed", "etage", "opgang", "grund", "tekniskanlæg"],
        "key_attributes": ["byg_anvendelse", "byg_opfoerelsesaar", "byg_areal", "byg_antal_etager", "byg_varmeinstallation"],
        "lianas": [],
        "classical_refs": [
            ("INSPIRE", "Buildings", "Classical Classifications/INSPIRE/buildings"),
            ("UN-GGIM", "Buildings and Settlements", "Classical Classifications/UN-GGIM/buildings-and-settlements"),
            ("ISO 19115", "Structure", "Classical Classifications/ISO 19115/structure"),
        ],
        "body": """Denmark's building register ([[Datasets by Collection/BygningerOgBoliger/index|BBR — BygningerOgBoliger]]) records every building in the country with detailed attributes: use type, construction year, area, number of floors, heating type, and more.

## Source Entities

| Entity | Role |
|---|---|
| **bygning** | The building itself — footprint, construction details, use code |
| **enhed** | Dwelling or commercial unit within a building |
| **etage** | Floor level within the building |
| **opgang** | Staircase/entrance |
| **grund** | Ground parcel the building sits on |
| **tekniskanlæg** | Technical installations (heating plants, solar panels) |

## Key Attributes

| Attribute | Description | Notes |
|---|---|---|
| `byg_anvendelse` | Building use code | Detailed classification (residential, commercial, industrial, public) |
| `byg_opfoerelsesaar` | Year of construction | Key for age-based analysis |
| `byg_areal` | Building area (m²) | Multiple area types: footprint, gross, net |
| `byg_antal_etager` | Number of floors | Including basement if applicable |
| `byg_varmeinstallation` | Heating type | District heating, gas, electric, etc. |

## Join to Addresses and Parcels

Buildings connect to the wider Grunddata network:
- **→ DAR**: Each building has an address via [[Leaves/dar-addresses|Addresses]]
- **→ Matrikel**: Buildings sit on cadastral parcels via [[Leaves/mat-cadastral-parcels|Cadastral Parcels]]
- **→ Ejendomsvurdering**: Buildings carry property valuations

## Access

- **GraphQL**: Query `bygning` with filters on `kommunekode`, `byg_anvendelse`, `byg_opfoerelsesaar`
- **File Download**: Bulk BBR entity exports""",
    },
    {
        "filename": "dagi-administrative-units.md",
        "title": "Administrative Units",
        "sphere": "Socio_Technical",
        "subsphere": "Socio_technical_governance",
        "collection": "DAGI",
        "concept": "Administrative divisions",
        "question": "Which administrative area does a location belong to?",
        "entities": ["kommune", "region", "sogn", "retskreds", "politikreds", "opstillingskreds", "afstemningsomraade"],
        "key_attributes": ["kommunekode", "regionskode", "navn", "geometri"],
        "lianas": [],
        "classical_refs": [
            ("INSPIRE", "Administrative Units", "Classical Classifications/INSPIRE/administrative-units"),
            ("ISO 19115", "Boundaries", "Classical Classifications/ISO 19115/boundaries"),
        ],
        "body": """[[Datasets by Collection/Grunddatamodellen/DAGI/index|DAGI (Danmarks Administrative Geografiske Inddeling)]] provides the authoritative administrative boundaries for Denmark — municipalities, regions, parishes, judicial districts, police districts, and electoral units.

## Source Entities

| Entity | Role |
|---|---|
| **kommune** | Municipality (98 in Denmark) |
| **region** | Region (5 in Denmark) |
| **sogn** | Parish |
| **retskreds** | Judicial district |
| **politikreds** | Police district |
| **opstillingskreds** | Electoral constituency |
| **afstemningsomraade** | Polling district |

## Why Administrative Units Matter

Administrative units are the **spatial aggregation framework** for Danish statistics. Most data is reported at the municipal level. DAGI provides the geometries needed to:
- Aggregate point data (businesses, population) to administrative areas
- Perform spatial joins ("which municipality is this address in?")
- Map electoral, judicial, and ecclesiastical geography

## Access

- **GraphQL**: Query any DAGI entity with geometry output
- **WFS**: OGC Web Feature Service for boundaries
- **File Download**: GeoJSON/GML boundary exports""",
    },
    {
        "filename": "mat-cadastral-parcels.md",
        "title": "Cadastral Parcels",
        "sphere": "Socio_Technical",
        "subsphere": "Socio_technical_governance",
        "collection": "Matrikel",
        "concept": "Land parcels and ownership",
        "question": "What are the legal boundaries and ownership of land?",
        "entities": ["jordstykke", "matrikelnummer", "ejerlav", "skelforretning"],
        "key_attributes": ["matrikelnummer", "ejerlavskode", "registreretareal", "arealberegningsmetode", "geometri"],
        "lianas": [],
        "classical_refs": [
            ("INSPIRE", "Cadastral Parcels", "Classical Classifications/INSPIRE/cadastral-parcels"),
            ("UN-GGIM", "Land Parcels", "Classical Classifications/UN-GGIM/land-parcels"),
            ("ISO 19115", "Planning/Cadastre", "Classical Classifications/ISO 19115/planningCadastre"),
        ],
        "body": """The [[Datasets by Collection/Grunddatamodellen/Matrikel/index|Matrikel]] is Denmark's cadastral register — the authoritative record of land parcels, their boundaries, area, and identification. Every piece of land in Denmark has a matrikel number within an ejerlav (cadastral district).

## Source Entities

| Entity | Role |
|---|---|
| **jordstykke** | The cadastral parcel — geometry and attributes |
| **matrikelnummer** | Unique parcel identifier within an ejerlav |
| **ejerlav** | Cadastral district grouping parcels |
| **skelforretning** | Boundary survey events |

## Join to Ownership and Buildings

- **→ Ejerfortegnelsen**: Parcel ownership via [[Datasets by Collection/Grunddatamodellen/Ejerfortegnelsen/index|Ejerfortegnelsen]]
- **→ BBR**: Buildings on the parcel via [[Leaves/bbr-buildings|Buildings]]
- **→ Ejendomsvurdering**: Parcel valuation

## Access

- **GraphQL**: Query `jordstykke` with geometry filters
- **WFS**: Cadastral boundary geometries as OGC web feature service
- **File Download**: Bulk parcel exports with geometry""",
    },
    {
        "filename": "ds-geographical-names.md",
        "title": "Geographical Names",
        "sphere": "Socio_Technical",
        "subsphere": "Socio_technical_governance",
        "collection": "Stednavne",
        "concept": "Place names",
        "question": "What is the official name of a place or feature?",
        "entities": ["stednavn", "stednavntype"],
        "key_attributes": ["navn", "stednavntype", "geometri", "sprog"],
        "lianas": [],
        "classical_refs": [
            ("INSPIRE", "Geographical Names", "Classical Classifications/INSPIRE/geographical-names"),
            ("UN-GGIM", "Geographical Names", "Classical Classifications/UN-GGIM/geographical-names"),
        ],
        "body": """[[Datasets by Collection/Grunddatamodellen/Stednavne/index|Stednavne]] is Denmark's authoritative gazetteer — the register of official place names for natural features, settlements, administrative areas, and other named locations.

## Key Attributes

| Attribute | Description |
|---|---|
| `navn` | The place name text |
| `stednavntype` | Type of feature (city, island, forest, lake, etc.) |
| `geometri` | Point or polygon geometry of the named feature |
| `sprog` | Language (Danish, Greenlandic, etc.) |

## Role in Data Discovery

Geographical names are how humans refer to locations. A gazetteer enables natural-language geographic search — "find data near Roskilde" requires resolving "Roskilde" to coordinates.

## Access

- **GraphQL**: Query `stednavn` with text search and type filters
- **File Download**: Full gazetteer export""",
    },
    {
        "filename": "dhm-elevation.md",
        "title": "Elevation Models",
        "sphere": "Toposphere",
        "subsphere": "Topography",
        "collection": "DHMOprindelse",
        "concept": "Terrain elevation",
        "question": "What is the elevation at a given location?",
        "entities": ["DHM/Punktsky", "DHM/Terræn", "DHM/Overflade"],
        "key_attributes": ["elevation_value", "horizontal_accuracy", "vertical_accuracy", "acquisition_date"],
        "lianas": ["Hydrosphere"],
        "classical_refs": [
            ("ISO 19115", "Elevation", "Classical Classifications/ISO 19115/elevation"),
            ("INSPIRE", "Elevation", "Classical Classifications/INSPIRE/elevation"),
            ("UN-GGIM", "Elevation and Depth", "Classical Classifications/UN-GGIM/elevation-and-depth"),
        ],
        "body": """Denmark's national elevation data ([[Datasets by Collection/Grunddatamodellen/DHMOprindelse/index|DHM — Danmarks Højdemodel]]) provides terrain and surface models derived from airborne LiDAR. The DHM is among the highest-quality national elevation datasets in Europe.

## Products

| Product | Description | Resolution |
|---|---|---|
| **DTM (Terrænmodel)** | Bare-earth elevation (ground surface only) | 0.4m grid |
| **DSM (Overflademodel)** | Including buildings, vegetation, bridges | 0.4m grid |
| **Point cloud** | Raw LiDAR returns with classification | ~4-5 pts/m² |
| **Contour lines** | Derived from DTM | 0.5m and 2.5m intervals |

See also [[SPHERE/Toposphere/Topography/DSM|DSM]] and [[SPHERE/Toposphere/Topography/DTM|DTM]] for detailed product descriptions.

## Why Elevation Matters

Elevation is a foundation layer for:
- **Flood modelling**: Where does water flow and accumulate? (liana to [[SPHERE/Hydrosphere/index|Hydrosphere]])
- **Solar analysis**: Roof orientation and shading for solar panel placement
- **Visibility analysis**: Viewsheds, line of sight
- **Climate adaptation**: Identifying low-lying areas vulnerable to sea level rise

## Access

- **Dataforsyningen**: Tile download service for DHM products
- **WCS**: Web Coverage Service for elevation data
- **File Download**: GeoTIFF and LAZ formats""",
    },
    {
        "filename": "orthoimagery.md",
        "title": "Orthoimagery",
        "sphere": "Toposphere",
        "subsphere": "toposphere_imagery",
        "collection": "GeoDanmark",
        "concept": "Aerial and satellite imagery",
        "question": "What does the Earth's surface look like at a location?",
        "entities": ["orthophoto", "image_tile"],
        "key_attributes": ["acquisition_date", "ground_resolution", "spectral_bands", "cloud_cover"],
        "lianas": ["LandUseLandCover"],
        "classical_refs": [
            ("ISO 19115", "Imagery/BaseMaps/EarthCover", "Classical Classifications/ISO 19115/imageryBaseMapsEarthCover"),
            ("INSPIRE", "Orthoimagery", "Classical Classifications/INSPIRE/orthoimagery"),
            ("UN-GGIM", "Orthoimagery", "Classical Classifications/UN-GGIM/orthoimagery"),
        ],
        "body": """Georeferenced aerial and satellite imagery of Denmark. National orthophotos are produced cooperatively by SDFI and municipalities, providing a uniform, geometrically corrected view of the country's surface.

## Products

| Product | Source | Resolution | Update |
|---|---|---|---|
| **GeoDanmark Ortofoto** | Aerial | 12.5 cm | Annual (spring) |
| **Forårsfoto** | Aerial | 12.5 cm | Leaf-off, annual |
| **Sommerfoto** | Aerial | 12.5 cm | Leaf-on, annual |
| **Sentinel-2** | Satellite | 10 m | Every 5 days |
| **Historical Orthophotos** | Archived aerial | Variable | 1944–present |

## Why Orthoimagery Matters

Orthophotos are the most intuitive geographic data — they show what the world *looks like*. They serve as:
- **Visual base map**: Context layer for all other data
- **Source for derived products**: Land cover classification, building detection, change analysis (liana to [[SPHERE/LandUseLandCover/index|LandUseLandCover]])
- **Change evidence**: Comparing multi-temporal images reveals urban growth, deforestation, coastal change

## Access

- **Dataforsyningen**: WMTS/WMS tile services for orthophotos
- **Kortforsyningen**: Historical orthophoto archive
- **Sentinel Hub / Copernicus**: Free satellite imagery""",
    },
    {
        "filename": "person-population.md",
        "title": "Population Distribution",
        "sphere": "Socio_Technical",
        "subsphere": "Socio_technical_socioeconomic",
        "collection": "Person",
        "concept": "Demographics",
        "question": "How is the population distributed and what are its characteristics?",
        "entities": ["person", "civilstand", "statsborgerskab"],
        "key_attributes": ["foedselsdato", "koen", "civilstand", "adresseringsnavn", "kommunekode"],
        "lianas": [],
        "classical_refs": [
            ("INSPIRE", "Population Distribution", "Classical Classifications/INSPIRE/population-distribution"),
            ("UN-GGIM", "Population Distribution", "Classical Classifications/UN-GGIM/population-distribution"),
            ("ISO 19115", "Society", "Classical Classifications/ISO 19115/society"),
        ],
        "body": """The [[Datasets by Collection/Grunddatamodellen/Person/index|Person register]] (CPR) records every person with legal residence in Denmark. Combined with address data from [[Leaves/dar-addresses|DAR Addresses]], it provides the foundation for population distribution analysis.

## Key Attributes

| Attribute | Description | Notes |
|---|---|---|
| `foedselsdato` | Date of birth | Age derivation |
| `koen` | Gender | M/F |
| `civilstand` | Marital status | Married, single, divorced, widowed |
| `kommunekode` | Municipality of residence | Links to [[Leaves/dagi-administrative-units|DAGI]] |

## Access Restrictions

Person data is **restricted** — individual-level data requires authorisation. Aggregated statistics at municipal/parish level are freely available through Statistics Denmark (DST).

## Spatial Population Analysis

Population distribution mapping requires joining Person data with address data:
1. Each person has a registered address → [[Leaves/dar-addresses|DAR]]
2. Addresses have coordinates → spatial placement
3. Aggregate to administrative units → [[Leaves/dagi-administrative-units|DAGI]]

## Access

- **Statistics Denmark**: Aggregated population tables by municipality, age, gender
- **GraphQL** (restricted): Individual records for authorised users
- **Research databases**: Anonymised microdata for approved research projects""",
    },
    {
        "filename": "geodk-transport.md",
        "title": "Transport Networks",
        "sphere": "Socio_Technical",
        "subsphere": "Socio_technical_infrastructure",
        "collection": "GeoDanmark",
        "concept": "Transport infrastructure",
        "question": "What transport routes and networks exist?",
        "entities": ["vejmidte", "jernbane", "sti", "faergerute", "lufthavn"],
        "key_attributes": ["vejklasse", "vejnavn", "hastighed", "belægning", "geometri"],
        "lianas": [],
        "classical_refs": [
            ("INSPIRE", "Transport Networks", "Classical Classifications/INSPIRE/transport-networks"),
            ("UN-GGIM", "Transport Networks", "Classical Classifications/UN-GGIM/transport-networks"),
            ("ISO 19115", "Transportation", "Classical Classifications/ISO 19115/transportation"),
        ],
        "body": """[[Datasets by Collection/Grunddatamodellen/GeoDanmark/index|GeoDanmark]] provides Denmark's authoritative transport network data — roads, railways, bicycle paths, footpaths, and ferry routes as vector geometries with rich attributes.

## Source Entities

| Entity | Role |
|---|---|
| **vejmidte** | Road centreline with class, name, speed |
| **jernbane** | Railway line segments |
| **sti** | Bicycle and pedestrian paths |
| **faergerute** | Ferry routes between islands |
| **lufthavn** | Airport locations |

## Key Attributes

| Attribute | Description | Notes |
|---|---|---|
| `vejklasse` | Road classification | Motorway, primary, secondary, local |
| `vejnavn` | Road name | Links to DAR road names |
| `hastighed` | Speed limit | km/h |
| `belægning` | Surface type | Asphalt, gravel, unpaved |

## Network Analysis

Transport data enables:
- **Routing and accessibility**: Travel time calculations, isochrone mapping
- **Network connectivity**: Which areas are well-connected vs isolated
- **Infrastructure planning**: Road condition, capacity analysis

## Access

- **GeoDanmark download**: Vector data in GML/GeoPackage format
- **WFS**: OGC Web Feature Service
- **Dataforsyningen**: Tile and vector services""",
    },
]



# ═══════════════════════════════════════════════════════════════════════════════
# GENERATION
# ═══════════════════════════════════════════════════════════════════════════════

def generate_twig_page(path_key, twig):
    """Generate a twig (subsphere) index.md page."""
    folder = SPHERE_BASE / path_key
    folder.mkdir(parents=True, exist_ok=True)
    filepath = folder / "index.md"
    
    if filepath.exists():
        print(f"  SKIP (exists): {filepath.relative_to(SPHERE_BASE)}")
        return False

    aliases_yaml = "\n".join(f"  - {a}" for a in twig["aliases"])
    
    content = f"""---
title: {twig['title']}
draft: false
tags:
  - twig
  - sphere/{twig['sphere_path'].lower().replace('_', '-')}
aliases:
{aliases_yaml}
---

{twig['content']}
"""
    filepath.write_text(content)
    print(f"  ✓ {filepath.relative_to(SPHERE_BASE)}")
    return True


def generate_leaf_page(leaf):
    """Generate a leaf page."""
    filepath = LEAVES_BASE / leaf["filename"]
    
    if filepath.exists():
        print(f"  SKIP (exists): {leaf['filename']}")
        return False

    entities_yaml = "\n".join(f"  - {e}" for e in leaf["entities"])
    attrs_yaml = "\n".join(f"  - {a}" for a in leaf["key_attributes"])
    lianas_yaml = "\n".join(f"  - {l}" for l in leaf["lianas"]) if leaf["lianas"] else ""
    lianas_field = f"\nlianas:\n{lianas_yaml}" if lianas_yaml else "\nlianas: []"

    # Classical references section
    classical_section = "\n## Classical Theme References\n\n| Standard | Theme | Link |\n|---|---|---|\n"
    for std, theme, path in leaf["classical_refs"]:
        classical_section += f"| {std} | {theme} | [[{path}\\|{theme}]] |\n"

    content = f"""---
title: {leaf['title']}
type: leaf
draft: false
sphere: {leaf['sphere']}
subsphere: {leaf['subsphere']}
collection: {leaf['collection']}
concept: {leaf['concept']}
question: "{leaf['question']}"
entities:
{entities_yaml}
key-attributes:
{attrs_yaml}{lianas_field}
tags:
  - leaf
  - sphere/{leaf['sphere'].lower().replace('_', '-')}
  - collection/{leaf['collection'].lower()}
---

# {leaf['title']}

**Question:** {leaf['question']}

{leaf['body']}
{classical_section}
## Temporal Model

Bitemporal (inherited from [[Datasets by Collection/Grunddatamodellen/Shared Temporal Superclass Contract|Shared Temporal Superclass Contract]]).
"""
    filepath.write_text(content)
    print(f"  ✓ {leaf['filename']}")
    return True


def update_classical_theme_pages():
    """Update all classical theme pages to link subsphere text to actual twig pages."""
    # Build subsphere → twig path mapping
    subsphere_to_path = {}
    for path_key, twig in TWIGS.items():
        subsphere_to_path[twig["subsphere_id"]] = f"SPHERE/{path_key}/index"
    # Also add existing twigs
    subsphere_to_path["Socio_technical_governance"] = "SPHERE/Socio_Technical/Governance/index"
    subsphere_to_path["Topography"] = "SPHERE/Toposphere/Topography/index"

    updated = 0
    for class_dir in CLASS_BASE.iterdir():
        if not class_dir.is_dir():
            continue
        for md_file in class_dir.glob("*.md"):
            if md_file.name == "index.md":
                continue
            text = md_file.read_text()
            new_text = text
            
            # Replace backtick subsphere references with wikilinks
            for subsphere_id, twig_path in subsphere_to_path.items():
                # Get a readable short title
                short_title = subsphere_id
                old_pattern = f"`{subsphere_id}`"
                new_pattern = f"[[{twig_path}|{subsphere_id}]]"
                if old_pattern in new_text:
                    new_text = new_text.replace(old_pattern, new_pattern)

            if new_text != text:
                md_file.write_text(new_text)
                updated += 1
    
    print(f"\n  Updated {updated} classical theme pages with twig links")


def main():
    print("═══ Generating Twig (Subsphere) Pages ═══\n")
    twig_count = 0
    for path_key, twig in TWIGS.items():
        if generate_twig_page(path_key, twig):
            twig_count += 1

    print(f"\n═══ Generating New Leaves ═══\n")
    leaf_count = 0
    for leaf in NEW_LEAVES:
        if generate_leaf_page(leaf):
            leaf_count += 1

    print(f"\n═══ Updating Classical Theme Pages ═══")
    update_classical_theme_pages()

    print(f"\n✅ Generated {twig_count} twig pages + {leaf_count} new leaves")
    print(f"   Total new files: {twig_count + leaf_count}")


if __name__ == "__main__":
    main()
