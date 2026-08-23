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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadStateChannelState, {
		$channel: data.selector,
		version: Number(params.version),
		stateData: params.stateData,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelStateView from '$/views/BlockheadStateChannelStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.version) || 'blockhead state channel state')} • blockhead state channel state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead state channel state'} • blockhead state channel state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadStateChannelStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
