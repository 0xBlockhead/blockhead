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
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'YouTube channels',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading YouTube channels...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeChannels-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubeChannel>
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
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					title: true,
					channelId: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeChannel}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(youtubeChannels)}
			{@const uniqueYoutubeChannels = [...new Map(youtubeChannels.values.map((youtubeChannel) => [youtubeChannel[EntityMetaKey.SelectorKey], youtubeChannel])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeChannel}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubeChannels.values.length === uniqueYoutubeChannels.length && youtubeChannels.totalCount != null && youtubeChannels.totalCount >= uniqueYoutubeChannels.length ? youtubeChannels.totalCount : uniqueYoutubeChannels.length}
				getKey={(youtubeChannel) => youtubeChannel[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubeChannels}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube channels yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubeChannel }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubeChannel> })}
					<EntityView
						entityType={EntityType.YoutubeChannel}
						entitySelector={youtubeChannel.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const title0 = ({ ...youtubeChannel.entitySelector, ...youtubeChannel }).title}
							{String((title0) ?? '')}
							{@const channelId1 = ({ ...youtubeChannel.entitySelector, ...youtubeChannel }).channelId}
							<TruncatedValue value={String(channelId1)} />
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.YoutubeChannel}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
