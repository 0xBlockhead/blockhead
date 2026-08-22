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

	const pageSelection = $derived(select(EntityType.BnbBeaconBlock, {
		$network: data.selector,
		hash: params.hash,
	}, {
		fields: {
			height: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconBlockView from '$/views/BnbBeaconBlockView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.hash ?? '') || 'bnb beacon block' : String(pageSelection.entity.height) || pageSelection.entitySelector.hash || 'bnb beacon block')} • bnb beacon block • Blockhead</title>
</svelte:head>


<Page>
	<BnbBeaconBlockView
		selection={pageSelection}
	/>
</Page>
