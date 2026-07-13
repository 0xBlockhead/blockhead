<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MevRelay, data.selector, {
		fields: {
			url: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.host) ?? '')].filter(Boolean).join(' ') || 'MEV relay' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).host) ?? '')].filter(Boolean).join(' ') || 'MEV relay')))


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • MEV relay • Blockhead</title>
</svelte:head>


<Page>
	<MevRelayView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]', {
				network: params.network,
				host: params.host,
			})
		}
		selection={pageSelection}
	/>
</Page>
