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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadQuilibriumAccountState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.QuilibriumNodeRpc_Grpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadQuilibriumAccountStateView from '$/views/BlockheadQuilibriumAccountStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.accountAddress || 'blockhead quilibrium account state')} • blockhead quilibrium account state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadQuilibriumAccountStateView
		selection={pageSelection}
	/>
</Page>
