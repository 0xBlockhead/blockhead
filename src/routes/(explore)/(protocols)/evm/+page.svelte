<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmProtocolView from '$/views/EvmProtocolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmProtocol, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						protocolName: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'EVM protocol' : pageSelection.entity.protocolName || 'EVM protocol')} • EVM protocol • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EVM protocol'} • EVM protocol • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmProtocol, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						protocolName: true,
					},
				}))}

		<EvmProtocolView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
