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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FedimintFederation_Timestamp, {
		$federation: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FedimintFederation_TimestampView from '$/views/FedimintFederation_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Fedimint federation timestamp')} • Fedimint federation timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Fedimint federation timestamp'} • Fedimint federation timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FedimintFederation_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
