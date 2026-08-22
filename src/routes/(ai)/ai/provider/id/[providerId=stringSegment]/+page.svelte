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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AiModelProvider, data.selector, {
		fields: {
			label: true,
			domain: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.providerId ?? '') || 'AI model provider' : (pageSelection.entity.label ?? '') || [(pageSelection.entitySelector.providerId ?? ''), (pageSelection.entity.domain ?? '')].filter(Boolean).join(' ') || 'AI model provider')} • AI model provider • Blockhead</title>
</svelte:head>


<Page>
	<AiModelProviderView
		selection={pageSelection}
	/>
</Page>
