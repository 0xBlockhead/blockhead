<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FarcasterChannel_Timestamp, {
		$channel: {
			id: params.channelId,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannel_TimestampView from '$/views/FarcasterChannel_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Farcaster channel observation' : (pageSelection.entity.name ?? '') || 'Farcaster channel observation'} • Farcaster channel observation • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterChannel_TimestampView
		selection={pageSelection}
	/>
</Page>
