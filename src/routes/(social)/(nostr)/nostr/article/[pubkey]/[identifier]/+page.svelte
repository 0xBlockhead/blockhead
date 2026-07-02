<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<svelte:head>
	<title>Nostr article • Blockhead</title>
</svelte:head>


<Page>
	<NostrArticleView
		href={
			resolve('/(social)/(nostr)/nostr/article/[pubkey]/[identifier]', {
				pubkey: params.pubkey,
				identifier: params.identifier,
			})
		}
		selection={
			select(EntityType.NostrArticle, data.selector, {
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
