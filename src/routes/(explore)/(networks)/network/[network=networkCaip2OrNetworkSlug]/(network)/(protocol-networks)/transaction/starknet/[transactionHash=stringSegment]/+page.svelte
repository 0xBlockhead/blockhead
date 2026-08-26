<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StarknetTransaction, data.selector, {
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
			Source.Starkscan,
			Source.Voyager,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetTransactionView from '$/views/StarknetTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.transactionHash || 'starknet transaction')} • starknet transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet transaction'} • starknet transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StarknetTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
