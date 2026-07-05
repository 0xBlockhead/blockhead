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
		title = 'Blockhead intent invocations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadIntentInvocations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadIntentInvocation>
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
	import BlockheadIntentInvocationView from '$/views/BlockheadIntentInvocationView.svelte'
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
					modality: true,
					resolvedIntentType: true,
					createdAt: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadIntentInvocations)}
			{@const uniqueBlockheadIntentInvocations = [...new Map(blockheadIntentInvocations.values.map((blockheadIntentInvocation) => [blockheadIntentInvocation[EntityMetaKey.SelectorKey], blockheadIntentInvocation])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadIntentInvocation}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadIntentInvocations.totalCount}
				getKey={(blockheadIntentInvocation) => blockheadIntentInvocation[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadIntentInvocations}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead intent invocations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadIntentInvocation }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadIntentInvocation> })}
					{@const blockheadIntentInvocationFields = { ...blockheadIntentInvocation[EntityMetaKey.Selector], ...blockheadIntentInvocation }}
					<BlockheadIntentInvocationView
						selection={select(EntityType.BlockheadIntentInvocation, blockheadIntentInvocation[EntityMetaKey.Selector])}
						prefetched={blockheadIntentInvocationFields}
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
		entityType={EntityType.BlockheadIntentInvocation}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
