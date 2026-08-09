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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/node-state',
			{
				network: params.network,
				connectionId: params.connectionId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadQuilibriumNodeStateView from '$/views/BlockheadQuilibriumNodeStateView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<BlockheadQuilibriumNodeStateView
			selection={
				select(EntityType.BlockheadQuilibriumNodeState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.QuilibriumNodeMetrics_Prometheus,
						Source.QuilibriumNode_Grpc,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
