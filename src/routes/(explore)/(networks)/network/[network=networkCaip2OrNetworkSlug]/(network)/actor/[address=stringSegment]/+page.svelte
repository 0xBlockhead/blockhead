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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FilecoinActor, data.selector, {
		sources: [
			Source.Lotus_JsonRpc,
		],
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.address) ?? '')].filter(Boolean).join(' ') || 'filecoin actor' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'filecoin actor')))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • filecoin actor • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinActorView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
				network: params.network,
				address: params.address,
			})
		}
		selection={pageSelection}
	/>
</Page>
