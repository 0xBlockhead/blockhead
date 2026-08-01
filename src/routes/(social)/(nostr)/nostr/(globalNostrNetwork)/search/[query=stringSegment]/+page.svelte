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

	const pageSelection = $derived(select(EntityType.NostrSearchQuery, {
		query: params.query,
	}, {
		sources: [
			Source.NostrBand_Rest,
		],
		fields: {
			resultCount: true,
			completed: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrSearchQueryView from '$/views/NostrSearchQueryView.svelte'
</script>


<svelte:head>
	<title>{['Search: ', pageSelection.entitySelector.query].filter(Boolean).join(' ') || 'Nostr profile search'} • Nostr profile search • Blockhead</title>
</svelte:head>


<Page>
	<NostrSearchQueryView
		selection={pageSelection}
	/>
</Page>
