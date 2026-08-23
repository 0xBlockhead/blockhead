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


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoCertificateView from '$/views/CardanoCertificateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoCertificate, {
				$transaction: data.selector,
				certificateIndex: Number(params.certificateIndex),
			}, {
				fields: {
					certificateKind: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Certificate #' + String(pageSelection.entitySelector.certificateIndex ?? '') : [pageSelection.entity.certificateKind, 'Certificate #' + String(pageSelection.entitySelector.certificateIndex)].filter(Boolean).join(' ') || 'Cardano certificate')} • Cardano certificate • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano certificate'} • Cardano certificate • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoCertificate, {
				$transaction: data.selector,
				certificateIndex: Number(params.certificateIndex),
			}, {
				fields: {
					certificateKind: true,
				},
			})}

	<CardanoCertificateView
		selection={pageSelection}
	/>
	{/if}
</Page>
