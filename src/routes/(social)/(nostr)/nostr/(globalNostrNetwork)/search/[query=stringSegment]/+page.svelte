<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.query) ?? '')].filter(Boolean).join(' ') || 'Nostr profile search' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).query) ?? '')].filter(Boolean).join(' ') || 'Nostr profile search'))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrSearchQueryView from '$/views/NostrSearchQueryView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Nostr profile search • Blockhead</title>
</svelte:head>


<Page>
	<NostrSearchQueryView
		href={
			resolve('/nostr/search/[query=stringSegment]', {
				query: params.query,
			})
		}
		selection={pageSelection}
	/>
</Page>
