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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StarknetBlock, {
		$network: data.selector,
		blockNumber: BigInt(params.blockNumber),
	}, {
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
			Source.Starkscan,
			Source.Voyager,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetBlockView from '$/views/StarknetBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.blockNumber) || 'starknet block')} • starknet block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet block'} • starknet block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StarknetBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
