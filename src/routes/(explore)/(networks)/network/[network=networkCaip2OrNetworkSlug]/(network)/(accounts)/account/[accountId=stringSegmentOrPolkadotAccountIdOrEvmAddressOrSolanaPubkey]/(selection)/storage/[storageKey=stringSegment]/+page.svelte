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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StarknetStorageEntry, data.selector, {
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetStorageEntryView from '$/views/StarknetStorageEntryView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.storageKey || 'starknet storage entry')} • starknet storage entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet storage entry'} • starknet storage entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StarknetStorageEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
