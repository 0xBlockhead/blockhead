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


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCast_TimestampView from '$/views/FarcasterCast_TimestampView.svelte'
</script>


<svelte:head>
	<title>Farcaster cast observation • Farcaster cast observation • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCast_TimestampView
		selection={
			select(EntityType.FarcasterCast_Timestamp, {
				$cast: {
					fid: Number(params.fid),
					hash: params.hash,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
