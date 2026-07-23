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
		title = 'dYdX chain subaccounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DydxChainSubaccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.DydxChainSubaccount>
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
	entityType={EntityType.DydxChainSubaccount}
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
				$account: true,
				subaccountNumber: true,
			},
		})
	}
	{countResource}
	getResourceItems={(dydxChainSubaccounts) => [...new Map(dydxChainSubaccounts.values.map((dydxChainSubaccount) => [dydxChainSubaccount[EntityMetaKey.SelectorKey], dydxChainSubaccount])).values()]}
	getKey={(dydxChainSubaccount) => dydxChainSubaccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dydx chain subaccounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: dydxChainSubaccount })}
		{@const dydxChainSubaccountFields = { ...dydxChainSubaccount[EntityMetaKey.Selector], ...dydxChainSubaccount }}
		<EntityView
			entityType={EntityType.DydxChainSubaccount}
			entitySelector={dydxChainSubaccount[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((dydxChainSubaccountFields.$account.address) ?? '')].filter(Boolean).join(' ') || 'Cosmos account'].filter(Boolean).join(' ') || 'dydx chain subaccount'}
			{/snippet}

			{#snippet Value()}
				{[String((dydxChainSubaccountFields.subaccountNumber) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
