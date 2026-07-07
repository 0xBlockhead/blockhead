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
		title = 'Blockhead Farcaster account connections',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFarcasterAccountConnections-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
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
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
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
					$icon: true,
					displayName: true,
					username: true,
					fid: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadFarcasterAccountConnection}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadFarcasterAccountConnections)}
			{@const uniqueBlockheadFarcasterAccountConnections = [...new Map(blockheadFarcasterAccountConnections.values.map((blockheadFarcasterAccountConnection) => [blockheadFarcasterAccountConnection[EntityMetaKey.SelectorKey], blockheadFarcasterAccountConnection])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadFarcasterAccountConnection}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadFarcasterAccountConnections.totalCount}
				getKey={(blockheadFarcasterAccountConnection) => blockheadFarcasterAccountConnection[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadFarcasterAccountConnections}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead Farcaster account connections yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadFarcasterAccountConnection }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadFarcasterAccountConnection> })}
					{@const blockheadFarcasterAccountConnectionFields = { ...blockheadFarcasterAccountConnection[EntityMetaKey.Selector], ...blockheadFarcasterAccountConnection }}
					<BlockheadFarcasterAccountConnectionView
						selection={select(EntityType.BlockheadFarcasterAccountConnection, blockheadFarcasterAccountConnection[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadFarcasterAccountConnectionFields}
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
		entityType={EntityType.BlockheadFarcasterAccountConnection}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
