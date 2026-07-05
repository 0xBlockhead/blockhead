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
		title = 'Elements networks',
		typeAnnotationParagraphs = ['Elements/Liquid-specific view over a canonical Network row, including federation metadata, settlement network, native asset, and registry assets.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ElementsNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ElementsNetwork>
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
	import ElementsNetworkView from '$/views/ElementsNetworkView.svelte'
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
					$network: true,
					federationName: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(elementsNetworks)}
			{@const uniqueElementsNetworks = [...new Map(elementsNetworks.values.map((elementsNetwork) => [elementsNetwork[EntityMetaKey.SelectorKey], elementsNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ElementsNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={elementsNetworks.totalCount}
				getKey={(elementsNetwork) => elementsNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueElementsNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Elements networks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: elementsNetwork }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ElementsNetwork> })}
					{@const elementsNetworkFields = { ...elementsNetwork[EntityMetaKey.Selector], ...elementsNetwork }}
					<ElementsNetworkView
						selection={select(EntityType.ElementsNetwork, elementsNetwork[EntityMetaKey.Selector])}
						prefetched={elementsNetworkFields}
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
		entityType={EntityType.ElementsNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
