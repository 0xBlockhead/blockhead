<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(avalanche)/avalanche/validator/[nodeId=stringSegment]/[subnetId=stringSegment]/[startTimeMs=nonNegativeInteger]',
			{
				nodeId: params.nodeId,
				subnetId: params.subnetId,
				startTimeMs: params.startTimeMs,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.AvalancheValidator, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import AvalancheValidatorView from '$/views/AvalancheValidatorView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<AvalancheValidatorView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
