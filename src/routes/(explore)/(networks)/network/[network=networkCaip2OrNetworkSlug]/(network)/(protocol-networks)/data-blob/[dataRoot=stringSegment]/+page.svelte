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

	const pageSelection = $derived(select(EntityType.ZeroGDataBlob, data.selector, {
		sources: [
			Source.ZeroGStorageScan_Rest,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.dataRoot || 'zero g data blob')} • zero g data blob • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGDataBlobView
		selection={pageSelection}
	/>
</Page>
