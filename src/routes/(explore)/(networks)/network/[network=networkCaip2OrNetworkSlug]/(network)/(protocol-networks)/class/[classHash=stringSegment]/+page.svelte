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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StarknetClass, {
		$network: data.selector,
		classHash: params.classHash,
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
	import StarknetClassView from '$/views/StarknetClassView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.classHash || 'starknet class')} • starknet class • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet class'} • starknet class • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StarknetClassView
		selection={pageSelection}
	/>
	{/if}
</Page>
