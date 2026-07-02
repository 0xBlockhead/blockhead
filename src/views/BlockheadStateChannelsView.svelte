<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'Channels',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Blockhead state channels...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannels-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadStateChannel>
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
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
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
					id: true,
					createdAt: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadStateChannel}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(blockheadStateChannels)}
			{@const uniqueBlockheadStateChannels = [...new Map(blockheadStateChannels.values.map((blockheadStateChannel) => [blockheadStateChannel[EntityMetaKey.SelectorKey], blockheadStateChannel])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadStateChannel}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadStateChannels.values.length === uniqueBlockheadStateChannels.length && blockheadStateChannels.totalCount != null && blockheadStateChannels.totalCount >= uniqueBlockheadStateChannels.length ? blockheadStateChannels.totalCount : uniqueBlockheadStateChannels.length}
				getKey={(blockheadStateChannel) => blockheadStateChannel[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadStateChannels}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No blockhead state channels yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadStateChannel }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadStateChannel> })}
					<BlockheadStateChannelView
						href={
							resolve('/channel/[channelId]', {
								channelId: String(({ ...blockheadStateChannel.entitySelector, ...blockheadStateChannel }).id),
							})
						}
						selection={select(EntityType.BlockheadStateChannel, blockheadStateChannel.entitySelector)}
						prefetched={blockheadStateChannel}
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
		entityType={EntityType.BlockheadStateChannel}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
