<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AiDocumentClaim, {
		$document: data.selector,
		extractorId: params.extractorId,
		claimPath: params.claimPath,
	}, {
		sources: [
			Source.Eip8004Scan_Rest,
			Source.Ipfs_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiDocumentClaimView from '$/views/AiDocumentClaimView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.claimPath || 'AI document claim')} • AI document claim • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI document claim'} • AI document claim • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AiDocumentClaimView
		selection={pageSelection}
	/>
	{/if}
</Page>
