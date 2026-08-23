<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiModelProvider, data.selector, {
					fields: {
						label: true,
						domain: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.providerId ?? '') || 'AI model provider' : (pageSelection.entity.label ?? '') || [(pageSelection.entitySelector.providerId ?? ''), (pageSelection.entity.domain ?? '')].filter(Boolean).join(' ') || 'AI model provider')} • AI model provider • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'AI model provider'} • AI model provider • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiModelProvider, data.selector, {
					fields: {
						label: true,
						domain: true,
					},
				}))}

		<AiModelProviderView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
