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
	import NostrRepostView from '$/views/NostrRepostView.svelte'
</script>


<svelte:head>
	<title>Nostr repost • Blockhead</title>
</svelte:head>


<Page>
	<NostrRepostView
		href={
			resolve('/(social)/(nostr)/nostr/repost/[eventId]', {
				eventId: params.eventId,
			})
		}
		selection={
			select(EntityType.NostrRepost, data.selector, {
				fields: {
					repostedEventId: true,
					createdAt: true,
					kind: true,
					pubkey: true,
					$author: true,
					$repostedNote: true,
					$repostedArticle: true,
				},
			})
		}
	/>
</Page>
