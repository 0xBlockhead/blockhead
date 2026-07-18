<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FarcasterChannel_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterChannel_TimestampView from '$/views/FarcasterChannel_TimestampView.svelte'
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
		{@const selection = select(EntityType.FarcasterChannel_Timestamp, farcasterChannelTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const farcasterChannelTimestampHrefFields = { ...farcasterChannelTimestamp, ...farcasterChannelTimestamp[EntityMetaKey.Selector] }}
		<FarcasterChannel_TimestampView
			selection={selection}
			prefetched={farcasterChannelTimestampFields}
			href={
				(farcasterChannelTimestampHrefFields.timestampMs !== undefined && farcasterChannelTimestampHrefFields.$channel !== undefined && farcasterChannelTimestampHrefFields.$channel.id !== undefined ? resolve('/farcaster/channel/[channelId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(farcasterChannelTimestampHrefFields.timestampMs ?? ''),
					channelId: String(farcasterChannelTimestampHrefFields.$channel.id ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
