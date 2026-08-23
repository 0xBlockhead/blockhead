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
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LensAccount, data.selector, {
				sources: [
					Source.Lens_Graphql,
				],
				fields: {
					displayName: true,
					localName: true,
					legacyProfileId: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.address ?? '') || 'Lens account' : [(pageSelection.entity.displayName ?? ''), (pageSelection.entity.localName ?? ''), pageSelection.entitySelector.address, (pageSelection.entity.legacyProfileId ?? '')].filter(Boolean).join(' ') || 'Lens account')} • Lens account • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lens account'} • Lens account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LensAccount, data.selector, {
				sources: [
					Source.Lens_Graphql,
				],
				fields: {
					displayName: true,
					localName: true,
					legacyProfileId: true,
				},
			})}

	<LensAccountView
		selection={pageSelection}
	/>
	{/if}
</Page>
