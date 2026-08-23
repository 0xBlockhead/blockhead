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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XrplAmendment_Timestamp, {
		$amendment: data.selector,
		ledgerIndex: BigInt(params.ledgerIndex),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplAmendment_TimestampView from '$/views/XrplAmendment_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'XRPL amendment timestamp'} • XRPL amendment timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XRPL amendment timestamp'} • XRPL amendment timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XrplAmendment_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
