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
			displayName: true,
			credentialKind: true,
			anchorUrl: true,
			anchorHash: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.drepCredential) ?? '')].filter(Boolean).join(' ') || 'Cardano DRep' : [String((({ ...data.selector, ...pageSelection.entity }).displayName) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).drepCredential) ?? '')].filter(Boolean).join(' ') || 'Cardano DRep'))} • Cardano DRep • Blockhead</title>
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
