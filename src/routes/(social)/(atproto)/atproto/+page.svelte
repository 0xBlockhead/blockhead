<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType._GlobalAtprotoNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			relationshipModel: true,
			homeUrl: true,
			docsUrl: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.protocolName) ?? '')].filter(Boolean).join(' ') || [String(('AT Protocol') ?? '')].filter(Boolean).join(' ') || 'AT Protocol' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).protocolName) ?? '')].filter(Boolean).join(' ') || [String(('AT Protocol') ?? '')].filter(Boolean).join(' ') || 'AT Protocol')))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalAtprotoNetworkView from '$/views/_GlobalAtprotoNetworkView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • AT Protocol • Blockhead</title>
</svelte:head>


<Page>
	<GlobalAtprotoNetworkView
		href={resolve('/atproto')}
		selection={pageSelection}
	/>
</Page>
