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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBigMapView from '$/views/TezosBigMapView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBigMap, data.selector))}
			<title>{data?.title ?? 'tezos big map'} • tezos big map • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos big map'} • tezos big map • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBigMap, data.selector))}

		<TezosBigMapView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
