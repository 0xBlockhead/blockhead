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
		placeholderText = 'Loading Farcaster channel observations...',
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
			selection.sources == null ? selection({
				fields: {
					$channel: true,
					timestampMs: true,
				},
			}) : selection
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
				totalCount={farcasterChannelTimestamps.values.length === uniqueFarcasterChannelTimestamps.length && farcasterChannelTimestamps.totalCount != null && farcasterChannelTimestamps.totalCount >= uniqueFarcasterChannelTimestamps.length ? farcasterChannelTimestamps.totalCount : uniqueFarcasterChannelTimestamps.length}
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
					<FarcasterChannel_TimestampView
						href={
							resolve('/(social)/(farcaster)/farcaster/channel/[channelId]/(channel)/observations/[timestampMs=nonNegativeInteger]', {
								channelId: String(farcasterChannelTimestamp.entitySelector.$channel.id),
								timestampMs: String(farcasterChannelTimestamp.entitySelector.timestampMs),
							})
						}
						selection={select(EntityType.FarcasterChannel_Timestamp, farcasterChannelTimestamp.entitySelector)}
						prefetched={farcasterChannelTimestamp}
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
