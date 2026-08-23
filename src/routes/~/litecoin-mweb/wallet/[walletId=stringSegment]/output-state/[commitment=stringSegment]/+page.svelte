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


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLitecoinMwebOutputStateView from '$/views/BlockheadLitecoinMwebOutputStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLitecoinMwebOutputState, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.commitment || 'blockhead litecoin mweb output state')} • blockhead litecoin mweb output state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead litecoin mweb output state'} • blockhead litecoin mweb output state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLitecoinMwebOutputState, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})}

	<BlockheadLitecoinMwebOutputStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
