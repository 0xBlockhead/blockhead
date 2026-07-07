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
	import NostrReactionView from '$/views/NostrReactionView.svelte'
</script>


<Page>
	<NostrReactionView
		href={
			resolve('/(social)/(nostr)/nostr/reaction/[eventId]', {
				eventId: params.eventId,
			})
		}
		selection={
			select(EntityType.NostrReaction, {
				eventId: decodeURIComponent(params.eventId),
			}, {
				sources: [
					Source.Primal_Rest,
					Source.NostrBand_Rest,
				],
				fields: {
					content: true,
					createdAt: true,
					kind: true,
					pubkey: true,
					$author: true,
					$targetNote: true,
					$targetArticle: true,
				},
			})
		}
	/>
</Page>
