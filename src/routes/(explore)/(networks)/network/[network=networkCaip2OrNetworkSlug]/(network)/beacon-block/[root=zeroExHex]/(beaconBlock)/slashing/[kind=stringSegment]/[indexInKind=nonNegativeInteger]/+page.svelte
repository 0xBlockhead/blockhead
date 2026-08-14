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

	const pageSelection = $derived(select(EntityType.BeaconSlashing, {
		$block: data.selector,
		kind: params.kind,
		indexInKind: Number(params.indexInKind),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlashingView from '$/views/BeaconSlashingView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ((String(pageSelection.entitySelector.indexInKind ?? '') ? 'Slashing #' + String(pageSelection.entitySelector.indexInKind ?? '') : '') || 'beacon slashing')} • beacon slashing • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSlashingView
		selection={pageSelection}
	/>
</Page>
