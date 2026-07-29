<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.FarcasterUser_Timestamp, {
		$user: {
			fid: Number(params.userId),
		},
		timestampMs: Number(params.timestampMs),
	}, {
		sources: [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			followerCount: true,
			followingCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUser_TimestampView from '$/views/FarcasterUser_TimestampView.svelte'
</script>


<svelte:head>
	<title>{'Farcaster user observation'} • Farcaster user observation • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterUser_TimestampView
		selection={pageSelection}
	/>
</Page>
