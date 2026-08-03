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
	import GlobalNostrNetworkView from '$/views/_GlobalNostrNetworkView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Nostr'} • Nostr • Blockhead</title>
</svelte:head>


<Page>
	<GlobalNostrNetworkView
		selection={
			select(EntityType._GlobalNostrNetwork, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
	/>
</Page>
