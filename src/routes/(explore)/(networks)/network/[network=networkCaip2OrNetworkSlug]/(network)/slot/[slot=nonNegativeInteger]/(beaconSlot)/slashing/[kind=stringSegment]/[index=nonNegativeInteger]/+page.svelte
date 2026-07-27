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

	const pageSelection = $derived(select(EntityType.BeaconSlashing, {
		$network: data.selector,
		slot: Number(params.slot),
		kind: params.kind,
		indexInSlot: Number(params.index),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlashingView from '$/views/BeaconSlashingView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? ((String(pageSelection.entitySelector.indexInSlot ?? '') ? 'Slashing #' + String(pageSelection.entitySelector.indexInSlot ?? '') : '') || 'beacon slashing'))} • beacon slashing • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSlashingView
		selection={pageSelection}
	/>
</Page>
