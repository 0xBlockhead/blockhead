<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AiDocumentClaimView from '$/views/AiDocumentClaimView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AiDocumentClaim, {
				$document: data.selector,
				extractorId: params.extractorId,
				claimPath: params.claimPath,
			}, {
				sources: [
					Source.Eip8004Scan_Rest,
					Source.Ipfs_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.claimPath || 'AI document claim')} • AI document claim • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI document claim'} • AI document claim • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AiDocumentClaim, {
				$document: data.selector,
				extractorId: params.extractorId,
				claimPath: params.claimPath,
			}, {
				sources: [
					Source.Eip8004Scan_Rest,
					Source.Ipfs_Rest,
				],
			})}

	<AiDocumentClaimView
		selection={pageSelection}
	/>
	{/if}
</Page>
