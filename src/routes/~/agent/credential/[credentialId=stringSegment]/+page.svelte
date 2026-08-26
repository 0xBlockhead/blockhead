<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadAgentCredentialState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentCredentialStateView from '$/views/BlockheadAgentCredentialStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.credentialId ?? '') || 'blockhead agent credential state' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.credentialId || 'blockhead agent credential state')} • blockhead agent credential state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead agent credential state'} • blockhead agent credential state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadAgentCredentialStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
