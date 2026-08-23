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
	import BlockheadMoneroOutputStateView from '$/views/BlockheadMoneroOutputStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadMoneroOutputState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.MoneroWalletRpc_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.txHash || 'blockhead monero output state')} • blockhead monero output state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead monero output state'} • blockhead monero output state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadMoneroOutputState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.MoneroWalletRpc_JsonRpc,
					],
				}))}

		<BlockheadMoneroOutputStateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
