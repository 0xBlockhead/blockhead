<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
			'/~/manage/source/[sourceId=stringSegment]/(blockheadSource)/endpoint/[bindingId=stringSegment]/[endpointIndex=nonNegativeInteger]',
			{
				sourceId: params.sourceId,
				bindingId: params.bindingId,
				endpointIndex: params.endpointIndex,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadSourceEndpointView from '$/views/BlockheadSourceEndpointView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			<BlockheadSourceEndpointView
				selection={
					select(EntityType.BlockheadSourceEndpoint, data.selector, {
						sources: [
							Source.Constants_Internal,
							Source.Local_Internal,
						],
					})
				}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
