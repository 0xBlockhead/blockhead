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

	const pageSelection = $derived(select(EntityType.BlockheadLitecoinMwebOutputState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLitecoinMwebOutputStateView from '$/views/BlockheadLitecoinMwebOutputStateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.commitment || 'blockhead litecoin mweb output state')} • blockhead litecoin mweb output state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLitecoinMwebOutputStateView
		selection={pageSelection}
	/>
</Page>
