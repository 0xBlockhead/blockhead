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
	import GlobalYoutubeNetworkView from '$/views/_GlobalYoutubeNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType._GlobalYoutubeNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
				}))}
			<title>{data?.title ?? 'YouTube'} • YouTube network • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'YouTube network'} • YouTube network • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType._GlobalYoutubeNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
				}))}

		<GlobalYoutubeNetworkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
