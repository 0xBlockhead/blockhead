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

	const pageSelection = $derived(select(EntityType.AiDocumentClaim, {
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
	<title>{data.title ?? (pageSelection.entitySelector.claimPath || 'AI document claim')} • AI document claim • Blockhead</title>
</svelte:head>


<Page>
	<AiDocumentClaimView
		selection={pageSelection}
	/>
</Page>
