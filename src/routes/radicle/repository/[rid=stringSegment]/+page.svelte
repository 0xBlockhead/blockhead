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


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.RadicleRepository, data.selector)}
		<title>{data?.title ?? 'radicle repository'} • radicle repository • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'radicle repository'} • radicle repository • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.RadicleRepository, data.selector)}

	<RadicleRepositoryView
		selection={pageSelection}
	/>
	{/if}
</Page>
