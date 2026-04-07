# Features Research — CTO clean-up backoffice

## Table stakes

- Sign-in; no anonymous access to registry data
- Role separation (Admin vs Backoffice) with gate for new users
- Searchable CTO list with occupancy summary
- Port-level audit with enforced status rules

## Differentiators (for this product)

- Dynamic 8/16 port grid tied to capacity
- Automatic `vagas_atuais` + `ultimo_cleanup` on save

## Anti-features / defer

- Public signup without approval
- Complex workflow engines for v1
