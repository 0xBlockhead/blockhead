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
	import GlobalRedditNetworkView from '$/views/_GlobalRedditNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType._GlobalRedditNetwork, data.selector, {
					sources: [
						Source.Reddit_PublicJson,
						Source.Reddit_Rest,
					],
				}))}
			<title>{data?.title ?? 'Reddit'} • Reddit • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Reddit'} • Reddit • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType._GlobalRedditNetwork, data.selector, {
					sources: [
						Source.Reddit_PublicJson,
						Source.Reddit_Rest,
					],
				}))}

		<GlobalRedditNetworkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
