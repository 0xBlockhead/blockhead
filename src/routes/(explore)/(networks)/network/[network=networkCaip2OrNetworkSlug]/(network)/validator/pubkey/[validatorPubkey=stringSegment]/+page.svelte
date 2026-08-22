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

	const pageSelection = $derived(select(EntityType.BeaconValidator, data.selector, {
		sources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
		fields: {
			indexInNetwork: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'beacon validator' : (String(pageSelection.entity.indexInNetwork ?? '') ? 'Validator #' + String(pageSelection.entity.indexInNetwork ?? '') : '') || 'beacon validator')} • beacon validator • Blockhead</title>
</svelte:head>


<Page>
	<BeaconValidatorView
		selection={pageSelection}
	/>
</Page>
