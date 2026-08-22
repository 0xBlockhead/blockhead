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
	import StarknetAccount_TimestampView from '$/views/StarknetAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'starknet account timestamp'} • starknet account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<StarknetAccount_TimestampView
		selection={
			select(EntityType.StarknetAccount_Timestamp, {
				$contract: data.selector,
				blockNumber: BigInt(params.blockNumber),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
