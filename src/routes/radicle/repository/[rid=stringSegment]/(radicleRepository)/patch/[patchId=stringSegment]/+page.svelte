<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RadiclePatchView from '$/views/RadiclePatchView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RadiclePatch, {
					$repository: data.selector,
					patchId: params.patchId,
				}))}
			<title>{data?.title ?? 'radicle patch'} • radicle patch • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'radicle patch'} • radicle patch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RadiclePatch, {
					$repository: data.selector,
					patchId: params.patchId,
				}))}

		<RadiclePatchView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
