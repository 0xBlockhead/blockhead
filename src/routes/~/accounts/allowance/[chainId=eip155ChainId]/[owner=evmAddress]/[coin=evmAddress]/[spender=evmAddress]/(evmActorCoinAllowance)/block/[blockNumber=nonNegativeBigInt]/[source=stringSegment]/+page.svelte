<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmActorCoinAllowance_Block, {
		$allowance: data.selector,
		blockNumber: BigInt(params.blockNumber),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmActorCoinAllowance_BlockView from '$/views/EvmActorCoinAllowance_BlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Block ' + String(pageSelection.entitySelector.blockNumber)} • EVM actor coin allowance block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM actor coin allowance block'} • EVM actor coin allowance block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmActorCoinAllowance_BlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
