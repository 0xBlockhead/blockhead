<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.BeaconCommittee, {
		$network: data.selector,
		slot: Number(params.slot),
		indexInSlot: Number(params.index),
	}, {
		fields: {
			validatorIndices: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconCommitteeView from '$/views/BeaconCommitteeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ((String(pageSelection.entitySelector.indexInSlot ?? '') ? 'Committee #' + String(pageSelection.entitySelector.indexInSlot ?? '') : '') || 'beacon committee')} • beacon committee • Blockhead</title>
</svelte:head>


<Page>
	<BeaconCommitteeView
		selection={pageSelection}
	/>
</Page>
