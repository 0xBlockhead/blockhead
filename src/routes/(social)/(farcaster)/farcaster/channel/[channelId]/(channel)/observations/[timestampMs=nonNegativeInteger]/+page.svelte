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
	import FarcasterChannel_TimestampView from '$/views/FarcasterChannel_TimestampView.svelte'
</script>


<Page>
	<FarcasterChannel_TimestampView
		href={
			resolve('/(social)/(farcaster)/farcaster/channel/[channelId]/(channel)/observations/[timestampMs=nonNegativeInteger]', {
				channelId: params.channelId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.FarcasterChannel_Timestamp, {
				$channel: {
					id: decodeURIComponent(params.channelId),
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
