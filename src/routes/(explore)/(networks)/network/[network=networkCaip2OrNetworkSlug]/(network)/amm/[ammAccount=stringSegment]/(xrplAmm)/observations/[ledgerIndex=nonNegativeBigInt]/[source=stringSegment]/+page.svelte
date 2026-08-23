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
	import XrplAmm_TimestampView from '$/views/XrplAmm_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.XrplAmm_Timestamp, {
				$amm: data.selector,
				ledgerIndex: BigInt(params.ledgerIndex),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'XRPL AMM timestamp'} • XRPL AMM timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XRPL AMM timestamp'} • XRPL AMM timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.XrplAmm_Timestamp, {
				$amm: data.selector,
				ledgerIndex: BigInt(params.ledgerIndex),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<XrplAmm_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
