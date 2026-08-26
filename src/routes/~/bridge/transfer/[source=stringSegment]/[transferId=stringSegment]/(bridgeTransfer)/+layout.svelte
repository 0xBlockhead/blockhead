<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/~/bridge/transfer/[source=stringSegment]/[transferId=stringSegment]',
			{
				source: params.source,
				transferId: params.transferId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.BridgeTransfer, data.selector, {
		sources: [
			Source.Across_Rest,
			Source.Allium_Rest,
			Source.Axelarscan_Rest,
			Source.Dune_Rest,
			Source.LayerZeroScan_Rest,
			Source.Lifi_Rest,
			Source.Voltaire_JsonRpc,
			Source.Wormholescan,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<BridgeTransferView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
