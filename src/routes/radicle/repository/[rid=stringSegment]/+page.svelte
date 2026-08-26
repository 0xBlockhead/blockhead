<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RadicleRepository, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'radicle repository'} • radicle repository • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'radicle repository'} • radicle repository • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RadicleRepositoryView
		selection={pageSelection}
	/>
	{/if}
</Page>
