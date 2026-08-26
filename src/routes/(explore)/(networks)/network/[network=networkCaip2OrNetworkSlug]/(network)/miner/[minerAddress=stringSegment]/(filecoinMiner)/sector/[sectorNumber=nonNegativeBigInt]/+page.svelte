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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FilecoinSector, data.selector, {
		sources: [
			Source.Lotus_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinSectorView from '$/views/FilecoinSectorView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.sectorNumber) || 'filecoin sector')} • filecoin sector • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin sector'} • filecoin sector • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FilecoinSectorView
		selection={pageSelection}
	/>
	{/if}
</Page>
