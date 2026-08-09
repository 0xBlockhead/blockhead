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
	import SorobanContractStorageEntry_TimestampView from '$/views/SorobanContractStorageEntry_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'soroban contract storage entry timestamp'} • soroban contract storage entry timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SorobanContractStorageEntry_TimestampView
		selection={
			select(EntityType.SorobanContractStorageEntry_Timestamp, {
				$entry: data.selector,
				ledgerSequence: BigInt(params.ledgerSequence),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
