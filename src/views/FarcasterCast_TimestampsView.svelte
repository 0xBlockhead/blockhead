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
		title = 'Farcaster cast observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterCast_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FarcasterCast_Timestamp>
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
	import FarcasterCast_TimestampView from '$/views/FarcasterCast_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterCast_Timestamp}
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
				$cast: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(farcasterCastTimestamps) => [...new Map(farcasterCastTimestamps.values.map((farcasterCastTimestamp) => [farcasterCastTimestamp[EntityMetaKey.SelectorKey], farcasterCastTimestamp])).values()]}
	getKey={(farcasterCastTimestamp) => farcasterCastTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster cast observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterCastTimestamp })}
		{@const farcasterCastTimestampFields = { ...farcasterCastTimestamp[EntityMetaKey.Selector], ...farcasterCastTimestamp }}
		{@const selection = select(EntityType.FarcasterCast_Timestamp, farcasterCastTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const farcasterCastTimestampHrefFields = { ...farcasterCastTimestamp, ...farcasterCastTimestamp[EntityMetaKey.Selector] }}
		<FarcasterCast_TimestampView
			selection={selection}
			prefetched={farcasterCastTimestampFields}
			href={
				(farcasterCastTimestampHrefFields.timestampMs !== undefined && farcasterCastTimestampHrefFields.$cast !== undefined && farcasterCastTimestampHrefFields.$cast.fid !== undefined && farcasterCastTimestampHrefFields.$cast.hash !== undefined ? resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(farcasterCastTimestampHrefFields.timestampMs ?? ''),
					fid: String(farcasterCastTimestampHrefFields.$cast.fid ?? ''),
					hash: String(farcasterCastTimestampHrefFields.$cast.hash ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
