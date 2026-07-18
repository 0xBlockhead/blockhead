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

	const pageSelection = $derived(select(EntityType.CardanoDRep, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
		fields: {
			credentialKind: true,
			anchorUrl: true,
			anchorHash: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.drepCredential) ?? '')].filter(Boolean).join(' ') || 'Cardano DRep' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).drepCredential) ?? '')].filter(Boolean).join(' ') || 'Cardano DRep')))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Cardano DRep • Blockhead</title>
</svelte:head>


<Page>
	<CardanoDRepView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
				network: params.network,
				drepCredential: params.drepCredential,
			})
		}
		selection={pageSelection}
	/>
</Page>
