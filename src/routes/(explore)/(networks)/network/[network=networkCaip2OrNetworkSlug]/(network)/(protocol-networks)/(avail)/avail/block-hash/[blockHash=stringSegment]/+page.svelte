<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AvailBlock, {
		$network: data.selector,
		blockHash: params.blockHash,
	}, {
		fields: {
			blockNumber: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvailBlockView from '$/views/AvailBlockView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.blockHash ?? '') || 'avail block' : String(pageSelection.entity.blockNumber) || pageSelection.entitySelector.blockHash || 'avail block')} • avail block • Blockhead</title>
</svelte:head>


<Page>
	<AvailBlockView
		selection={pageSelection}
	/>
</Page>
