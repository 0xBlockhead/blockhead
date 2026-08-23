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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SuiObject, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiObjectView from '$/views/SuiObjectView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.objectId || 'Sui object')} • Sui object • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui object'} • Sui object • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SuiObjectView
		selection={pageSelection}
	/>
	{/if}
</Page>
