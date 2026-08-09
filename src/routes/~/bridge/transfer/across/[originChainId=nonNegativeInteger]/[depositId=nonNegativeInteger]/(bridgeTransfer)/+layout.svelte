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
			'/~/bridge/transfer/across/[originChainId=nonNegativeInteger]/[depositId=nonNegativeInteger]',
			{
				originChainId: params.originChainId,
				depositId: params.depositId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<BridgeTransferView
			selection={
				select(EntityType.BridgeTransfer, data.selector, {
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
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
