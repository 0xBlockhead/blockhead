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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ComplianceModule, {
		$profile: data.selector,
		moduleKey: params.moduleKey,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ComplianceModuleView from '$/views/ComplianceModuleView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'compliance module'} • compliance module • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'compliance module'} • compliance module • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ComplianceModuleView
		selection={pageSelection}
	/>
	{/if}
</Page>
