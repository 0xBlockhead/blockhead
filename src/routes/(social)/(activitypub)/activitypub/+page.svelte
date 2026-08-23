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
	import GlobalActivityPubNetworkView from '$/views/_GlobalActivityPubNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType._GlobalActivityPubNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
						Source.Mastodon_Rest,
					],
				}))}
			<title>{data?.title ?? 'global ActivityPub network'} • global ActivityPub network • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'global ActivityPub network'} • global ActivityPub network • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType._GlobalActivityPubNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
						Source.Mastodon_Rest,
					],
				}))}

		<GlobalActivityPubNetworkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
