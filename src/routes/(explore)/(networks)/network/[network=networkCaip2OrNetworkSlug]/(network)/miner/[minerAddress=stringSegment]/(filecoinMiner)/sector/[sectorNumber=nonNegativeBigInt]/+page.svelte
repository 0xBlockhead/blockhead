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
	import FilecoinSectorView from '$/views/FilecoinSectorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinSector, data.selector, {
				sources: [
					Source.Lotus_JsonRpc,
				],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.sectorNumber) || 'filecoin sector')} • filecoin sector • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin sector'} • filecoin sector • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinSector, data.selector, {
				sources: [
					Source.Lotus_JsonRpc,
				],
			})}

	<FilecoinSectorView
		selection={pageSelection}
	/>
	{/if}
</Page>
