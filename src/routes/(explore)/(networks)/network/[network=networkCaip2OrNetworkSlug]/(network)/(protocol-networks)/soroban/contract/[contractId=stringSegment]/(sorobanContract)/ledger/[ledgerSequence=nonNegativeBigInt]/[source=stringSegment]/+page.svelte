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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SorobanContract_Timestamp, {
		$contract: data.selector,
		ledgerSequence: BigInt(params.ledgerSequence),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SorobanContract_TimestampView from '$/views/SorobanContract_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'soroban contract timestamp'} • soroban contract timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'soroban contract timestamp'} • soroban contract timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SorobanContract_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
