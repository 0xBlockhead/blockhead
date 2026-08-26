<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BeaconExecutionWithdrawalRequest, {
		$envelope: data.selector,
		indexInEnvelope: Number(params.indexInEnvelope),
	}, {
		sources: [
			Source.Beacon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionWithdrawalRequestView from '$/views/BeaconExecutionWithdrawalRequestView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInEnvelope ?? '') ? 'Withdrawal request #' + String(pageSelection.entitySelector.indexInEnvelope ?? '') : '') || 'Beacon execution withdrawal request')} • Beacon execution withdrawal request • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Beacon execution withdrawal request'} • Beacon execution withdrawal request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BeaconExecutionWithdrawalRequestView
		selection={pageSelection}
	/>
	{/if}
</Page>
