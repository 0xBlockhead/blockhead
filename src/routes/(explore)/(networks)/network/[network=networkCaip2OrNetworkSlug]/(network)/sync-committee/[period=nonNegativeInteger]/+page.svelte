<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BeaconSyncCommittee, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSyncCommitteeView from '$/views/BeaconSyncCommitteeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.period ?? '') ? 'Sync committee #' + String(pageSelection.entitySelector.period ?? '') : '') || 'beacon sync committee')} • beacon sync committee • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'beacon sync committee'} • beacon sync committee • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BeaconSyncCommitteeView
		selection={pageSelection}
	/>
	{/if}
</Page>
