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


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalActivityPubNetworkView from '$/views/_GlobalActivityPubNetworkView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'global ActivityPub network'} • global ActivityPub network • Blockhead</title>
</svelte:head>


<Page>
	<GlobalActivityPubNetworkView
		selection={
			select(EntityType._GlobalActivityPubNetwork, data.selector, {
				sources: [
					Source.Constants_Internal,
					Source.Mastodon_Rest,
				],
			})
		}
	/>
</Page>
