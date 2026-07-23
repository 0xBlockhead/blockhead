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
		title = 'Bnb beacon token transfers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconTokenTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BnbBeaconTokenTransfer>
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
	entityType={EntityType.BnbBeaconTokenTransfer}
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
				symbol: true,
				amount: true,
				$transaction: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bnbBeaconTokenTransfers) => [...new Map(bnbBeaconTokenTransfers.values.map((bnbBeaconTokenTransfer) => [bnbBeaconTokenTransfer[EntityMetaKey.SelectorKey], bnbBeaconTokenTransfer])).values()]}
	getKey={(bnbBeaconTokenTransfer) => bnbBeaconTokenTransfer[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bnb beacon token transfers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bnbBeaconTokenTransfer })}
		{@const bnbBeaconTokenTransferFields = { ...bnbBeaconTokenTransfer[EntityMetaKey.Selector], ...bnbBeaconTokenTransfer }}
		<EntityView
			entityType={EntityType.BnbBeaconTokenTransfer}
			entitySelector={bnbBeaconTokenTransfer[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bnbBeaconTokenTransferFields.symbol) ?? '')].filter(Boolean).join(' ') || 'bnb beacon token transfer'}
			{/snippet}

			{#snippet Value()}
				{[String((bnbBeaconTokenTransferFields.amount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((bnbBeaconTokenTransferFields.$transaction.txHash) ?? '')].filter(Boolean).join(' ') || 'bnb beacon transaction'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
