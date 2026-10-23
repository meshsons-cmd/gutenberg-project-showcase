/* global wp */
(function () {
    'use strict';

    // Pure immutable helpers are shared by the editor and the Node unit tests.
    const MAX_PROJECTS = 6;
    const blankProject = () => ({ title: '', description: '', tags: '', url: '' });
    const list = (projects) => Array.isArray(projects) ? projects.slice(0, MAX_PROJECTS) : [];
    const update = (projects, index, patch) => list(projects).map((item, i) =>
        i === index ? Object.assign({}, item, patch) : item);
    const add = (projects) => list(projects).length < MAX_PROJECTS
        ? list(projects).concat([blankProject()]) : list(projects);
    const remove = (projects, index) => list(projects).filter((item, i) => i !== index);
    const move = (projects, index, direction) => {
        const result = list(projects);
        const target = index + direction;
        if (![-1, 1].includes(direction) || index < 0 || index >= result.length || target < 0 || target >= result.length) return result;
        [result[index], result[target]] = [result[target], result[index]];
        return result;
    };
    const columns = (value) => Math.max(1, Math.min(3, Math.round(Number(value) || 1)));
    const tags = (value) => typeof value === 'string'
        ? value.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 8) : [];
    const model = { MAX_PROJECTS, list, update, add, remove, move, columns, tags };
    if (typeof module !== 'undefined' && module.exports) module.exports = model;
    if (typeof wp === 'undefined') return;

    const el = wp.element.createElement;
    const { __, sprintf } = wp.i18n;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl, RangeControl, ToggleControl, Button, Notice } = wp.components;
    const domain = 'umesh-project-showcase';

    function Edit({ attributes, setAttributes }) {
        const projects = model.list(attributes.projects);
        const patch = (index, value) => setAttributes({ projects: model.update(projects, index, value) });
        const props = useBlockProps({ className: 'uj-showcase', style: { '--uj-columns': model.columns(attributes.columns) } });

        return el(wp.element.Fragment, null,
            el(InspectorControls, null,
                el(PanelBody, { title: __('Layout and content', domain), initialOpen: true },
                    el(TextControl, { label: __('Section heading', domain), value: attributes.heading, onChange: (heading) => setAttributes({ heading }) }),
                    el(TextareaControl, { label: __('Introduction', domain), value: attributes.intro, onChange: (intro) => setAttributes({ intro }) }),
                    el(RangeControl, { label: __('Desktop columns', domain), min: 1, max: 3, value: model.columns(attributes.columns), onChange: (value) => setAttributes({ columns: model.columns(value) }) }),
                    el(ToggleControl, { label: __('Show technology tags', domain), checked: attributes.showTags, onChange: (showTags) => setAttributes({ showTags }) }),
                    el('p', null, __('Edit cards directly in the canvas. Cards stack automatically on smaller screens. Up to six projects are supported.', domain))
                )
            ),
            el('section', props,
                el('header', { className: 'uj-showcase__header' },
                    el('p', { className: 'uj-showcase__eyebrow' }, __('PROJECT PORTFOLIO', domain)),
                    attributes.heading && el('h2', null, attributes.heading),
                    attributes.intro && el('p', { className: 'uj-showcase__intro' }, attributes.intro)
                ),
                projects.length === 0 && el(Notice, { status: 'info', isDismissible: false }, __('Add a project to get started.', domain)),
                el('div', { className: 'uj-showcase__grid' }, projects.map((project, index) => {
                    const item = Object.assign(blankProject(), project && typeof project === 'object' ? project : {});
                    return el('article', { className: 'uj-showcase__card', key: index },
                        el('span', { className: 'uj-showcase__number', 'aria-hidden': true }, String(index + 1).padStart(2, '0')),
                        el(TextControl, { label: sprintf(__('Project %d title', domain), index + 1), value: item.title, onChange: (title) => patch(index, { title }) }),
                        el(TextareaControl, { label: __('Description', domain), value: item.description, onChange: (description) => patch(index, { description }) }),
                        el(TextControl, { label: __('Technologies (comma separated)', domain), value: item.tags, onChange: (value) => patch(index, { tags: value }) }),
                        attributes.showTags && el('ul', { className: 'uj-showcase__tags', 'aria-label': __('Technologies', domain) }, model.tags(item.tags).map((tag, i) => el('li', { key: i }, tag))),
                        el(TextControl, { type: 'url', label: __('Project URL (optional, https://…)', domain), value: item.url, onChange: (url) => patch(index, { url }) }),
                        el('div', { className: 'uj-showcase__actions' },
                            el(Button, { variant: 'secondary', disabled: index === 0, 'aria-label': sprintf(__('Move project %d up', domain), index + 1), onClick: () => setAttributes({ projects: model.move(projects, index, -1) }) }, __('Up', domain)),
                            el(Button, { variant: 'secondary', disabled: index === projects.length - 1, 'aria-label': sprintf(__('Move project %d down', domain), index + 1), onClick: () => setAttributes({ projects: model.move(projects, index, 1) }) }, __('Down', domain)),
                            el(Button, { isDestructive: true, variant: 'tertiary', 'aria-label': sprintf(__('Remove project %d', domain), index + 1), onClick: () => setAttributes({ projects: model.remove(projects, index) }) }, __('Remove', domain))
                        )
                    );
                })),
                el(Button, { variant: 'primary', className: 'uj-showcase__add', disabled: projects.length >= MAX_PROJECTS, onClick: () => setAttributes({ projects: model.add(projects) }) }, __('Add project', domain)),
                projects.length >= MAX_PROJECTS && el('p', { role: 'status' }, __('Six-project limit reached.', domain))
            )
        );
    }

    wp.blocks.registerBlockType('umesh/project-showcase', { edit: Edit, save: () => null });
}());
