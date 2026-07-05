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
		title = 'Blockhead transfer intents',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadTransferIntents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadTransferIntent>
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
	import BlockheadTransferIntentView from '$/views/BlockheadTransferIntentView.svelte'
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
					$sessionAction: true,
					amount: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadTransferIntents)}
			{@const uniqueBlockheadTransferIntents = [...new Map(blockheadTransferIntents.values.map((blockheadTransferIntent) => [blockheadTransferIntent[EntityMetaKey.SelectorKey], blockheadTransferIntent])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadTransferIntent}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadTransferIntents.totalCount}
				getKey={(blockheadTransferIntent) => blockheadTransferIntent[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadTransferIntents}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead transfer intents yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadTransferIntent }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadTransferIntent> })}
					{@const blockheadTransferIntentFields = { ...blockheadTransferIntent[EntityMetaKey.Selector], ...blockheadTransferIntent }}
					<BlockheadTransferIntentView
						selection={select(EntityType.BlockheadTransferIntent, blockheadTransferIntent[EntityMetaKey.Selector])}
						prefetched={blockheadTransferIntentFields}
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
		entityType={EntityType.BlockheadTransferIntent}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
