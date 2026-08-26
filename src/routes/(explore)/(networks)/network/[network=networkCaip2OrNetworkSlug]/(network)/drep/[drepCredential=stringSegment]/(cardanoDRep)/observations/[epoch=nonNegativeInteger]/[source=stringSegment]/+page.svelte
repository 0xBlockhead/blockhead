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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoDRep_Timestamp, {
		$drep: data.selector,
		epoch: Number(params.epoch),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoDRep_TimestampView from '$/views/CardanoDRep_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Cardano DRep timestamp'} • Cardano DRep timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano DRep timestamp'} • Cardano DRep timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoDRep_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
