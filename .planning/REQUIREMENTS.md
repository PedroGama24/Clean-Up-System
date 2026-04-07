# Requirements: Sistema CleanUp

**Defined:** 2026-04-07  
**Core Value:** Authenticated staff can reliably see every CTO’s occupancy and last clean-up, and save a full port-level audit in one flow—with `vagas_atuais` and `ultimo_cleanup` kept accurate automatically.

## v1 Requirements

### Authentication & Authorization

- [ ] **AUTH-01**: User can sign up with email and password (Supabase Auth)
- [ ] **AUTH-02**: New accounts remain unable to access app data until an Admin marks them approved
- [ ] **AUTH-03**: User can sign in and maintain a session across refresh (Supabase session)
- [ ] **AUTH-04**: Unauthenticated users are redirected away from protected pages
- [ ] **AUTH-05**: Role is modeled as Admin or Backoffice; Admin can perform approval (via app or documented Supabase workflow for v1 minimum)

### CTO Registry & Search

- [ ] **CTO-01**: User can list all CTOs with `nome_cto`, `ultimo_cleanup`, and `vagas_atuais`
- [ ] **CTO-02**: User can filter/search the list by `nome_cto`

### CTO Create / Edit & Ports

- [ ] **CTO-03**: User can create a CTO with metadata: `nome_cto` (unique), `area`, `olt`, `slot`, `pon`, `capacidade` (8 or 16), `potencia_dbm`
- [ ] **CTO-04**: When `capacidade` is chosen, the form shows exactly 8 or 16 port rows
- [ ] **CTO-05**: Each port row supports status via quick selection (radio or badges): “Conectado com Contrato”, “Conectado sem Contrato”, “Livre”
- [ ] **CTO-06**: “Conectado com Contrato” requires a non-empty `contrato` value before save
- [ ] **CTO-07**: UI shows a clear warning styling for “Conectado sem Contrato” and positive/free styling for “Livre”
- [ ] **CTO-08**: On save, system persists all port rows for the CTO and updates `vagas_atuais` to the count of ports with status “Livre”
- [ ] **CTO-09**: On save, system sets `ultimo_cleanup` to the current timestamp on the parent CTO

### Platform & Security

- [ ] **PLAT-01**: PostgreSQL schema matches agreed tables/columns with integrity checks (capacity, port range, status enum)
- [ ] **PLAT-02**: Row Level Security ensures only authenticated, approved users can read/write CTO and port data
- [ ] **PLAT-03**: App is responsive and usable on typical desktop/tablet viewports

## v2 Requirements

### Operations

- **OPS-01**: Email verification and password reset flows polished in-product  
- **OPS-02**: Audit log of who changed which CTO/port and when  
- **OPS-03**: Bulk import/export of CTOs  

### UX

- **UX-01**: Keyboard shortcuts / batch edit for port statuses  

## Out of Scope

| Feature | Reason |
|---------|--------|
| Customer-facing portal | Internal backoffice only |
| Field technician mobile offline mode | Web-only v1 |
| Multi-tenant separate orgs | Single org implied |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| CTO-01 | Phase 3 | Pending |
| CTO-02 | Phase 3 | Pending |
| CTO-03 | Phase 4 | Pending |
| CTO-04 | Phase 4 | Pending |
| CTO-05 | Phase 4 | Pending |
| CTO-06 | Phase 4 | Pending |
| CTO-07 | Phase 4 | Pending |
| CTO-08 | Phase 4 | Pending |
| CTO-09 | Phase 4 | Pending |
| PLAT-01 | Phase 1 | Pending |
| PLAT-02 | Phase 1 | Pending |
| PLAT-03 | Phase 2 | Pending |

**Coverage:**  
- v1 requirements: 17 total  
- Mapped to phases: 17  
- Unmapped: 0 ✓  

---
*Requirements defined: 2026-04-07*  
*Last updated: 2026-04-07 after initial definition*
