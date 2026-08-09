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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/service-provider/[providerId=stringSegment]/(zeroGServiceProvider)/request/[requestId=stringSegment]',
			{
				network: params.network,
				providerId: params.providerId,
				requestId: params.requestId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ZeroGServiceRequestView from '$/views/ZeroGServiceRequestView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<ZeroGServiceRequestView
			selection={
				select(EntityType.ZeroGServiceRequest, data.selector, {
					sources: [
						Source.ZeroGChain_JsonRpc,
						Source.ZeroGStorageNode_JsonRpc,
						Source.ZeroGStorageScan_Rest,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
