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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalRedditNetwork, data.selector, {
		sources: [
			Source.Reddit_PublicJson,
			Source.Reddit_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalRedditNetworkView from '$/views/_GlobalRedditNetworkView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Reddit'} • Reddit • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Reddit'} • Reddit • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalRedditNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
