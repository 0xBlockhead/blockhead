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


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannel_TimestampView from '$/views/FarcasterChannel_TimestampView.svelte'
</script>


<svelte:head>
	<title>{'Farcaster channel observation'} • Farcaster channel observation • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterChannel_TimestampView
		selection={
			select(EntityType.FarcasterChannel_Timestamp, {
				$channel: {
					id: params.channelId,
				},
				timestampMs: Number(params.timestampMs),
			}, {
				sources: [
					Source.Farcaster_Rest,
					Source.Neynar_Rest,
				],
				fields: {
					followerCount: true,
					memberCount: true,
				},
			})
		}
	/>
</Page>
