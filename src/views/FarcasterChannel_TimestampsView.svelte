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
		title = 'Farcaster channel observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterChannel_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FarcasterChannel_Timestamp>
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
	import FarcasterChannel_TimestampView from '$/views/FarcasterChannel_TimestampView.svelte'
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
					$channel: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterChannel_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(farcasterChannelTimestamps)}
			{@const uniqueFarcasterChannelTimestamps = [...new Map(farcasterChannelTimestamps.values.map((farcasterChannelTimestamp) => [farcasterChannelTimestamp[EntityMetaKey.SelectorKey], farcasterChannelTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterChannel_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={farcasterChannelTimestamps.totalCount}
				getKey={(farcasterChannelTimestamp) => farcasterChannelTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueFarcasterChannelTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Farcaster channel observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: farcasterChannelTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.FarcasterChannel_Timestamp> })}
					{@const farcasterChannelTimestampFields = { ...farcasterChannelTimestamp[EntityMetaKey.Selector], ...farcasterChannelTimestamp }}
					{@const farcasterChannelTimestampHrefFields = { ...farcasterChannelTimestamp, ...farcasterChannelTimestamp[EntityMetaKey.Selector] }}
					<FarcasterChannel_TimestampView
						selection={select(EntityType.FarcasterChannel_Timestamp, farcasterChannelTimestamp[EntityMetaKey.Selector])}
						prefetched={farcasterChannelTimestampFields}
						href={
							(farcasterChannelTimestampHrefFields.$channel !== undefined && farcasterChannelTimestampHrefFields.$channel.id !== undefined && farcasterChannelTimestampHrefFields.timestampMs !== undefined ? resolve('/(social)/(farcaster)/farcaster/channel/[channelId]/(channel)/observations/[timestampMs=nonNegativeInteger]', {
								channelId: String(farcasterChannelTimestampHrefFields.$channel.id ?? ''),
								timestampMs: String(farcasterChannelTimestampHrefFields.timestampMs ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.FarcasterChannel_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
