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
	import TonJettonBalance_TimestampView from '$/views/TonJettonBalance_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON jetton balance timestamp'} • TON jetton balance timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TonJettonBalance_TimestampView
		selection={
			select(EntityType.TonJettonBalance_Timestamp, {
				$account: data.selector,
				$jetton: {
					$network: data.selector.$network,
					masterAddress: params.masterAddress,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
