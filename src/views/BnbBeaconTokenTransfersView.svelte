<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BnbBeaconTokenTransfer>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BnbBeaconTokenTransferView from '$/views/BnbBeaconTokenTransferView.svelte'
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
		{@const selection = select(EntityType.BnbBeaconTokenTransfer, bnbBeaconTokenTransfer[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BnbBeaconTokenTransferView
			selection={selection}
			prefetched={bnbBeaconTokenTransferFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
