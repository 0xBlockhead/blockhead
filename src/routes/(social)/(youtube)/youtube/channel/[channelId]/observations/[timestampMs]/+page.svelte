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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeChannel_TimestampView from '$/views/YoutubeChannel_TimestampView.svelte'
</script>


<Page>
	<YoutubeChannel_TimestampView
		href={
			resolve('/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]', {
				channelId: params.channelId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.YoutubeChannel_Timestamp, {
				$channel: {
					channelId: decodeURIComponent(params.channelId),
				},
				timestampMs: Number(params.timestampMs),
			})
		}
	/>
</Page>
