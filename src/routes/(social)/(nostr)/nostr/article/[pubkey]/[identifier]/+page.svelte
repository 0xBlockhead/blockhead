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


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<Page>
	<NostrArticleView
		href={
			resolve('/(social)/(nostr)/nostr/article/[pubkey]/[identifier]', {
				pubkey: params.pubkey,
				identifier: params.identifier,
			})
		}
		selection={
			select(EntityType.NostrArticle, {
				kind: 30023,
				pubkey: decodeURIComponent(params.pubkey),
				identifier: decodeURIComponent(params.identifier),
			}, {
				sources: [
					Source.NostrBand_Rest,
				],
				fields: {
					title: true,
					publishedAt: true,
					summary: true,
					imageUrl: true,
					$author: true,
					content: true,
				},
			})
		}
	/>
</Page>
