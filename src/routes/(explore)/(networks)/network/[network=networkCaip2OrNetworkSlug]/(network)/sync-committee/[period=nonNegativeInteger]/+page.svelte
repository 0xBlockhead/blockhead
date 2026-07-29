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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BeaconSyncCommittee, data.selector, {
		fields: {
			validatorIndices: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSyncCommitteeView from '$/views/BeaconSyncCommitteeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ((String(pageSelection.entitySelector.period ?? '') ? 'Sync committee #' + String(pageSelection.entitySelector.period ?? '') : '') || 'beacon sync committee')} • beacon sync committee • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSyncCommitteeView
		selection={pageSelection}
	/>
</Page>
