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
	import SorobanContract_TimestampView from '$/views/SorobanContract_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'soroban contract timestamp'} • soroban contract timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SorobanContract_TimestampView
		selection={
			select(EntityType.SorobanContract_Timestamp, {
				$contract: data.selector,
				ledgerSequence: BigInt(params.ledgerSequence),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
