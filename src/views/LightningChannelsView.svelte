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
		title = 'Lightning channels',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Lightning channels...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LightningChannels-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LightningChannel>
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
	import LightningChannelView from '$/views/LightningChannelView.svelte'
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
					shortChannelId: true,
					$node1: true,
					channelId: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LightningChannel}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(lightningChannels)}
			{@const uniqueLightningChannels = [...new Map(lightningChannels.values.map((lightningChannel) => [lightningChannel[EntityMetaKey.SelectorKey], lightningChannel])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LightningChannel}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={lightningChannels.values.length === uniqueLightningChannels.length && lightningChannels.totalCount != null && lightningChannels.totalCount >= uniqueLightningChannels.length ? lightningChannels.totalCount : uniqueLightningChannels.length}
				getKey={(lightningChannel) => lightningChannel[EntityMetaKey.SelectorKey]}
				items={uniqueLightningChannels}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Lightning channels yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: lightningChannel }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LightningChannel> })}
					<LightningChannelView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
								networkSlug: String(({ ...lightningChannel.entitySelector, ...lightningChannel }).$network.slug),
								channelId: String(({ ...lightningChannel.entitySelector, ...lightningChannel }).channelId),
							})
						}
						selection={select(EntityType.LightningChannel, lightningChannel.entitySelector)}
						prefetched={lightningChannel}
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
		entityType={EntityType.LightningChannel}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
