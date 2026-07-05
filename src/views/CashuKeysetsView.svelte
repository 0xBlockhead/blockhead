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
		title = 'Cashu keysets',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CashuKeysets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CashuKeyset>
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
	import CashuKeysetView from '$/views/CashuKeysetView.svelte'
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
					keysetId: true,
					unit: true,
					active: true,
					inputFeePpk: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(cashuKeysets)}
			{@const uniqueCashuKeysets = [...new Map(cashuKeysets.values.map((cashuKeyset) => [cashuKeyset[EntityMetaKey.SelectorKey], cashuKeyset])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CashuKeyset}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cashuKeysets.totalCount}
				getKey={(cashuKeyset) => cashuKeyset[EntityMetaKey.SelectorKey]}
				items={uniqueCashuKeysets}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cashu keysets yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cashuKeyset }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CashuKeyset> })}
					{@const cashuKeysetFields = { ...cashuKeyset[EntityMetaKey.Selector], ...cashuKeyset }}
					<CashuKeysetView
						selection={select(EntityType.CashuKeyset, cashuKeyset[EntityMetaKey.Selector])}
						prefetched={cashuKeysetFields}
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
		entityType={EntityType.CashuKeyset}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
