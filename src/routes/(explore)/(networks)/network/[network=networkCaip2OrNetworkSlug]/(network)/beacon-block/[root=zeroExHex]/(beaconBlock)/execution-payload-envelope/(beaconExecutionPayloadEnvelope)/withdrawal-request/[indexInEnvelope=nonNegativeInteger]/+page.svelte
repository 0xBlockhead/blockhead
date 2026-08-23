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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionWithdrawalRequestView from '$/views/BeaconExecutionWithdrawalRequestView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconExecutionWithdrawalRequest, {
				$envelope: data.selector,
				indexInEnvelope: Number(params.indexInEnvelope),
			}, {
				sources: [
					Source.Beacon_Rest,
				],
			})}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInEnvelope ?? '') ? 'Withdrawal request #' + String(pageSelection.entitySelector.indexInEnvelope ?? '') : '') || 'Beacon execution withdrawal request')} • Beacon execution withdrawal request • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Beacon execution withdrawal request'} • Beacon execution withdrawal request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconExecutionWithdrawalRequest, {
				$envelope: data.selector,
				indexInEnvelope: Number(params.indexInEnvelope),
			}, {
				sources: [
					Source.Beacon_Rest,
				],
			})}

	<BeaconExecutionWithdrawalRequestView
		selection={pageSelection}
	/>
	{/if}
</Page>
