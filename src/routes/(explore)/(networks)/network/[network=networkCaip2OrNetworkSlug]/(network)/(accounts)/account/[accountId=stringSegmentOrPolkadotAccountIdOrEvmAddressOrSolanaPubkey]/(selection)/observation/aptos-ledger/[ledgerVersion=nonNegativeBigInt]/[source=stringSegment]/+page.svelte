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
	import AptosAccount_TimestampView from '$/views/AptosAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosAccount_Timestamp, {
					$account: data.selector,
					ledgerVersion: BigInt(params.ledgerVersion),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.ledgerVersion) || 'aptos account timestamp')} • aptos account timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'aptos account timestamp'} • aptos account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosAccount_Timestamp, {
					$account: data.selector,
					ledgerVersion: BigInt(params.ledgerVersion),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<AptosAccount_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
