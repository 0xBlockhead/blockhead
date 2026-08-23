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
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EnsName, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.name || 'ENS name')} • ENS name • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ENS name'} • ENS name • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EnsName, data.selector)}

	<EnsNameView
		selection={pageSelection}
	/>
	{/if}
</Page>
