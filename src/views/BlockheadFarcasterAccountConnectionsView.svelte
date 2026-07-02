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
		placeholderText = 'Loading Blockhead Farcaster account connections...',
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
			selection.sources == null ? selection({
				fields: {
					$icon: true,
					displayName: true,
					username: true,
					fid: true,
				},
			}) : selection
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
				totalCount={blockheadFarcasterAccountConnections.values.length === uniqueBlockheadFarcasterAccountConnections.length && blockheadFarcasterAccountConnections.totalCount != null && blockheadFarcasterAccountConnections.totalCount >= uniqueBlockheadFarcasterAccountConnections.length ? blockheadFarcasterAccountConnections.totalCount : uniqueBlockheadFarcasterAccountConnections.length}
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
					<BlockheadFarcasterAccountConnectionView
						selection={select(EntityType.BlockheadFarcasterAccountConnection, blockheadFarcasterAccountConnection.entitySelector)}
						prefetched={blockheadFarcasterAccountConnection}
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
