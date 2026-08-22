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
	import TonJetton_TimestampView from '$/views/TonJetton_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON jetton timestamp'} • TON jetton timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TonJetton_TimestampView
		selection={
			select(EntityType.TonJetton_Timestamp, {
				$jetton: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
