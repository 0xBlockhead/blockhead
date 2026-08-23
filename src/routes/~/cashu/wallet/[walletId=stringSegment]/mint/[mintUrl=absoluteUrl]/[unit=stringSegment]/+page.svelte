<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuWalletState, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.walletId || 'blockhead Cashu wallet state')} • blockhead Cashu wallet state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Cashu wallet state'} • blockhead Cashu wallet state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuWalletState, data.selector)}

	<BlockheadCashuWalletStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
