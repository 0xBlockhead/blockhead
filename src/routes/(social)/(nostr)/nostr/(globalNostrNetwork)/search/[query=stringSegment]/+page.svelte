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


	// Components
	import Page from '$/components/Page.svelte'
	import NostrSearchQueryView from '$/views/NostrSearchQueryView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		query: params.query,
	}.query) ?? '')].filter(Boolean).join(' ') || 'Nostr profile search' : [String((({ ...{
		query: params.query,
	}, ...pageSelection.entity }).query) ?? '')].filter(Boolean).join(' ') || 'Nostr profile search')} • Nostr profile search • Blockhead</title>
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
