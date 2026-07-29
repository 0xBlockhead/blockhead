<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrArticle, {
		kind: 30023,
		pubkey: params.pubkey,
		identifier: params.identifier,
	}, {
		sources: [
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
		fields: {
			$latestEvent: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.identifier ?? '') || 'Nostr article' : pageSelection.entitySelector.identifier || 'Nostr article'} • Nostr article • Blockhead</title>
</svelte:head>


<Page>
	<NostrArticleView
		selection={pageSelection}
	/>
</Page>
