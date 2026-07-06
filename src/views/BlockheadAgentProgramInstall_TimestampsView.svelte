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
		title = 'Blockhead agent program install observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentProgramInstall_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadAgentProgramInstall_Timestamp>
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
	import BlockheadAgentProgramInstall_TimestampView from '$/views/BlockheadAgentProgramInstall_TimestampView.svelte'
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
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAgentProgramInstall_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadAgentProgramInstallTimestamps)}
			{@const uniqueBlockheadAgentProgramInstallTimestamps = [...new Map(blockheadAgentProgramInstallTimestamps.values.map((blockheadAgentProgramInstallTimestamp) => [blockheadAgentProgramInstallTimestamp[EntityMetaKey.SelectorKey], blockheadAgentProgramInstallTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAgentProgramInstall_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadAgentProgramInstallTimestamps.totalCount}
				getKey={(blockheadAgentProgramInstallTimestamp) => blockheadAgentProgramInstallTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadAgentProgramInstallTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead agent program install observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadAgentProgramInstallTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadAgentProgramInstall_Timestamp> })}
					{@const blockheadAgentProgramInstallTimestampFields = { ...blockheadAgentProgramInstallTimestamp[EntityMetaKey.Selector], ...blockheadAgentProgramInstallTimestamp }}
					<BlockheadAgentProgramInstall_TimestampView
						selection={select(EntityType.BlockheadAgentProgramInstall_Timestamp, blockheadAgentProgramInstallTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadAgentProgramInstallTimestampFields}
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
		entityType={EntityType.BlockheadAgentProgramInstall_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
