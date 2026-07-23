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
		title = 'Farcaster channel observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterChannel_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterChannel_Timestamp>
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
	entityType={EntityType.FarcasterChannel_Timestamp}
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
				$channel: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(farcasterChannelTimestamps) => [...new Map(farcasterChannelTimestamps.values.map((farcasterChannelTimestamp) => [farcasterChannelTimestamp[EntityMetaKey.SelectorKey], farcasterChannelTimestamp])).values()]}
	getKey={(farcasterChannelTimestamp) => farcasterChannelTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster channel observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterChannelTimestamp })}
		{@const farcasterChannelTimestampFields = { ...farcasterChannelTimestamp[EntityMetaKey.Selector], ...farcasterChannelTimestamp }}
		<EntityView
			entityType={EntityType.FarcasterChannel_Timestamp}
			entitySelector={farcasterChannelTimestamp[EntityMetaKey.Selector]}
			href={
				(
					farcasterChannelTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in farcasterChannelTimestamp[EntityMetaKey.Selector]
					&& farcasterChannelTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& farcasterChannelTimestamp[EntityMetaKey.Selector] != null && '$channel' in farcasterChannelTimestamp[EntityMetaKey.Selector]
					&& farcasterChannelTimestamp[EntityMetaKey.Selector].$channel != null && 'id' in farcasterChannelTimestamp[EntityMetaKey.Selector].$channel
					&& farcasterChannelTimestamp[EntityMetaKey.Selector].$channel.id != null ?
						resolve('/farcaster/channel/[channelId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(farcasterChannelTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					channelId: String(farcasterChannelTimestamp[EntityMetaKey.Selector].$channel.id ?? ''),
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
				{[[String((farcasterChannelTimestampFields.$channel.name) ?? ''), String((farcasterChannelTimestampFields.$channel.id) ?? '')].filter(Boolean).join(' ') || 'Farcaster channel'].filter(Boolean).join(' ') || 'Farcaster channel observation'}
			{/snippet}

			{#snippet Value()}
				{[String((farcasterChannelTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
