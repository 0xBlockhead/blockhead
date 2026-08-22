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
	import SuiDynamicFieldEdge_TimestampView from '$/views/SuiDynamicFieldEdge_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Sui dynamic field edge timestamp'} • Sui dynamic field edge timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SuiDynamicFieldEdge_TimestampView
		selection={
			select(EntityType.SuiDynamicFieldEdge_Timestamp, {
				$edge: data.selector,
				checkpointSequence: BigInt(params.checkpointSequence),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
