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
		title = 'Farcaster cast observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterCast_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FarcasterCast_Timestamp>
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
	import FarcasterCast_TimestampView from '$/views/FarcasterCast_TimestampView.svelte'
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
					$cast: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(farcasterCastTimestamps)}
			{@const uniqueFarcasterCastTimestamps = [...new Map(farcasterCastTimestamps.values.map((farcasterCastTimestamp) => [farcasterCastTimestamp[EntityMetaKey.SelectorKey], farcasterCastTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterCast_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={farcasterCastTimestamps.totalCount}
				getKey={(farcasterCastTimestamp) => farcasterCastTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueFarcasterCastTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Farcaster cast observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: farcasterCastTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.FarcasterCast_Timestamp> })}
					{@const farcasterCastTimestampFields = { ...farcasterCastTimestamp[EntityMetaKey.Selector], ...farcasterCastTimestamp }}
					{@const farcasterCastTimestampHrefFields = { ...farcasterCastTimestamp, ...farcasterCastTimestamp[EntityMetaKey.Selector] }}
					<FarcasterCast_TimestampView
						selection={select(EntityType.FarcasterCast_Timestamp, farcasterCastTimestamp[EntityMetaKey.Selector])}
						prefetched={farcasterCastTimestampFields}
						href={
							(farcasterCastTimestampHrefFields.$cast !== undefined && farcasterCastTimestampHrefFields.$cast.fid !== undefined && farcasterCastTimestampHrefFields.$cast !== undefined && farcasterCastTimestampHrefFields.$cast.hash !== undefined && farcasterCastTimestampHrefFields.timestampMs !== undefined ? resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]/observations/[timestampMs=nonNegativeInteger]', {
								fid: String(farcasterCastTimestampHrefFields.$cast.fid ?? ''),
								hash: String(farcasterCastTimestampHrefFields.$cast.hash ?? ''),
								timestampMs: String(farcasterCastTimestampHrefFields.timestampMs ?? ''),
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
		entityType={EntityType.FarcasterCast_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
