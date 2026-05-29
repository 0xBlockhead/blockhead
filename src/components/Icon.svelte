<script module lang="ts">
	// Types/constants
	export enum IconShape {
		Square = 'square',
		Circle = 'circle',
	}

	export type SubiconProps = {
		src: string
		shape?: IconShape
	}
</script>


<script lang="ts">
	// State
	let {
		icon,
		html,
		src,
		alt = '',
		label,
		title = undefined,
		size = '1em',
		shape = IconShape.Square,
		subicon,
	}: {
		icon?: string
		html?: string
		src?: string
		alt?: string
		label?: string
		title?: string
		size?: number | string
		shape?: IconShape
		subicon?: SubiconProps
	} = $props()


	const a11yLabel = $derived(
		label ?? alt
	)
</script>


<span
	class="icon shape-{shape}"
	data-row="center"
	style={`--icon-size: ${typeof size === 'number' ?
		`${size}px`
		: size}`}
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
				width={typeof size === 'number' ? size : 20}
				height={typeof size === 'number' ? size : 20}
				loading="lazy"
				decoding="async"
				referrerpolicy="no-referrer"
			/>
		{:else if html}
			{@html html}
		{:else if icon}
			{icon}
		{/if}
	</span>

	{#if subicon}
		<span
			class="icon icon-subicon shape-{subicon.shape ?? IconShape.Square}"
			data-row="center"
			style="--icon-size: 40%;"
			aria-hidden="true"
		>
			<span
				data-row
				class="icon-main"
			>
				<img
					src={subicon.src}
					alt=""
					width={20}
					height={20}
					loading="lazy"
					decoding="async"
					referrerpolicy="no-referrer"
				/>
			</span>
		</span>
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
			border-radius: 15%;
		}
		&.shape-circle {
			border-radius: 50%;
		}
	}

	.icon-main {
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
