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
			'/~/monero/wallet/[walletId=stringSegment]/transfer-state/[txHash=stringSegment]/[transferIndex=nonNegativeInteger]',
			{
				walletId: params.walletId,
				txHash: params.txHash,
				transferIndex: params.transferIndex,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadMoneroTransferStateView from '$/views/BlockheadMoneroTransferStateView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<BlockheadMoneroTransferStateView
			selection={
				select(EntityType.BlockheadMoneroTransferState, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
