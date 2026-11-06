# PharmaTrace 💊

> A QR-based medicine verification and traceability prototype selected among the **Top 30 teams at MUJ HackX 4.0**.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open-0A7C66?style=for-the-badge)](https://pharmatracer-universal.lovable.app/)
[![Recognition](https://img.shields.io/badge/MUJ_HackX_4.0-Top_30-7C3AED?style=for-the-badge)](https://lnkd.in/p/gfzPBrMn)
[![Source Code](https://img.shields.io/badge/GitHub-Source_Code-181717?style=for-the-badge&logo=github)](https://github.com/Leo-Varghese/pharmatrace)

## Recognition

PharmaTrace was selected among the **Top 30 teams at MUJ HackX 4.0**.

| Competition Details | Information |
|---|---|
| Hackathon | MUJ HackX 4.0 |
| Team Name | `muiwaleproteinlovers` |
| Team ID | `TEAM005` |
| Problem Statement | Counterfeit Medicine Prevention |
| Theme | Blockchain for Social Good |
| Result | Top 30 Teams |

- [View the MUJ HackX 4.0 recognition post](https://lnkd.in/p/gfzPBrMn)
- [Open the live prototype](https://pharmatracer-universal.lovable.app/)

## Overview

PharmaTrace is a hackathon prototype exploring how QR-based pack identities and digital supply-chain records could help consumers, pharmacies, manufacturers, and regulators identify suspicious medicines.

The application demonstrates a medicine-verification journey capable of representing:

- Genuine medicine packs
- Copied or duplicated serial numbers
- Expired products
- Recalled products
- Unknown serial numbers
- Missing or stolen inventory
- Pharmacy mismatches
- Products under investigation

PharmaTrace was rapidly developed for MUJ HackX 4.0 as a concept demonstration. The current prototype is not connected to a production pharmaceutical network, government registry, manufacturer database, or operational blockchain.

## Problem

Counterfeit and incorrectly traced medicines can create serious public-safety risks. Consumers and other supply-chain participants may have limited ability to determine:

- Whether a medicine-pack identifier exists in an authorised record
- Whether the medicine moved through the expected supply chain
- Whether the pack was sold through the recorded pharmacy
- Whether an identifier has already been used
- Whether a product is expired or recalled
- Whether a pack was reported missing, stolen, quarantined, or under review

## Proposed Solution

PharmaTrace assigns a digital record to each simulated medicine pack and demonstrates a QR-based verification workflow.

A verification request compares the scanned or entered identifier with prototype records and returns an understandable status, such as:

- Supply Chain Verified
- Suspicious
- Expired
- Recalled
- Missing
- Stolen
- Under Review
- Unable to Verify
- Package Unreadable
- Service Unavailable

The prototype focuses on making traceability information easier for consumers to understand while demonstrating possible manufacturer, pharmacy, and regulatory workflows.

## How It Works

```text
Manufacturer
    ↓
Batch Creation
    ↓
Pack Serial Generation
    ↓
Shipment Tracking
    ↓
Pharmacy Stock Verification
    ↓
Medicine Sale
    ↓
Consumer QR Verification
    ↓
Verification Engine
    ↓
Verification Result
```

## Key Features

### Medicine Verification

- QR-oriented medicine authentication flow
- Pack-serial validation
- Supply-chain timeline review
- Duplicate-serial and duplicate-sale scenarios
- Expiry and recall checks
- Pharmacy mismatch detection
- Missing and stolen inventory alerts

### Pharmacy Discovery

- Pharmacy discovery interface
- Map-oriented exploration
- Verification-status indicators
- Trust and risk indicators
- Suspicious-store warning scenarios

### Analytics Dashboard

- Verification activity overview
- Scan and status trends
- Counterfeit-risk monitoring concepts
- Audit-trail visibility
- Supply-chain status summaries

## Medicine Lifecycle

```text
MANUFACTURED
    ↓
IN_TRANSIT
    ↓
IN_STOCK
    ↓
SOLD
```

Additional supported prototype states include:

- `EXPIRED`
- `RECALLED`
- `MISSING`
- `STOLEN`
- `QUARANTINED`
- `UNDER_REVIEW`

## Verification Logic

The prototype verification flow can evaluate:

- Exact pack serial number
- Available supply-chain history
- Recorded selling pharmacy
- Duplicate-use indicators
- Recall status
- Expiry status
- Missing or stolen reports
- Store mismatch indicators
- Investigation status

## Demonstration Scenarios

PharmaTrace includes prototype scenarios for:

1. Genuine medicine pack
2. Copied serial number
3. Expired medicine
4. Recalled product
5. Unknown serial number
6. Missing inventory
7. Stolen product
8. Store mismatch
9. Product under investigation
10. Verification-service failure

## Stakeholders

### Manufacturers

- Create batches
- Generate pack serial numbers
- Record shipments
- Initiate recalls

### Pharmacies

- Receive shipments
- Verify stock
- Record medicine sales
- Report missing or stolen inventory

### Consumers

- Verify a medicine pack
- Review available traceability history
- Identify suspicious statuses

### Regulators

- Monitor compliance indicators
- Investigate counterfeit activity
- Track recalls and flagged products
- Review supply-chain events

## Proposed Blockchain Architecture

PharmaTrace was submitted under the **Blockchain for Social Good** theme.

A future production architecture could use a permissioned ledger to record selected supply-chain events, including:

- Batch creation
- Pack-serial registration
- Custody transfers
- Pharmacy receipt confirmation
- Product sale
- Recall notices
- Missing or stolen reports
- Regulatory-review events

This could provide tamper-evident audit records and stronger accountability between authorised participants.

> **Prototype limitation:** The current hackathon prototype demonstrates the intended workflow and verification experience. It does not operate a production blockchain network or write pharmaceutical events to an immutable ledger.

## Technology and Development Stack

### Application

- React
- TypeScript
- Tailwind CSS
- Responsive, mobile-first interface

### Development Platform

- Lovable for rapid frontend prototyping and workflow development

### Maps and Location

- Google Maps and Google Places concepts for pharmacy discovery
- Actual API availability depends on the configuration used by the deployed demonstration

### Current Prototype Scope

- Demonstration data and verification scenarios
- Simulated medicine lifecycle
- Simulated pharmacy and supply-chain records
- Consumer-facing verification experience
- Analytics and risk-monitoring interface

## Implementation Status

| Capability | Current Status |
|---|---|
| Responsive user interface | Implemented |
| Medicine-verification journey | Implemented as a prototype |
| Demonstration scenarios | Implemented with prototype data |
| Pharmacy discovery interface | Prototype |
| Supply-chain timeline | Simulated |
| Duplicate-serial detection | Demonstrated through prototype scenarios |
| Real camera-based QR scanning | Planned |
| Production pharmaceutical database | Not implemented |
| Live manufacturer integration | Not implemented |
| Government or regulator integration | Not implemented |
| Production blockchain ledger | Not implemented |
| AI fraud-detection model | Planned |

This table distinguishes the working demonstration from the proposed production architecture.

## Development Approach

PharmaTrace was rapidly prototyped using Lovable to validate the concept and demonstrate an end-to-end user journey within hackathon constraints.

The development process focused on:

- Problem framing
- User-flow design
- Interface generation
- Responsive frontend implementation
- Verification-scenario modelling
- Dashboard construction
- Rapid MVP delivery
- Hackathon presentation and demonstration

## Expected Impact

A mature implementation could help:

- Improve medicine traceability
- Strengthen recall management
- Increase supply-chain transparency
- Support counterfeit-risk investigation
- Improve consumer access to verification information
- Increase accountability among authorised supply-chain participants

These are expected outcomes of a future production system and were not independently measured by the current prototype.

## Future Scope

- Camera-based QR scanning
- Permissioned blockchain audit records
- Secure production database
- Manufacturer and pharmacy onboarding
- Government and regulator portals
- AI-assisted fraud-pattern detection
- Multi-language support
- Automated recall management
- National pharmacy-network integration
- Security, privacy, and compliance review

## Limitations

The current version is a hackathon prototype and does not include:

- A live pharmaceutical supply-chain network
- Production manufacturer or pharmacy data
- Government-registry integration
- An operational blockchain ledger
- Laboratory or chemical medicine verification
- Regulatory approval
- Independent security or clinical validation

The current demonstration should not be used to make real-world medicine safety decisions.

## Disclaimer

PharmaTrace is an educational hackathon prototype.

The application does not verify:

- Chemical composition
- Manufacturing quality
- Storage conditions
- Physical package integrity
- Clinical safety or effectiveness
- Whether a medicine is medically appropriate for a patient

Digital traceability can complement, but cannot replace, pharmaceutical quality controls, laboratory testing, licensed healthcare advice, manufacturer verification, and regulatory oversight.

A real implementation would require authorised data providers, pharmaceutical-industry participation, regulatory approval, security audits, privacy controls, operational governance, and extensive field validation.

## Project Links

- [Live PharmaTrace Demonstration](https://pharmatracer-universal.lovable.app/)
- [GitHub Repository](https://github.com/Leo-Varghese/pharmatrace)
- [MUJ HackX 4.0 Recognition Post](https://lnkd.in/p/gfzPBrMn)

## Author

**Leo Varghese**  
B.Tech Computer Science and Engineering  
Manipal University Jaipur

## Project Journey

PharmaTrace was an early hackathon prototype that helped develop experience in rapid product development, healthcare problem framing, workflow design, technical presentation, and building under time constraints.

The Top 30 selection at MUJ HackX 4.0 provided external validation for the concept and became an important step toward building more complete full-stack applications.

## Closing Note

**Track every medicine. Verify every scan. Protect every patient.**

---

If this project is useful, consider starring the repository and sharing constructive feedback.
