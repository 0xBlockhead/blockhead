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
	import HederaContractState_TimestampView from '$/views/HederaContractState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hedera contract state timestamp'} • hedera contract state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HederaContractState_TimestampView
		selection={
			select(EntityType.HederaContractState_Timestamp, {
				$contract: data.selector,
				slot: params.slot,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
