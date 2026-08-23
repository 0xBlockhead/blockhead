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
	import XrplAmendment_TimestampView from '$/views/XrplAmendment_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XrplAmendment_Timestamp, {
					$amendment: data.selector,
					ledgerIndex: BigInt(params.ledgerIndex),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'XRPL amendment timestamp'} • XRPL amendment timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'XRPL amendment timestamp'} • XRPL amendment timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XrplAmendment_Timestamp, {
					$amendment: data.selector,
					ledgerIndex: BigInt(params.ledgerIndex),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<XrplAmendment_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
