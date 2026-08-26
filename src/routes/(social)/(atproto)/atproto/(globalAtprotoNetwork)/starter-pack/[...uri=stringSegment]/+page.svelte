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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AtprotoStarterPack, {
		uri: decodeURIComponent(params.uri),
	}, {
		sources: [
			Source.Atproto_Xrpc,
			Source.Atproto_BskySocial_Xrpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoStarterPackView from '$/views/AtprotoStarterPackView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.uri || 'AT Protocol starter pack'} • AT Protocol starter pack • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoStarterPackView
		selection={pageSelection}
	/>
</Page>
