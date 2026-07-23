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

	const pageSelection = $derived(select(EntityType.LightningNode, data.selector, {
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node' : [String((({ ...data.selector, ...pageSelection.entity }).publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node'))} • Lightning node • Blockhead</title>
</svelte:head>


<Page>
	<LightningNodeView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
				network: params.network,
				pubkey: params.pubkey,
			})
		}
		selection={pageSelection}
	/>
</Page>
