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
		title = 'Zero g consensus network observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGConsensusNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ZeroGConsensusNetwork_Timestamp>
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
	import ZeroGConsensusNetwork_TimestampView from '$/views/ZeroGConsensusNetwork_TimestampView.svelte'
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
					$consensusNetwork: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(zeroGConsensusNetworkTimestamps)}
			{@const uniqueZeroGConsensusNetworkTimestamps = [...new Map(zeroGConsensusNetworkTimestamps.values.map((zeroGConsensusNetworkTimestamp) => [zeroGConsensusNetworkTimestamp[EntityMetaKey.SelectorKey], zeroGConsensusNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={zeroGConsensusNetworkTimestamps.totalCount}
				getKey={(zeroGConsensusNetworkTimestamp) => zeroGConsensusNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueZeroGConsensusNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Zero g consensus network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: zeroGConsensusNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ZeroGConsensusNetwork_Timestamp> })}
					{@const zeroGConsensusNetworkTimestampFields = { ...zeroGConsensusNetworkTimestamp[EntityMetaKey.Selector], ...zeroGConsensusNetworkTimestamp }}
					<ZeroGConsensusNetwork_TimestampView
						selection={select(EntityType.ZeroGConsensusNetwork_Timestamp, zeroGConsensusNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={zeroGConsensusNetworkTimestampFields}
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
		entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
