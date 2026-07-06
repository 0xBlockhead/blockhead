<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
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
	<title>Nostr • Blockhead</title>
</svelte:head>


<Page>
	<GlobalNostrNetworkView
		href={resolve('/(social)/(nostr)/nostr')}
		selection={
			select(EntityType._GlobalNostrNetwork, data.selector, {
				fields: {
					registryName: true,
					protocolName: true,
					homeUrl: true,
					docsUrl: true,
					relationshipModel: true,
				},
			})
		}
	/>
</Page>
