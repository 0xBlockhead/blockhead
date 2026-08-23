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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CashuKeyset_Timestamp, {
		$keyset: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CashuKeyset_TimestampView from '$/views/CashuKeyset_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Cashu keyset timestamp')} • Cashu keyset timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cashu keyset timestamp'} • Cashu keyset timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CashuKeyset_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
