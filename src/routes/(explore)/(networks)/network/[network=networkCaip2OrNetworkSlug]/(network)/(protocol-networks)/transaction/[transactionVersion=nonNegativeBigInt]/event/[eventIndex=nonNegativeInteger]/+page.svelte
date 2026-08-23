<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AptosEventView from '$/views/AptosEventView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosEvent, {
					$network: data.selector,
					transactionVersion: BigInt(params.transactionVersion),
					eventIndex: Number(params.eventIndex),
				}, {
					fields: {
						eventType: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'aptos event' : pageSelection.entity.eventType || 'aptos event')} • aptos event • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'aptos event'} • aptos event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosEvent, {
					$network: data.selector,
					transactionVersion: BigInt(params.transactionVersion),
					eventIndex: Number(params.eventIndex),
				}, {
					fields: {
						eventType: true,
					},
				}))}

		<AptosEventView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
