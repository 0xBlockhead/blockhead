<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentCredentialStateView from '$/views/BlockheadAgentCredentialStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadAgentCredentialState, data.selector, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						label: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.credentialId ?? '') || 'blockhead agent credential state' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.credentialId || 'blockhead agent credential state')} • blockhead agent credential state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead agent credential state'} • blockhead agent credential state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadAgentCredentialState, data.selector, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						label: true,
					},
				}))}

		<BlockheadAgentCredentialStateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
