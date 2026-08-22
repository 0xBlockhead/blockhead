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

	const pageSelection = $derived(select(EntityType.ZeroGServiceRequest, data.selector, {
		sources: [
			Source.ZeroGChain_JsonRpc,
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGServiceRequestView from '$/views/ZeroGServiceRequestView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.requestId || 'zero g service request')} • zero g service request • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGServiceRequestView
		selection={pageSelection}
	/>
</Page>
