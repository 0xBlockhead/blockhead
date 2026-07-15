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
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
</script>


<svelte:head>
	<title>Note reactions • Blockhead</title>
</svelte:head>


<Page>
	<NostrReactionsView
		href={
			resolve('/nostr/note/[eventId=stringSegment]/reactions', {
				eventId: params.eventId,
			})
		}
		title='Note reactions'
		selection={
			select(EntityType.NostrNote, data.selector).$$reactions({
				sources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
				count: true,
			})
		}
		id='reactions'
	/>
</Page>
