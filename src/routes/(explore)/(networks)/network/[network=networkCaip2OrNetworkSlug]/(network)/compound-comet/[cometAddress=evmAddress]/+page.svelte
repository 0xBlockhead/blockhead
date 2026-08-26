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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CompoundComet, data.selector, {
		sources: [
			Source.Compound_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CompoundCometView from '$/views/CompoundCometView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Compound Comet market' : pageSelection.entity.name || 'Compound Comet market')} • Compound Comet market • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Compound Comet market'} • Compound Comet market • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CompoundCometView
		selection={pageSelection}
	/>
	{/if}
</Page>
