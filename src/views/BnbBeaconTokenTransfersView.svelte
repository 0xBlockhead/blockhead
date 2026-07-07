<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bnb beacon token transfers',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconTokenTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BnbBeaconTokenTransfer>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BnbBeaconTokenTransferView from '$/views/BnbBeaconTokenTransferView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					symbol: true,
					amount: true,
					$transaction: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BnbBeaconTokenTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(bnbBeaconTokenTransfers)}
			{@const uniqueBnbBeaconTokenTransfers = [...new Map(bnbBeaconTokenTransfers.values.map((bnbBeaconTokenTransfer) => [bnbBeaconTokenTransfer[EntityMetaKey.SelectorKey], bnbBeaconTokenTransfer])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BnbBeaconTokenTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bnbBeaconTokenTransfers.totalCount}
				getKey={(bnbBeaconTokenTransfer) => bnbBeaconTokenTransfer[EntityMetaKey.SelectorKey]}
				items={uniqueBnbBeaconTokenTransfers}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bnb beacon token transfers yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bnbBeaconTokenTransfer }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BnbBeaconTokenTransfer> })}
					{@const bnbBeaconTokenTransferFields = { ...bnbBeaconTokenTransfer[EntityMetaKey.Selector], ...bnbBeaconTokenTransfer }}
					<BnbBeaconTokenTransferView
						selection={select(EntityType.BnbBeaconTokenTransfer, bnbBeaconTokenTransfer[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={bnbBeaconTokenTransferFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BnbBeaconTokenTransfer}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
