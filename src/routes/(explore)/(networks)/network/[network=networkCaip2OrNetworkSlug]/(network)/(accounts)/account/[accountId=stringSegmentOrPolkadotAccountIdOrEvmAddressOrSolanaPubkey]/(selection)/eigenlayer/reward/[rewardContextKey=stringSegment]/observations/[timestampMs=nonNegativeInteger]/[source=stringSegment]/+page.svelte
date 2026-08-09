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
	import EigenLayerReward_TimestampView from '$/views/EigenLayerReward_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'eigen layer reward timestamp'} • eigen layer reward timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EigenLayerReward_TimestampView
		selection={
			select(EntityType.EigenLayerReward_Timestamp, {
				$earner: data.selector,
				rewardContextKey: params.rewardContextKey,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
