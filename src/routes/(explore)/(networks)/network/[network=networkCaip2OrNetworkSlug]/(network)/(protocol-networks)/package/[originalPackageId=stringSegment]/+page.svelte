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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SuiPackage, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiPackageView from '$/views/SuiPackageView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.originalPackageId || 'Sui package')} • Sui package • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui package'} • Sui package • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SuiPackageView
		selection={pageSelection}
	/>
	{/if}
</Page>
