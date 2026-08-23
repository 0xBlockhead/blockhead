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
	import BlockheadMoneroWalletStateView from '$/views/BlockheadMoneroWalletStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadMoneroWalletState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.MoneroWalletRpc_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.walletId || 'blockhead monero wallet state')} • blockhead monero wallet state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead monero wallet state'} • blockhead monero wallet state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadMoneroWalletState, data.selector, {
				sources: [
					Source.Local_Internal,
					Source.MoneroWalletRpc_JsonRpc,
				],
			})}

	<BlockheadMoneroWalletStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
