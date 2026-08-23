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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoNativeAsset_Timestamp, {
		$asset: data.selector,
		slot: BigInt(params.slot),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoNativeAsset_TimestampView from '$/views/CardanoNativeAsset_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Cardano native asset timestamp'} • Cardano native asset timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano native asset timestamp'} • Cardano native asset timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoNativeAsset_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
