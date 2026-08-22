<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.StarknetClass, {
		$network: data.selector,
		classHash: params.classHash,
	}, {
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
			Source.Starkscan,
			Source.Voyager,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetClassView from '$/views/StarknetClassView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.classHash || 'starknet class')} • starknet class • Blockhead</title>
</svelte:head>


<Page>
	<StarknetClassView
		selection={pageSelection}
	/>
</Page>
