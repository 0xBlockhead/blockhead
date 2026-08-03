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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrArticle, {
		kind: 30023,
		pubkey: params.pubkey,
		identifier: params.identifier,
	}, {
		sources: [
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.identifier || 'Nostr article'} • Nostr article • Blockhead</title>
</svelte:head>


<Page>
	<NostrArticleView
		selection={pageSelection}
	/>
</Page>
