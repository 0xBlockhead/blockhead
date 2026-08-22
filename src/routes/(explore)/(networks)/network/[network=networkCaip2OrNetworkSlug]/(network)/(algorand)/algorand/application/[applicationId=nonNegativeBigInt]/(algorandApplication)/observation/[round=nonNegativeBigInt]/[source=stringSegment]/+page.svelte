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
	import AlgorandApplication_TimestampView from '$/views/AlgorandApplication_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'algorand application timestamp'} • algorand application timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandApplication_TimestampView
		selection={
			select(EntityType.AlgorandApplication_Timestamp, {
				$application: data.selector,
				round: BigInt(params.round),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
