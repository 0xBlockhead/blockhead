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
	import AptosNetwork_TimestampView from '$/views/AptosNetwork_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosNetwork_Timestamp, {
					$network: data.selector,
					ledgerVersion: BigInt(params.ledgerVersion),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.ledgerVersion) || 'aptos network timestamp')} • aptos network timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'aptos network timestamp'} • aptos network timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosNetwork_Timestamp, {
					$network: data.selector,
					ledgerVersion: BigInt(params.ledgerVersion),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<AptosNetwork_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
