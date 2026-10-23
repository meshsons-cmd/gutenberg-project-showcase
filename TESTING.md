# Manual acceptance checklist

Run this in a disposable local WordPress site before submitting the sample. Record actual results and version numbers; this checklist is not a claim that these checks have passed.

Environment: WordPress ___ / PHP ___ / Theme ___ / Browser ___ / Date ___

- [ ] Plugin activates without a PHP warning or fatal error.
- [ ] Project Showcase is searchable in the inserter and appears with three sample cards.
- [ ] Heading and introduction update from the sidebar.
- [ ] Every card field updates without changing another card.
- [ ] Add, remove and move cards; first/last move buttons are correctly disabled.
- [ ] Six-card maximum is enforced. Delete all cards, then add a new one.
- [ ] Desktop column settings 1, 2 and 3 render correctly.
- [ ] Hide/show technologies and confirm visibility on the published page.
- [ ] Save, reload the editor and confirm all values and order persist.
- [ ] Duplicate the block; changing the copy does not change the original.
- [ ] Test two block instances on one page.
- [ ] Test align-wide and align-full in a supporting theme.
- [ ] Test 375px, 768px and 1280px frontend widths; long titles and URLs do not overflow.
- [ ] Navigate editor controls and frontend links using only the keyboard.
- [ ] Check headings and project-specific link names with a screen reader.
- [ ] Enter `<script>alert(1)</script>` in a title: it displays as text, never executes.
- [ ] `javascript:` and relative URLs produce no frontend link; HTTPS links work.
- [ ] Blank title uses a fallback; blank URL omits the link.
- [ ] Run `wp eval-file .../tests/render-smoke.php` and record its output.
- [ ] Confirm no browser console errors or PHP debug-log warnings.
- [ ] Capture editor, desktop and mobile screenshots with real example content.

Known limits: no images, no rich HTML descriptions, no custom project post type, no frontend filtering, and no static fallback if the plugin is disabled.
