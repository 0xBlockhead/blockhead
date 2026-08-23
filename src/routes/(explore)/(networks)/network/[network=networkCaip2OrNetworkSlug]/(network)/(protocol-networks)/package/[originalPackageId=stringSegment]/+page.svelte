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
	import SuiPackageView from '$/views/SuiPackageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiPackage, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.originalPackageId || 'Sui package')} • Sui package • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui package'} • Sui package • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiPackage, data.selector)}

	<SuiPackageView
		selection={pageSelection}
	/>
	{/if}
</Page>
