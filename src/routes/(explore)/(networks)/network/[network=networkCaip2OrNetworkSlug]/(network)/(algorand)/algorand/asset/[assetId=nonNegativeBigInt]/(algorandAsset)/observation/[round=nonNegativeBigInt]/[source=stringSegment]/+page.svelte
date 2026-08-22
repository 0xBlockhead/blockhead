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
	import AlgorandAsset_TimestampView from '$/views/AlgorandAsset_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'algorand asset timestamp'} • algorand asset timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandAsset_TimestampView
		selection={
			select(EntityType.AlgorandAsset_Timestamp, {
				$asset: data.selector,
				round: BigInt(params.round),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
