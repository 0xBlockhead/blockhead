<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Channels',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannels-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadStateChannel>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannel}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				id: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadStateChannels) => [...new Map(blockheadStateChannels.values.map((blockheadStateChannel) => [blockheadStateChannel[EntityMetaKey.SelectorKey], blockheadStateChannel])).values()]}
	getKey={(blockheadStateChannel) => blockheadStateChannel[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead state channels yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadStateChannel })}
		{@const blockheadStateChannelFields = { ...blockheadStateChannel[EntityMetaKey.Selector], ...blockheadStateChannel }}
		<EntityView
			entityType={EntityType.BlockheadStateChannel}
			entitySelector={blockheadStateChannel[EntityMetaKey.Selector]}
			href={
				(
					blockheadStateChannel[EntityMetaKey.Selector] != null && 'id' in blockheadStateChannel[EntityMetaKey.Selector]
					&& blockheadStateChannel[EntityMetaKey.Selector].id != null ?
						resolve('/channel/[channelId=stringSegment]', {
					channelId: String(blockheadStateChannel[EntityMetaKey.Selector].id ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadStateChannelFields.id) ?? '')].filter(Boolean).join(' ') || 'blockhead state channel'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadStateChannelFields.createdAt) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
