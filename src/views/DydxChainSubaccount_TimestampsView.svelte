<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'dYdX chain subaccount observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DydxChainSubaccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.DydxChainSubaccount_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainSubaccount_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				timestampMs: true,
				$subaccount: true,
			},
		})
	}
	{countResource}
	getResourceItems={(dydxChainSubaccountTimestamps) => [...new Map(dydxChainSubaccountTimestamps.values.map((dydxChainSubaccountTimestamp) => [dydxChainSubaccountTimestamp[EntityMetaKey.SelectorKey], dydxChainSubaccountTimestamp])).values()]}
	getKey={(dydxChainSubaccountTimestamp) => dydxChainSubaccountTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dydx chain subaccount observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: dydxChainSubaccountTimestamp })}
		{@const dydxChainSubaccountTimestampFields = { ...dydxChainSubaccountTimestamp[EntityMetaKey.Selector], ...dydxChainSubaccountTimestamp }}
		<EntityView
			entityType={EntityType.DydxChainSubaccount_Timestamp}
			entitySelector={dydxChainSubaccountTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((dydxChainSubaccountTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'dydx chain subaccount timestamp'}
			{/snippet}

			{#snippet Value()}
				{[[[String((dydxChainSubaccountTimestampFields.$subaccount.$account.address) ?? '')].filter(Boolean).join(' ') || 'Cosmos account'].filter(Boolean).join(' ') || 'dydx chain subaccount'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
