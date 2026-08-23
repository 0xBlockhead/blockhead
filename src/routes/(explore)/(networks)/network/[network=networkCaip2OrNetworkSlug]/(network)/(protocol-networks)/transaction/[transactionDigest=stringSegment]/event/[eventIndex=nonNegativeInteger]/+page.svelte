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


	// Components
	import Page from '$/components/Page.svelte'
	import SuiEventView from '$/views/SuiEventView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiEvent, {
				$network: data.selector,
				transactionDigest: params.transactionDigest,
				eventIndex: Number(params.eventIndex),
			})}
		<title>{data?.title ?? 'Sui event'} • Sui event • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui event'} • Sui event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiEvent, {
				$network: data.selector,
				transactionDigest: params.transactionDigest,
				eventIndex: Number(params.eventIndex),
			})}

	<SuiEventView
		selection={pageSelection}
	/>
	{/if}
</Page>
