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

	const pageSelection = $derived(select(EntityType.FarcasterChannel, {
		parentUrl: params.parentUrl,
	}, {
		sources: [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			id: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Farcaster channel' : pageSelection.entity.id || 'Farcaster channel'} • Farcaster channel • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterChannelView
		selection={pageSelection}
	/>
</Page>
