<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSyncCommitteeView from '$/views/BeaconSyncCommitteeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconSyncCommittee, data.selector))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.period ?? '') ? 'Sync committee #' + String(pageSelection.entitySelector.period ?? '') : '') || 'beacon sync committee')} • beacon sync committee • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'beacon sync committee'} • beacon sync committee • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconSyncCommittee, data.selector))}

		<BeaconSyncCommitteeView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
