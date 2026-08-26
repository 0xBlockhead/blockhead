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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CelestiaNamespace, data.selector, {
		sources: [
			Source.Celenium_Rest,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaNamespaceView from '$/views/CelestiaNamespaceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.namespaceId ?? '') || 'celestia namespace' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.namespaceId || 'celestia namespace')} • celestia namespace • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'celestia namespace'} • celestia namespace • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CelestiaNamespaceView
		selection={pageSelection}
	/>
	{/if}
</Page>
