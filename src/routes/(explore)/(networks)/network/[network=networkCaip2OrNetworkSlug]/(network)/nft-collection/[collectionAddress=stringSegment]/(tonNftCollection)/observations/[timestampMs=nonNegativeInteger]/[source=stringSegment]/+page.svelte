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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonNftCollection_Timestamp, {
		$collection: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TonNftCollection_TimestampView from '$/views/TonNftCollection_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON NFT collection timestamp'} • TON NFT collection timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON NFT collection timestamp'} • TON NFT collection timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonNftCollection_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
