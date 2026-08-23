<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SpecificationRealm, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					label: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.realm ?? '') || 'Specification realm' : pageSelection.entity.label || pageSelection.entitySelector.realm || 'Specification realm')} • Specification realm • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Specification realm'} • Specification realm • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SpecificationRealm, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					label: true,
				},
			})}

	<SpecificationRealmView
		selection={pageSelection}
	/>
	{/if}
</Page>
