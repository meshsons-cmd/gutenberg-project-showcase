# Project Showcase — a custom Gutenberg block

A WordPress plugin by Umesh Jangir that lets editors build a responsive project portfolio without editing HTML. This is a new portfolio exercise, not a past client delivery. The initial implementation and documentation were prepared with AI assistance; review, run and adapt the code before presenting it as a work sample.

## The task

Build an editor-friendly portfolio section with a heading, introduction and up to six project cards. Each card needs a title, description, technologies and an optional public project link. Editors should be able to reorder cards, choose desktop columns and hide technology tags. The published page should render semantic, escaped HTML and adapt to smaller screens.

## Features

- React-based editor UI using WordPress's bundled components.
- Immutable card updates; add, remove and move cards up or down.
- Sidebar controls for section content, columns and technology visibility.
- Server-rendered cards with context-appropriate escaping, safe HTTP(S) links and defensive handling of malformed project data.
- Responsive grid: up to three desktop columns, up to two tablet columns and one mobile column.
- Visible keyboard focus, descriptive link names and labelled editor controls.
- Shared editor/frontend styling; no frontend JavaScript or third-party runtime dependencies.
- Plain JavaScript with `createElement`: installable without npm or a compilation step.

Sample card descriptions are prompts for real content, not claims of completed projects.

## Install and try it

Requirements: WordPress 6.3 or newer and PHP 7.4 or newer. These are declared compatibility targets; a full version compatibility matrix has not been run.

1. Place this folder at `wp-content/plugins/umesh-project-showcase/`, or ZIP the folder and upload it via Plugins → Add New → Upload Plugin.
2. Activate **Umesh Project Showcase**.
3. Open a post or page in the block editor. Insert **Project Showcase**.
4. Select the block to open its sidebar controls. Edit the cards in the canvas.
5. Add real project details and full `https://` links, then save and preview the page.
6. Reload the editor and confirm your settings persist.

The supplied ZIP can be installed directly. GitHub's automatically generated ZIP may add a repository suffix to the folder name; that is harmless for activation, but the WP-CLI paths below assume the canonical folder name.

## Run checks

No npm install is necessary. With Node.js 18 or newer:

```sh
node --check block/editor.js
node --test tests/model.test.cjs
```

With PHP installed:

```sh
php -l umesh-project-showcase.php
php -l block/editor.asset.php
php -l block/render.php
php -l tests/render-smoke.php
```

With an active plugin in a local WordPress site and WP-CLI installed:

```sh
wp eval-file wp-content/plugins/umesh-project-showcase/tests/render-smoke.php
```

The render smoke test uses real WordPress functions to check HTML escaping, rejected URL schemes, project limits, hidden tags, malformed entries and empty states. It is not a substitute for editor/browser testing. GitHub Actions runs JavaScript tests and PHP syntax checks; it does not provision WordPress or run the rendering checks automatically.

### Verification status for this initial package

- JavaScript syntax check: passed.
- Ten Node tests for the actual editor model and metadata: passed.
- PHP syntax, WordPress rendering, visual appearance and editor integration: not yet verified in a running WordPress site. The preparation environment has neither PHP nor WordPress installed.

Before submitting, complete [the manual acceptance checklist](TESTING.md), run the PHP and WordPress checks, and replace this status with the actual WordPress/PHP/browser versions and results. Add desktop, mobile and editor screenshots from your own test site to the repository.

## Architecture and tradeoffs

| File | Responsibility |
| --- | --- |
| `umesh-project-showcase.php` | Registers the block on WordPress `init` |
| `block/block.json` | Metadata, attribute defaults, assets and rendering entry point |
| `block/editor.js` | React editor UI and immutable model helpers |
| `block/editor.asset.php` | Explicit WordPress script dependencies |
| `block/render.php` | Dynamic PHP rendering and output escaping |
| `block/style.css` | Shared responsive presentation |
| `block/editor.css` | Editor-only controls and spacing |
| `tests/` | Model tests and a WordPress rendering smoke test |

The block stores its attributes in the post's block comment. `save()` returns `null`; PHP generates the current frontend markup. This allows markup fixes without resaving every post. The tradeoff is that the frontend portfolio content is not retained as fallback HTML if the plugin is deactivated.

`block.json` is the metadata source. WordPress supplies its registered attribute schema to the editor; the JavaScript registration adds the editing behavior. The `.asset.php` file declares the bundled WordPress dependencies so React is not shipped a second time.

A nested array is intentionally used for a small, fixed-schema set of cards. A larger block system could instead use `InnerBlocks` and a dedicated project-card child block. Plain JavaScript avoids build setup for this small exercise; a larger production codebase would benefit from `@wordpress/scripts`, source modules and stricter linting.

No custom REST endpoint or database table is needed. WordPress handles saving permissions. Output values are escaped at rendering time. External links open in the same tab; only absolute HTTP(S) URLs are rendered. Tags are limited to eight per card and projects to six. Descriptions are plain text; HTML formatting is intentionally unsupported.

## Explain it in an interview

After you have run and understood it, discuss these decisions in your own words:

- Why use dynamic rendering instead of storing frontend HTML in `save()`?
- How do immutable array updates help React and Gutenberg detect changes?
- Why does escaping depend on whether a value is text, a URL or an HTML attribute?
- What does metadata registration give both the PHP and JavaScript sides?
- Where do unit tests stop, and which failures require a real WordPress integration test?
- How would you extend this to images, `InnerBlocks` or reusable project records?

Suggested next contribution: add a media-picker image field with meaningful alt text, keyboard-test it and commit that change separately. A small change you can explain is more useful than a large sample you have not reviewed.

## Publish the repository

Create an empty public repository named `gutenberg-project-showcase`. From this project's root folder:

```sh
git init
git add .
git commit -m "Add dynamic Gutenberg project showcase block"
git branch -M main
git remote add origin https://github.com/meshsons-cmd/gutenberg-project-showcase.git
git push -u origin main
```

Replace the remote URL if your GitHub username or repository name differs. Confirm the code checks succeed. Share the repository URL only after publishing and testing; the URL above is a suggested destination, not an existing repository verified by this package.

Suggested repository description: **Custom Gutenberg portfolio block with React editor controls, dynamic PHP rendering, responsive CSS and automated model tests.**

## References

- [WordPress block metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
- [Registering a single block](https://developer.wordpress.org/block-editor/getting-started/fundamentals/registration-of-a-block/)
- [Dynamic blocks](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/creating-dynamic-blocks/)

## License

GPL-2.0-or-later. See LICENSE.
