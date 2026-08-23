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
	import ZeroGNetworkView from '$/views/ZeroGNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'zero g network' : pageSelection.entity.name || 'zero g network')} • zero g network • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'zero g network'} • zero g network • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						name: true,
					},
				}))}

		<ZeroGNetworkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
