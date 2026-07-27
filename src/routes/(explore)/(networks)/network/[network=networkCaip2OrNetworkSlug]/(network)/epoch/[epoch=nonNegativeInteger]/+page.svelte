<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.BeaconEpoch, data.selector, {
		sources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
		fields: {
			startSlot: true,
			endSlot: true,
			slotCount: true,
			finalized: true,
			globalParticipationRate: true,
			validatorsCount: true,
			attestationsCount: true,
			withdrawalsCount: true,
			attesterSlashingsCount: true,
			proposerSlashingsCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? ((String(pageSelection.entitySelector.epoch ?? '') ? 'Epoch #' + String(pageSelection.entitySelector.epoch ?? '') : '') || 'beacon epoch'))} • beacon epoch • Blockhead</title>
</svelte:head>


<Page>
	<BeaconEpochView
		selection={pageSelection}
	/>
</Page>
