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
		title = 'Elements issuances',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ElementsIssuances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ElementsIssuance>
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
	import ElementsIssuanceView from '$/views/ElementsIssuanceView.svelte'
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
					inputIndex: true,
					$asset: true,
					$reissuanceTokenAsset: true,
					isReissuance: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(elementsIssuances)}
			{@const uniqueElementsIssuances = [...new Map(elementsIssuances.values.map((elementsIssuance) => [elementsIssuance[EntityMetaKey.SelectorKey], elementsIssuance])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ElementsIssuance}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={elementsIssuances.totalCount}
				getKey={(elementsIssuance) => elementsIssuance[EntityMetaKey.SelectorKey]}
				items={uniqueElementsIssuances}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Elements issuances yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: elementsIssuance }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ElementsIssuance> })}
					{@const elementsIssuanceFields = { ...elementsIssuance[EntityMetaKey.Selector], ...elementsIssuance }}
					<ElementsIssuanceView
						selection={select(EntityType.ElementsIssuance, elementsIssuance[EntityMetaKey.Selector])}
						prefetched={elementsIssuanceFields}
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
		entityType={EntityType.ElementsIssuance}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
