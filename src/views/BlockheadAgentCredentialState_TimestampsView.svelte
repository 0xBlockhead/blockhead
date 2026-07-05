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
		title = 'Blockhead agent credential state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentCredentialState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadAgentCredentialState_Timestamp>
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
	import BlockheadAgentCredentialState_TimestampView from '$/views/BlockheadAgentCredentialState_TimestampView.svelte'
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
					timestampMs: true,
					status: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadAgentCredentialStateTimestamps)}
			{@const uniqueBlockheadAgentCredentialStateTimestamps = [...new Map(blockheadAgentCredentialStateTimestamps.values.map((blockheadAgentCredentialStateTimestamp) => [blockheadAgentCredentialStateTimestamp[EntityMetaKey.SelectorKey], blockheadAgentCredentialStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAgentCredentialState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadAgentCredentialStateTimestamps.totalCount}
				getKey={(blockheadAgentCredentialStateTimestamp) => blockheadAgentCredentialStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadAgentCredentialStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead agent credential state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadAgentCredentialStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadAgentCredentialState_Timestamp> })}
					{@const blockheadAgentCredentialStateTimestampFields = { ...blockheadAgentCredentialStateTimestamp[EntityMetaKey.Selector], ...blockheadAgentCredentialStateTimestamp }}
					<BlockheadAgentCredentialState_TimestampView
						selection={select(EntityType.BlockheadAgentCredentialState_Timestamp, blockheadAgentCredentialStateTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadAgentCredentialStateTimestampFields}
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
		entityType={EntityType.BlockheadAgentCredentialState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
