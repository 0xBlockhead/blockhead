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
		title = 'Blockhead Lightning channel state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningChannelState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLightningChannelState_Timestamp>
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
	import BlockheadLightningChannelState_TimestampView from '$/views/BlockheadLightningChannelState_TimestampView.svelte'
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
					active: true,
					localBalanceSats: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadLightningChannelStateTimestamps)}
			{@const uniqueBlockheadLightningChannelStateTimestamps = [...new Map(blockheadLightningChannelStateTimestamps.values.map((blockheadLightningChannelStateTimestamp) => [blockheadLightningChannelStateTimestamp[EntityMetaKey.SelectorKey], blockheadLightningChannelStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLightningChannelState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLightningChannelStateTimestamps.totalCount}
				getKey={(blockheadLightningChannelStateTimestamp) => blockheadLightningChannelStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLightningChannelStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead Lightning channel state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLightningChannelStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLightningChannelState_Timestamp> })}
					{@const blockheadLightningChannelStateTimestampFields = { ...blockheadLightningChannelStateTimestamp[EntityMetaKey.Selector], ...blockheadLightningChannelStateTimestamp }}
					<BlockheadLightningChannelState_TimestampView
						selection={select(EntityType.BlockheadLightningChannelState_Timestamp, blockheadLightningChannelStateTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadLightningChannelStateTimestampFields}
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
		entityType={EntityType.BlockheadLightningChannelState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
