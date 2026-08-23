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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AptosTransaction_Timestamp, {
		$transaction: data.selector,
		ledgerVersion: BigInt(params.ledgerVersion),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosTransaction_TimestampView from '$/views/AptosTransaction_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.ledgerVersion) || 'aptos transaction timestamp')} • aptos transaction timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'aptos transaction timestamp'} • aptos transaction timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AptosTransaction_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
