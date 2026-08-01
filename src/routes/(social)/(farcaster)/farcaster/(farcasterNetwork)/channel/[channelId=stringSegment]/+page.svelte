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
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FarcasterChannel, data.selector, {
		sources: [
			Source.Farcaster_Rest,
		],
		fields: {
			$icon: true,
			name: true,
			createdAt: true,
			url: true,
			$lead: true,
			$moderator: true,
			externalLinkUrl: true,
			description: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'Farcaster channel' : [pageSelection.entity.name, pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'Farcaster channel')} • Farcaster channel • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterChannelView
		selection={pageSelection}
	/>
</Page>
