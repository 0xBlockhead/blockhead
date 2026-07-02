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
	import FarcasterChannel_TimestampView from '$/views/FarcasterChannel_TimestampView.svelte'
</script>


<svelte:head>
	<title>Farcaster channel observation • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterChannel_TimestampView
		href={
			resolve('/(social)/(farcaster)/farcaster/channel/[channelId]/(channel)/observations/[timestampMs=nonNegativeInteger]', {
				channelId: params.channelId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.FarcasterChannel_Timestamp, data.selector, {
				fields: {
					followerCount: true,
					memberCount: true,
				},
			})
		}
	/>
</Page>
