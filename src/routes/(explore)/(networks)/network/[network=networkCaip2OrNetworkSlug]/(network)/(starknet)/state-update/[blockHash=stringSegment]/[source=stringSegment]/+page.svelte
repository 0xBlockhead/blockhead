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

	const pageSelection = $derived(select(EntityType.StarknetStateUpdate, {
		$network: {
			$network: data.selector,
		},
		blockHash: params.blockHash,
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetStateUpdateView from '$/views/StarknetStateUpdateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.blockHash || 'Starknet state update')} • Starknet state update • Blockhead</title>
</svelte:head>


<Page>
	<StarknetStateUpdateView
		selection={pageSelection}
	/>
</Page>
