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
		blockNumber: BigInt(params.blockNumber),
	}, {
		fields: {
			blockHash: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvailBlockView from '$/views/AvailBlockView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.blockNumber ?? '') || 'avail block' : String(pageSelection.entitySelector.blockNumber) || pageSelection.entity.blockHash || 'avail block')} • avail block • Blockhead</title>
</svelte:head>


<Page>
	<AvailBlockView
		selection={pageSelection}
	/>
</Page>
