<script lang="ts">
	// State
	let {
		icon,
		src,
		alt = '',
		label,
		size = '1em',
	}: {
		icon?: string
		src?: string
		alt?: string
		label?: string
		size?: number | string
	} = $props()

	const a11yLabel = $derived(
		label ?? alt
	)
</script>


<span
	class="icon"
	data-row="center"
	style={`--icon-size: ${typeof size === 'number' ? `${size}px` : size}`}
	aria-label={a11yLabel || undefined}
	aria-hidden={a11yLabel ? undefined : true}
	title={alt || undefined}
	role={a11yLabel ? 'img' : undefined}
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
	{:else if icon}
		{icon}
	{/if}
</span>


<style>
	.icon {
		width: var(--icon-size);
		height: var(--icon-size);
		line-height: 1;
		overflow: hidden;
		border-radius: 15%;

		> img {
			width: 100%;
			height: 100%;
			object-fit: contain;
			border-radius: inherit;
		}
	}
</style>
