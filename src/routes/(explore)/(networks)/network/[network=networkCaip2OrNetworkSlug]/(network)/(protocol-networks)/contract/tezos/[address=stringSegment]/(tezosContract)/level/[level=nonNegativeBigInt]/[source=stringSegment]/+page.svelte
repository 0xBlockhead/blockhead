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
	import TezosContract_TimestampView from '$/views/TezosContract_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos contract timestamp'} • tezos contract timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TezosContract_TimestampView
		selection={
			select(EntityType.TezosContract_Timestamp, {
				$contract: data.selector,
				level: BigInt(params.level),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
