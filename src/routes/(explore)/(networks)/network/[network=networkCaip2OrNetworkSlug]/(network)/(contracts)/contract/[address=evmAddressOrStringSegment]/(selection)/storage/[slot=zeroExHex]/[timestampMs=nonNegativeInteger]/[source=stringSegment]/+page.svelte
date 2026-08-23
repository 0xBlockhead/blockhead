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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmStorageRead_Timestamp, {
		$contract: data.selector,
		slot: params.slot,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmStorageRead_TimestampView from '$/views/EvmStorageRead_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.slot || 'EVM storage read timestamp')} • EVM storage read timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM storage read timestamp'} • EVM storage read timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmStorageRead_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
