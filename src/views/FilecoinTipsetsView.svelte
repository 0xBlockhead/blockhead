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
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Filecoin tipsets',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinTipsets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FilecoinTipset>
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
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
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
				sources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
				fields: {
					height: true,
					tipsetKey: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(filecoinTipsets)}
			{@const uniqueFilecoinTipsets = [...new Map(filecoinTipsets.values.map((filecoinTipset) => [filecoinTipset[EntityMetaKey.SelectorKey], filecoinTipset])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FilecoinTipset}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={filecoinTipsets.totalCount}
				getKey={(filecoinTipset) => filecoinTipset[EntityMetaKey.SelectorKey]}
				items={uniqueFilecoinTipsets}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Filecoin tipsets yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: filecoinTipset }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.FilecoinTipset> })}
					{@const filecoinTipsetFields = { ...filecoinTipset[EntityMetaKey.Selector], ...filecoinTipset }}
					<FilecoinTipsetView
						selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
						prefetched={filecoinTipsetFields}
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
		entityType={EntityType.FilecoinTipset}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
