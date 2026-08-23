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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BeaconCommittee, {
		$network: data.selector,
		slot: Number(params.slot),
		indexInSlot: Number(params.index),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconCommitteeView from '$/views/BeaconCommitteeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInSlot ?? '') ? 'Committee #' + String(pageSelection.entitySelector.indexInSlot ?? '') : '') || 'beacon committee')} • beacon committee • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'beacon committee'} • beacon committee • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BeaconCommitteeView
		selection={pageSelection}
	/>
	{/if}
</Page>
