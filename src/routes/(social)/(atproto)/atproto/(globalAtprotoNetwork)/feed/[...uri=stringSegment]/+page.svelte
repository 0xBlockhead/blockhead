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

	const pageSelection = $derived(select(EntityType.AtprotoFeedGenerator, {
		uri: decodeURIComponent(params.uri),
	}, {
		sources: [
			Source.Atproto_Xrpc,
			Source.Atproto_BskySocial_Xrpc,
		],
		fields: {
			displayName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoFeedGeneratorView from '$/views/AtprotoFeedGeneratorView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.uri ?? '') || 'AT Protocol feed generator' : pageSelection.entity.displayName || pageSelection.entitySelector.uri || 'AT Protocol feed generator'} • AT Protocol feed generator • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoFeedGeneratorView
		selection={pageSelection}
	/>
</Page>
