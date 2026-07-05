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
		title = 'Blockhead agent provider calls',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentProviderCalls-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadAgentProviderCall>
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
	import BlockheadAgentProviderCallView from '$/views/BlockheadAgentProviderCallView.svelte'
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
					indexInTurn: true,
					status: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadAgentProviderCalls)}
			{@const uniqueBlockheadAgentProviderCalls = [...new Map(blockheadAgentProviderCalls.values.map((blockheadAgentProviderCall) => [blockheadAgentProviderCall[EntityMetaKey.SelectorKey], blockheadAgentProviderCall])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAgentProviderCall}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadAgentProviderCalls.totalCount}
				getKey={(blockheadAgentProviderCall) => blockheadAgentProviderCall[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadAgentProviderCalls}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead agent provider calls yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadAgentProviderCall }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadAgentProviderCall> })}
					{@const blockheadAgentProviderCallFields = { ...blockheadAgentProviderCall[EntityMetaKey.Selector], ...blockheadAgentProviderCall }}
					<BlockheadAgentProviderCallView
						selection={select(EntityType.BlockheadAgentProviderCall, blockheadAgentProviderCall[EntityMetaKey.Selector])}
						prefetched={blockheadAgentProviderCallFields}
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
		entityType={EntityType.BlockheadAgentProviderCall}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
