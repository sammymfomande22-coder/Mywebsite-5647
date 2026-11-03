# Paws & Pools — Design system
Adaptation approved: a pet and pool specialist store with pool-cleaning services. Placeholder brand Paws & Pools, dollar-denominated illustrative pricing, no specified service region.

## Visual language
Maintain editorial structure and typography of original reference. Warm white canvas, dark teal ink #173e47, pool-blue accent #168caa, pale aqua #eef8f8; small coral accents for pet playfulness. Poppins throughout. Branded paw mark, dog-by-the-pool hero photography, floating product/service cards, six category cards, live deal countdown and quick-add bestseller strip. Dedicated deep-teal service feature, three service options, and quote-request modal.

## Architecture and flows
Existing managed web app only. Catalog in lib/catalog.ts now uses pet/pool products with isolated product photos, IDs 101+ and separate paws-pools local storage keys. Category/group browsing for pets/pools; pool-cleaning category scrolls to services. Cart, wishlist, product modal remain. Services component and QuoteForm in components/pool-services.tsx. Form collects contact, postcode, service and pool preferences; submission shows a local demo confirmation explicitly stating nothing sent/no confirmed booking. No API/database or real payments. Region/prices/policies remain illustrative. Mobile stacked hero, category scroller, two-column products, stacked services, accessible modal and full-width drawer.
