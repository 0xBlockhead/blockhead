<script lang="ts">
	// Types/constants
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'


	// State
	let {
		value,
		resource,
		currency = 'USD',
		scale = 1e8,
		showDecimalPlaces = 2,
		useGrouping = true,
		compactLargeValues = false,
		locale,
		tween = false,
		tweenDuration = 1000,
	}: {
		value?: number | bigint
		resource?: SvelteKitResource<number | bigint | undefined>
		currency?: string
		scale?: number
		showDecimalPlaces?: number
		useGrouping?: boolean
		compactLargeValues?: boolean
		locale?: string | string[]
		tween?: boolean
		tweenDuration?: number
	} = $props()


// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


{#if resource !== undefined}
	<ResourceBoundary
		{resource}
		placeholderText="Loading amount…"
	>
		{#snippet children(value)}
			{#if value !== undefined}
				<NumberValue
					value={Number(value) / scale}
					formatValueOptions={{
						currency,
						showDecimalPlaces,
						useGrouping,
						compactLargeValues,
						locale,
					}}
					{tween}
					{tweenDuration}
				/>
			{/if}
		{/snippet}
	</ResourceBoundary>
{:else if value !== undefined}
	<NumberValue
		value={Number(value) / scale}
		formatValueOptions={{
			currency,
			showDecimalPlaces,
			useGrouping,
			compactLargeValues,
			locale,
		}}
		{tween}
		{tweenDuration}
	/>
{/if}
