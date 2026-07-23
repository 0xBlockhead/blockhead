<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType._GlobalActivityPubNetwork, data.selector, {
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
	<title>{(data.title ?? (pageSelection.entity == null ? 'global ActivityPub network' : 'global ActivityPub network'))} • global ActivityPub network • Blockhead</title>
</svelte:head>


<Page>
	<GlobalActivityPubNetworkView
		href={resolve('/activitypub')}
		selection={pageSelection}
	/>
</Page>
