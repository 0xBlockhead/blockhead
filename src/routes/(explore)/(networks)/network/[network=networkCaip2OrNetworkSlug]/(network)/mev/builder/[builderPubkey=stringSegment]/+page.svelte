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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MevBuilder, data.selector))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.builderPubkey) ?? '')].filter(Boolean).join(' ') || 'MEV builder' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).builderPubkey) ?? '')].filter(Boolean).join(' ') || 'MEV builder')))


	// Components
	import Page from '$/components/Page.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • MEV builder • Blockhead</title>
</svelte:head>


<Page>
	<MevBuilderView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
				network: params.network,
				builderPubkey: params.builderPubkey,
			})
		}
		selection={pageSelection}
	/>
</Page>
