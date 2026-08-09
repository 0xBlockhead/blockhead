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

	const pageSelection = $derived(select(EntityType.AiModelProvider, {
		domain: params.domain,
	}, {
		fields: {
			label: true,
			providerId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.domain ?? '') || 'AI model provider' : (pageSelection.entity.label ?? '') || [pageSelection.entity.providerId, pageSelection.entitySelector.domain].filter(Boolean).join(' ') || 'AI model provider'} • AI model provider • Blockhead</title>
</svelte:head>


<Page>
	<AiModelProviderView
		selection={pageSelection}
	/>
</Page>
