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
	import CelestiaBlobView from '$/views/CelestiaBlobView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CelestiaBlob, {
					$namespace: data.selector,
					height: BigInt(params.height),
					commitment: params.commitment,
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.commitment || 'celestia blob')} • celestia blob • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'celestia blob'} • celestia blob • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CelestiaBlob, {
					$namespace: data.selector,
					height: BigInt(params.height),
					commitment: params.commitment,
				}))}

		<CelestiaBlobView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
