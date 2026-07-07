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
		title = 'Blockhead Radicle sync sessions',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRadicleSyncSessions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadRadicleSyncSession>
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
	import BlockheadRadicleSyncSessionView from '$/views/BlockheadRadicleSyncSessionView.svelte'
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
					sessionId: true,
					status: true,
					startedAt: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadRadicleSyncSession}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadRadicleSyncSessions)}
			{@const uniqueBlockheadRadicleSyncSessions = [...new Map(blockheadRadicleSyncSessions.values.map((blockheadRadicleSyncSession) => [blockheadRadicleSyncSession[EntityMetaKey.SelectorKey], blockheadRadicleSyncSession])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadRadicleSyncSession}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadRadicleSyncSessions.totalCount}
				getKey={(blockheadRadicleSyncSession) => blockheadRadicleSyncSession[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadRadicleSyncSessions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead radicle sync sessions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadRadicleSyncSession }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadRadicleSyncSession> })}
					{@const blockheadRadicleSyncSessionFields = { ...blockheadRadicleSyncSession[EntityMetaKey.Selector], ...blockheadRadicleSyncSession }}
					<BlockheadRadicleSyncSessionView
						selection={select(EntityType.BlockheadRadicleSyncSession, blockheadRadicleSyncSession[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadRadicleSyncSessionFields}
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
		entityType={EntityType.BlockheadRadicleSyncSession}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
