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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.KaspaAddress_Timestamp, {
		$address: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import KaspaAddress_TimestampView from '$/views/KaspaAddress_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'kaspa address timestamp'} • kaspa address timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'kaspa address timestamp'} • kaspa address timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<KaspaAddress_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
