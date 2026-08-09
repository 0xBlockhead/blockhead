<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.CardanoCertificate, {
		$transaction: data.selector,
		certificateIndex: Number(params.certificateIndex),
	}, {
		fields: {
			certificateKind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoCertificateView from '$/views/CardanoCertificateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Certificate #' + String(pageSelection.entitySelector.certificateIndex ?? '') : [pageSelection.entity.certificateKind, 'Certificate #' + String(pageSelection.entitySelector.certificateIndex)].filter(Boolean).join(' ') || 'Cardano certificate')} • Cardano certificate • Blockhead</title>
</svelte:head>


<Page>
	<CardanoCertificateView
		selection={pageSelection}
	/>
</Page>
