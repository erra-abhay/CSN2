# Build Prompt: csn2.me

> **How to use this document:** Copy everything below into Claude Code, Cursor, v0, or any AI coding agent as a single instruction. It is written in plain English on purpose — no code is included — so the agent has to make its own implementation decisions inside the constraints described. Everything here is intentionally specific about *look, feel, structure, and content* so the result feels like a finished, opinionated product rather than a generic template.

---

## 1. What this project is

Build a single polished marketing/landing website for a project called **csn2.me**.

csn2.me is a personal infrastructure experiment. The real purpose of the site is to be a live, public-facing showcase and stress-test subject for a zero-downtime, auto-scaling **blue-green deployment pipeline** running on Azure (the same kind of pipeline used for a real project called "acadhub"). In other words: this website is not just a brochure — it is itself the thing that gets deployed through the pipeline it describes. Every time a new version ships, it should roll across an Azure VM Scale Set fleet behind Traefik with no dropped traffic, and the site should be able to visually show that happening.

So the site needs to do two jobs at once:
1. Look and feel like a premium, confident, AI-product-style landing page (see "Visual inspiration" below).
2. Clearly explain, in plain language, how the deployment system works — using the actual mechanics described in section 6 ("How it works") — so a visitor understands the architecture in under a minute.

Treat this as a portfolio piece. It should feel like it belongs next to a Y Combinator-backed product launch, not like an internal devops wiki page.

## 2. Tech stack — be explicit about this

- **Next.js** (latest stable, App Router, TypeScript). This is non-negotiable — do not build this in plain HTML/CSS/JS or any other framework.
- **Tailwind CSS** for all styling. No CSS-in-JS, no separate stylesheet files beyond global resets/fonts.
- **Framer Motion** (or an equivalent lightweight animation library compatible with the App Router) for scroll reveals and micro-interactions.
- **shadcn/ui** as the base for buttons, cards, badges, and tabs — restyle the defaults to match the visual direction below rather than leaving the stock look.
- **lucide-react** for any icons (checkmarks, arrows, chevrons, terminal icon, etc.).
- Self-hosted variable font via `next/font` (see typography section) — no render-blocking Google Fonts `<link>` tags.
- No database and no real backend for the first version. All "live" content (deploy events, status cards, log lines) should come from a single typed mock-data file so it's trivial to swap in a real API or websocket feed later without touching any component markup.
- Structure the project so it builds cleanly with the Next.js "standalone" output mode and runs comfortably inside a single-stage or multi-stage Docker container — this site will eventually be pushed into a container registry and rolled out by the same blue-green pipeline it describes, so keep the Docker story simple and boring on purpose.

## 3. Visual inspiration — be specific about what to borrow

Four reference sites were used as mood board input. Do not copy any of them exactly, but explicitly borrow the *feeling* of each:

- **A claims-automation AI tool's homepage:** giant, confident two-line headline in heavy black type with one word picked out in a bright accent color; a calm one-sentence subheadline; a dark pill-shaped primary button next to a plain text/link secondary action; and — critically — a floating "live status" card peeking up from the bottom of the hero, partially cut off by the viewport edge, showing a little avatar/chat-bubble giving a real-time status update with a bolded number inside the sentence. This card is the single most important visual idea to borrow — csn2.me needs its own version of this, but showing deployment status instead of insurance claims.
- **An AI browser product's homepage:** a soft, dreamy gradient background (think pale sky-blue fading to white, with soft cloud shapes) sitting behind the hero copy, with a realistic "app window" mockup (rounded corners, traffic-light buttons, a sidebar, a chat thread) anchored below it. Borrow the gradient atmosphere and the "real product window" framing device, not the literal browser chrome.
- **The same product's "recent activity" grid:** three side-by-side cards, each with a small label ("Working for 46s", "an hour ago"), a bold one-line title, two or three muted status lines with small icons, and a preview thumbnail at the bottom of the card. Borrow this exact pattern for a "recent deploys" section.
- **A developer tool's homepage:** an enormous, edge-to-edge wordmark filling almost the entire viewport width near the bottom of the page, sitting just above a small, plain logo lockup and a row of simple footer links. Borrow this device directly for the csn2.me footer — the site name should physically dominate the bottom of the page the way that wordmark does.

The overall tone across all four references: lots of whitespace, restrained color (mostly black text on off-white, with exactly one accent color used sparingly), oversized confident typography, soft atmospheric backgrounds only in the hero, and small "proof" widgets that make the product feel alive and real rather than like static marketing copy.

## 4. Brand and design system

**Colors**
- Background: warm off-white, not pure white (something like a very light cream/paper tone).
- Primary text/ink: near-black, not pure `#000000` (a soft charcoal black reads more premium).
- Accent: a single confident electric blue, used only for: the one highlighted headline word, links, the "Promote/Live" status indicators, and hover states. Never use the accent for large filled backgrounds.
- Status colors: a calm green for "healthy/completed", amber for "in progress/scaling", red used sparingly and only for "rollback" states.
- Card surfaces: white or near-white with a faint border and a soft, large, low-opacity drop shadow rather than a hard line — cards should look like they're gently floating, not boxed in.

**Typography**
- Headings: a tight, modern grotesque/sans typeface with a bold-to-black weight available. Hero headline should be enormous on desktop (roughly 70–100px), tight letter-spacing, tight line-height so the two lines sit close together.
- Body copy: the same type family at a lighter weight, generous line-height, comfortable reading width (never let a paragraph stretch the full viewport — cap text blocks at a readable column width).
- Numbers and anything representing logs, version tags, or code (like "v128" or "production") should switch to a monospace font to visually signal "this is a real system value," even though the data is currently mocked.

**Shape and spacing**
- Buttons: fully pill-shaped (fully rounded ends). Primary buttons are solid ink-black with white text. Secondary/ghost buttons are plain text with an underline or arrow on hover, no border.
- Cards: large rounded corners (not sharp, not pill — a generous rounded-rectangle), soft shadow, comfortable internal padding.
- Section spacing: generous vertical breathing room between every section — err on the side of more whitespace than feels necessary.
- A consistent max content width should contain all text and cards; only background gradients/art are allowed to bleed full-width.

## 5. Site structure

For the first version, build this as **one long single-scroll homepage** (`/`). Do not split it into multiple routes yet — all the sections below live on one page, in this order. If it's useful for code organization, build each section as its own component, but the visitor should never click to a new URL except for the optional secondary pages.

Optionally stub two secondary pages that the nav links to, even if they're simple for now:
- `/architecture` — a deeper, more technical version of the architecture section, for visitors who want more detail.
- `/blog` — an empty/placeholder page with a "coming soon" message, just so the nav link isn't broken.

## 6. Section-by-section breakdown

### A. Navigation bar
- Sticky to the top of the viewport. Transparent over the hero gradient, then transitions to a solid/blurred off-white background once the visitor scrolls past the hero.
- Left: the wordmark "csn2" in bold, small, plain text — no logo icon needed.
- Center or right: three or four plain text nav links — "How it works", "Architecture", "Live deploys", "Blog".
- Far right: one solid black pill button labeled "Watch a live deploy" that scrolls/links down to the recent-deploys section.

### B. Hero section
- Sits on top of a soft, slow, barely-animated gradient backdrop (pale blue fading into the off-white background, with a few soft cloud-like blurred shapes — subtle, not cartoonish).
- Small pill-shaped eyebrow badge above the headline, something like: "An infrastructure experiment · Azure auto-scaling".
- Giant two-line headline. Use this exact structure and tone (feel free to offer 2–3 alternate headline options in the final build, but this is the primary one):
  - Line 1 in solid ink-black: "Ship to production."
  - Line 2, same size, with the last word in the accent blue and slightly heavier weight: "Never break it **again**."
- One-sentence subheadline beneath it, centered, in the lighter body weight, roughly this content: explain that csn2.me is a live testbed for a zero-downtime blue-green deployment pipeline — new images are promoted through a container registry, an auto-scaling fleet of virtual machines pulls the update, and traffic swaps over without a single dropped request. Close with a short, confident line like: "You push the image. The fleet rolls itself."
- Two calls to action side by side, centered: a solid black pill button "Watch a live deploy" and a plain text link with an arrow "Read the architecture →".
- Anchored near the bottom edge of the hero, partially overlapping into the next section (so it feels like it's "peeking up" the way the reference site's claim-status card does): a floating white card, rounded corners, soft shadow, containing:
  - A small header row: the project name and current state, e.g. "acadhub-api · production · rollout #4" with a small colored dot indicating healthy/live status.
  - A short line confirming the image was verified, with a green checkmark icon: "Image promoted — both tags verified."
  - Below that, a chat-bubble-style row with a tiny round avatar mark (just the letters "c2" or similar) next to a sentence that reads like a live status update, with key numbers bolded, e.g.: "New image promoted to production. 6 of 6 instances drained and recycled. Zero downtime." with a small blue text link beside it reading "View timeline".

### C. Recent deploys section (the "proof" grid)
- Section heading: "What's running right now" with a short one-line subhead like "Real events from the deployment pipeline, replayed here."
- A row of three cards side by side (stacking vertically on mobile). Each card follows this pattern:
  - A small muted label at the top showing elapsed/relative time, e.g. "Completed in 41s" or "2 hours ago", with a small status dot.
  - A bold one-line title describing the event, e.g. "Promote v128 → production".
  - Two or three short status lines underneath with small icons, e.g. "Image tag verified", "Instances draining", "Traffic swapped via Traefik".
  - A preview area at the bottom of the card styled like a small dark terminal/console window showing a few lines of mock deploy log output, to make the card feel technical and alive.
- Suggested three events to mock: (1) a normal promotion of a new version, (2) an auto-scale-out event triggered by a traffic spike, (3) a deliberate rollback drill showing how fast the system reverts.

### D. How it works section
- Section heading: "How a deploy actually happens" with a short subhead emphasizing that this is the real mechanism, not a simplification for marketing.
- Four numbered steps, laid out horizontally on desktop (a connected row with arrows or a connecting line) and stacked vertically on mobile. Each step gets a short, punchy title and one or two plain-English sentences:
  1. **Build & tag** — A new image is built and pushed into the container registry under a staging tag, separate from whatever is currently live.
  2. **Promote** — Once the staging image is verified, its tag is promoted to the stable "production" tag inside the registry. Nothing on the live fleet has changed yet — only the registry has been updated.
  3. **Roll the fleet** — The auto-scaling fleet of virtual machine instances continuously watches the production tag. A dedicated "deployment anchor" machine running a blue-green deploy script swaps live traffic over to the new version through a reverse proxy, instance by instance, with zero dropped requests.
  4. **Verify or roll back** — Health checks gate every swap. If something looks wrong, traffic is instantly reverted to the previous, known-good version — no manual intervention required.
- Each step should have a small, simple supporting diagram or icon (boxes and arrows are enough — this does not need to be literal screenshots of any real tooling).

### E. Architecture section
- A clean horizontal diagram showing the flow: container registry (with two tags, staging and production) → auto-scaling fleet of ephemeral instances → a deployment anchor machine running the blue-green proxy swap → end users.
- Small callouts or hover/tap tooltips on each diagram node giving one extra sentence of detail — for example, a note on how old instance versions get recycled over time, and a note on how rollback works after a promotion has already gone out.
- A small "What's next" side panel listing future evolution ideas as a short roadmap, each tagged with a small "Exploring" badge rather than presented as already built:
  - Running two full parallel environments (a true dual-fleet blue-green setup) instead of swapping within one fleet.
  - Native rolling and canary upgrades handled directly by the auto-scaling fleet itself, without the separate anchor machine.

### F. Confidence/stats strip (optional but recommended)
- A thin, full-width band with three or four large bold numbers and short labels underneath, e.g. "100% / zero-downtime deploys", "~40s / average promotion time", "0 / manual rollbacks needed". Clearly meant to read as live metrics even though they start as mock placeholders — make this easy to wire to real numbers later.

### G. Closing call-to-action section
- A second, smaller "hero moment" before the footer. Centered, bold but shorter than the main headline: "Built to be broken (safely)."
- One sentence inviting the visitor to trigger a mock deploy and watch it visually roll across the fleet in real time on the page.
- A single solid pill button: "Trigger a demo deploy."

### H. Footer — the big-wordmark moment
- First, a standard, restrained footer row: two or three short link columns (e.g. "Product": How it works / Architecture / Live deploys — "Project": About / Blog — keep this minimal, this is an experiment site, not a company).
- Then, the centerpiece: directly below that link row, render the site name **"csn2.me"** absolutely enormous — wide enough to nearly fill the full width of the viewport on desktop, in the heaviest available weight, solid ink-black, sitting on its own with nothing competing visually around it. This should feel like the single biggest piece of text on the entire page. On narrow/mobile screens, scale the size down fluidly so it never overflows or forces horizontal scrolling, but it should still feel oversized relative to everything else on the page.
- Beneath that, one small, quiet line of copyright/meta text, e.g. "© 2026 csn2 — an infrastructure experiment."

## 7. Motion and interaction

- As sections scroll into view, fade and slide them up slightly with a small stagger between child elements (headline, then subhead, then buttons, then card) — keep this fast and subtle, not bouncy.
- The hero's gradient/cloud background should drift very slowly and continuously — barely perceptible, never distracting.
- The "recent deploys" log lines and the floating hero status card should feel like they're updating live: have their text lines fade or type in one after another the first time they enter view, rather than appearing all at once.
- Buttons should compress slightly on press and lift slightly (shadow grows) on hover.
- Respect the user's reduced-motion preference — disable all decorative animation (but keep simple opacity fades) when that preference is set.

## 8. Responsiveness and accessibility

- Fully responsive from small phone widths up through large desktop monitors. The hero headline, the floating status card, the three-card grid, and the giant footer wordmark all need explicit mobile treatments — none of them should simply shrink the desktop layout, they should genuinely re-flow (cards stack, headline shrinks proportionally, footer wordmark scales fluidly).
- Maintain accessible color contrast everywhere, visible keyboard focus states on every interactive element, and proper semantic heading order (one H1 in the hero, logical H2s for each section).

## 9. Performance and SEO basics

- Use the Next.js metadata API to set a real page title and description, and define a simple Open Graph preview image.
- Self-host the chosen font through `next/font` rather than a third-party font CDN link.
- Add a basic `sitemap.xml` and `robots.txt`.
- The goal is a fast, clean Lighthouse score across performance, accessibility, and SEO — avoid any unnecessary heavy client-side libraries beyond what's listed in the tech stack.

## 10. Project file organization (plain-English description, not literal code)

Organize the project the normal Next.js App Router way: a top-level app folder containing the homepage and the two optional secondary pages; a components folder with one file per section (navigation bar, hero, status card, recent-deploys grid, how-it-works steps, architecture diagram, stats strip, closing call-to-action, footer); a small lib or data folder holding a single typed file that defines the mock deploy events and stats shown throughout the page, written so it's obvious how someone would later replace it with a real API call or websocket feed; and a styles folder for global resets and font setup. Keep the Dockerfile simple — a standard multi-stage Next.js production build that produces a small final image, since this exact image is what will eventually get pushed through the real promotion pipeline.

## 11. Final instruction to whoever builds this

Build the entire page as one cohesive, premium-feeling product, not a collection of disconnected sections. Every section should reinforce the same idea: this is a real, working, zero-downtime deployment system, shown through the lens of a confident, modern, slightly playful product landing page. The single most important visual beat to get right is the ending — the visitor should scroll all the way down and be greeted by the name **csn2.me** filling the bottom of their screen, the same way the reference site's giant wordmark dominates the close of its own homepage.
