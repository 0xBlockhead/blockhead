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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BeaconExecutionDepositRequest, {
		$envelope: data.selector,
		requestIndex: params.requestIndex,
	}, {
		sources: [
			Source.Beacon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionDepositRequestView from '$/views/BeaconExecutionDepositRequestView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Deposit request ' + String(pageSelection.entitySelector.requestIndex)} • Beacon execution deposit request • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Beacon execution deposit request'} • Beacon execution deposit request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BeaconExecutionDepositRequestView
		selection={pageSelection}
	/>
	{/if}
</Page>
