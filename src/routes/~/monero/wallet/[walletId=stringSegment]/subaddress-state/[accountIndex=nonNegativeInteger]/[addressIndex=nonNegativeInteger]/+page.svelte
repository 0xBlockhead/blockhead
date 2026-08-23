<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroSubaddressStateView from '$/views/BlockheadMoneroSubaddressStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadMoneroSubaddressState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.MoneroWalletRpc_JsonRpc,
					],
					fields: {
						address: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.walletId ?? '') || 'blockhead monero subaddress state' : (pageSelection.entity.address ?? '') || pageSelection.entitySelector.walletId || 'blockhead monero subaddress state')} • blockhead monero subaddress state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead monero subaddress state'} • blockhead monero subaddress state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadMoneroSubaddressState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.MoneroWalletRpc_JsonRpc,
					],
					fields: {
						address: true,
					},
				}))}

		<BlockheadMoneroSubaddressStateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
