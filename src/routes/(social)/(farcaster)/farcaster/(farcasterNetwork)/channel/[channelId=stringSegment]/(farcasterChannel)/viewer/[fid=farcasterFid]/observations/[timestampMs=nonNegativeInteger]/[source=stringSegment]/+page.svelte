<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannel_Viewer_TimestampView from '$/views/FarcasterChannel_Viewer_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Farcaster channel viewer observation'} • Farcaster channel viewer observation • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterChannel_Viewer_TimestampView
		selection={
			select(EntityType.FarcasterChannel_Viewer_Timestamp, {
				$channel: data.selector,
				$viewer: {
					fid: Number(params.fid),
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
