<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroTransferStateView from '$/views/BlockheadMoneroTransferStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadMoneroTransferState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.MoneroWalletRpc_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.txHash || 'blockhead monero transfer state')} • blockhead monero transfer state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead monero transfer state'} • blockhead monero transfer state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadMoneroTransferState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.MoneroWalletRpc_JsonRpc,
				],
			})}

	<BlockheadMoneroTransferStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
