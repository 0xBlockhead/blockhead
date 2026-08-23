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
	import XNetworkView from '$/views/XNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						protocolName: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'X' : pageSelection.entity.protocolName || 'X')} • X • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'X'} • X • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						protocolName: true,
					},
				}))}

		<XNetworkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
