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
	import TezosCycleView from '$/views/TezosCycleView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'tezos cycle'} • tezos cycle • Blockhead</title>
</svelte:head>


<Page>
	<TezosCycleView
		selection={
			select(EntityType.TezosCycle, {
				$network: data.selector,
				cycle: BigInt(params.cycle),
			})
		}
	/>
</Page>
