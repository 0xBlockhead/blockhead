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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AtprotoGraphList, {
		uri: decodeURIComponent(params.uri),
	}, {
		sources: [
			Source.Atproto_Xrpc,
			Source.Atproto_BskySocial_Xrpc,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoGraphListView from '$/views/AtprotoGraphListView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'AT Protocol graph list' : pageSelection.entity.name || 'AT Protocol graph list'} • AT Protocol graph list • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoGraphListView
		selection={pageSelection}
	/>
</Page>
