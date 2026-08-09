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
	import SuiTransaction_TimestampView from '$/views/SuiTransaction_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Sui transaction timestamp'} • Sui transaction timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SuiTransaction_TimestampView
		selection={
			select(EntityType.SuiTransaction_Timestamp, {
				$transaction: data.selector,
				checkpointSequence: BigInt(params.checkpointSequence),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
