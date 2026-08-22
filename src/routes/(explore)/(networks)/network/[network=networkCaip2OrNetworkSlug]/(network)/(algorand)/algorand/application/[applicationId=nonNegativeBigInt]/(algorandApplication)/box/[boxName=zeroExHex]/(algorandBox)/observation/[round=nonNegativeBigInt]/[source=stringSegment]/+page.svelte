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
	import AlgorandBox_RoundView from '$/views/AlgorandBox_RoundView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'algorand box round'} • algorand box round • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandBox_RoundView
		selection={
			select(EntityType.AlgorandBox_Round, {
				$box: data.selector,
				round: BigInt(params.round),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
