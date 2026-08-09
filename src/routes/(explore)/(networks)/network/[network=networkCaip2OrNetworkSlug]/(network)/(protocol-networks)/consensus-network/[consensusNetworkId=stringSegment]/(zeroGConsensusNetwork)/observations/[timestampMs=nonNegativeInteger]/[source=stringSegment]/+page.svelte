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
	import ZeroGConsensusNetwork_TimestampView from '$/views/ZeroGConsensusNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'zero g consensus network timestamp'} • zero g consensus network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGConsensusNetwork_TimestampView
		selection={
			select(EntityType.ZeroGConsensusNetwork_Timestamp, {
				$consensusNetwork: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
