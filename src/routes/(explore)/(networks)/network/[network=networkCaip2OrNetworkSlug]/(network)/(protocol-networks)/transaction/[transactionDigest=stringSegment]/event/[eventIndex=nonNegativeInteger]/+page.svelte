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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SuiEvent, {
		$network: data.selector,
		transactionDigest: params.transactionDigest,
		eventIndex: Number(params.eventIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiEventView from '$/views/SuiEventView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Sui event'} • Sui event • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui event'} • Sui event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SuiEventView
		selection={pageSelection}
	/>
	{/if}
</Page>
