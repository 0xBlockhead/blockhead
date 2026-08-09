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

	const pageSelection = $derived(select(EntityType.BlockheadKaspaNodeState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadKaspaNodeStateView from '$/views/BlockheadKaspaNodeStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.connectionId || 'blockhead kaspa node state')} • blockhead kaspa node state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadKaspaNodeStateView
		selection={pageSelection}
	/>
</Page>
