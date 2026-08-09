<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.TokenMetadataDocument, {
		metadataSubjectKey: params.metadataSubjectKey,
		metadataKey: params.metadataKey,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			name: true,
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TokenMetadataDocumentView from '$/views/TokenMetadataDocumentView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.metadataKey ?? '') || 'token metadata document' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.symbol ?? ''), pageSelection.entitySelector.metadataKey].filter(Boolean).join(' ') || 'token metadata document'} • token metadata document • Blockhead</title>
</svelte:head>


<Page>
	<TokenMetadataDocumentView
		selection={pageSelection}
	/>
</Page>
