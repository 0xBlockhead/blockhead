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
	import AlgorandRoundView from '$/views/AlgorandRoundView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'algorand round'} • algorand round • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandRoundView
		selection={
			select(EntityType.AlgorandRound, {
				$network: data.selector,
				round: BigInt(params.round),
			})
		}
	/>
</Page>
