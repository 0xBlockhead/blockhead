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

	const pageSelection = $derived(select(EntityType.FilecoinSector, data.selector, {
		sources: [
			Source.Lotus_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinSectorView from '$/views/FilecoinSectorView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.sectorNumber) || 'filecoin sector')} • filecoin sector • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinSectorView
		selection={pageSelection}
	/>
</Page>
