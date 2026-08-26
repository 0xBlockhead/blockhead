<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalActivityPubNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.Mastodon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalActivityPubNetworkView from '$/views/_GlobalActivityPubNetworkView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'global ActivityPub network'} • global ActivityPub network • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'global ActivityPub network'} • global ActivityPub network • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalActivityPubNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
