<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
			title: true,
			publishedAt: true,
			summary: true,
			imageUrl: true,
			$author: true,
			content: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.title) ?? ''), String((pageSelection.entitySelector.identifier) ?? '')].filter(Boolean).join(' ') || 'Nostr article' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).title) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).identifier) ?? '')].filter(Boolean).join(' ') || 'Nostr article'))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Nostr article • Blockhead</title>
</svelte:head>


<Page>
	<NostrArticleView
		href={
			resolve('/nostr/article/[pubkey=stringSegment]/[identifier=stringSegment]', {
				pubkey: params.pubkey,
				identifier: params.identifier,
			})
		}
		selection={pageSelection}
	/>
</Page>
