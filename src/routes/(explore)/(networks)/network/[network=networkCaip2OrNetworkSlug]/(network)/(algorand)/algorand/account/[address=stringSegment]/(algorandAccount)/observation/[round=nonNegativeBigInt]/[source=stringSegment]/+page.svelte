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
	import AlgorandAccount_TimestampView from '$/views/AlgorandAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'algorand account timestamp'} • algorand account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandAccount_TimestampView
		selection={
			select(EntityType.AlgorandAccount_Timestamp, {
				$account: data.selector,
				round: BigInt(params.round),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
