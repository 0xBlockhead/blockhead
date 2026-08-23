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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ComplianceModuleView from '$/views/ComplianceModuleView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ComplianceModule, {
				$profile: data.selector,
				moduleKey: params.moduleKey,
			})}
		<title>{data?.title ?? 'compliance module'} • compliance module • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'compliance module'} • compliance module • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ComplianceModule, {
				$profile: data.selector,
				moduleKey: params.moduleKey,
			})}

	<ComplianceModuleView
		selection={pageSelection}
	/>
	{/if}
</Page>
