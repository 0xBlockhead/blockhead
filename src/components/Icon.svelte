<script module lang="ts">
	// Types/constants
	export enum IconShape {
		Square = 'square',
		Circle = 'circle',
	}

	export type SubiconProps = {
		icon?: string
		html?: string
		src?: string
		alt?: string
		size?: number | string
		backgroundColor?: string
		shape?: IconShape
	}
</script>


<script lang="ts">
	// State
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'

	let {
		class: className,
		icon,
		html,
		src,
		alt = '',
		label,
		title = undefined,
		size = '1em',
		shape = IconShape.Square,
		backgroundColor,
		subicon,
		loading = 'lazy',
		decoding = 'async',
		fetchPriority = 'auto',
		referrerPolicy = 'no-referrer',
		...spanProps
	}: WithRest<
		{
			class?: string
			icon?: string
			html?: string
			src?: string
			alt?: string
			label?: string
			title?: string
			size?: number | string
			shape?: IconShape
			backgroundColor?: string
			subicon?: SubiconProps
			loading?: import('svelte/elements').SvelteHTMLElements['img']['loading']
			decoding?: import('svelte/elements').SvelteHTMLElements['img']['decoding']
			fetchPriority?: import('svelte/elements').SvelteHTMLElements['img']['fetchpriority']
			referrerPolicy?: import('svelte/elements').SvelteHTMLElements['img']['referrerpolicy']
		},
		SvelteHTMLElements['span']
	> = $props()

	const a11yLabel = $derived(
		label ?? alt
	)


	// Components
	import Icon from '$/components/Icon.svelte'
</script>


<span
	{...spanProps}
	class={`icon shape-${shape}${className ?
		` ${className}`
		: ''}`}
	data-row
	style={`--icon-size: ${typeof size === 'number' ?
		`${size}px`
		: size}${backgroundColor !== undefined ?
		`; --icon-bg: ${backgroundColor}`
		: ''}`}
	aria-label={a11yLabel || undefined}
	aria-hidden={a11yLabel ?
		undefined
		: true}
	title={title ?? (alt || undefined)}
	role={a11yLabel ?
		'img'
		: undefined}
>
	<span
		data-row
		class="icon-main"
	>
		{#if src}
			<img
				{src}
				{alt}
				width={typeof size === 'number' ? size : undefined}
				height={typeof size === 'number' ? size : undefined}
				{loading}
				{decoding}
				fetchpriority={fetchPriority}
				referrerpolicy={referrerPolicy}
			/>
		{:else if html}
			{@html html}
		{:else if icon}
			{icon}
		{/if}
	</span>

	{#if subicon}
		<Icon
			class="icon-subicon"
			src={subicon.src}
			alt={subicon.alt}
			size={subicon.size ?? '40%'}
			shape={subicon.shape ?? IconShape.Square}
			backgroundColor={subicon.backgroundColor}
		/>
	{/if}
</span>


<style>
	.icon {
		position: relative;
		width: var(--icon-size);
		height: var(--icon-size);
		line-height: 1;
		overflow: visible;
		background-color: var(--icon-bg, transparent);
		border-radius: inherit;

		&.shape-square {
			border-radius: 5%;
		}
		&.shape-circle {
			border-radius: 50%;
		}
	}

	.icon-main {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: inherit;

		> :global(img),
		> :global(svg) {
			width: 100%;
			height: 100%;
			object-fit: contain;
			border-radius: inherit;
		}
	}

	.icon-subicon {
		position: absolute;
		inset-block-end: 0;
		inset-inline-end: 0;
		translate: 25% 25%;
		z-index: 1;
	}
</style>
