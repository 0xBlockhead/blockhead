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


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelStateView from '$/views/BlockheadStateChannelStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadStateChannelState, {
				$channel: data.selector,
				version: Number(params.version),
				stateData: params.stateData,
			}, {
				sources: [
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.version) || 'blockhead state channel state')} • blockhead state channel state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead state channel state'} • blockhead state channel state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadStateChannelState, {
				$channel: data.selector,
				version: Number(params.version),
				stateData: params.stateData,
			}, {
				sources: [
					Source.Local_Internal,
				],
			})}

	<BlockheadStateChannelStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
