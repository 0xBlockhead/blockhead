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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterCast_Timestamp>
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
				$cast: {
					fields: {
						text: true,
						hash: true,
						fid: true,
						timestamp: true,
					},
				},
				timestampMs: true,
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.FarcasterCast_Timestamp}
			entitySelector={farcasterCastTimestamp[EntityMetaKey.Selector]}
			href={
				(
					farcasterCastTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in farcasterCastTimestamp[EntityMetaKey.Selector]
					&& farcasterCastTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& farcasterCastTimestamp[EntityMetaKey.Selector] != null && '$cast' in farcasterCastTimestamp[EntityMetaKey.Selector]
					&& farcasterCastTimestamp[EntityMetaKey.Selector].$cast != null && 'fid' in farcasterCastTimestamp[EntityMetaKey.Selector].$cast
					&& farcasterCastTimestamp[EntityMetaKey.Selector].$cast.fid != null
					&& farcasterCastTimestamp[EntityMetaKey.Selector].$cast != null && 'hash' in farcasterCastTimestamp[EntityMetaKey.Selector].$cast
					&& farcasterCastTimestamp[EntityMetaKey.Selector].$cast.hash != null ?
						resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(farcasterCastTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					fid: String(farcasterCastTimestamp[EntityMetaKey.Selector].$cast.fid ?? ''),
					hash: String(farcasterCastTimestamp[EntityMetaKey.Selector].$cast.hash ?? ''),
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
				{[[String((farcasterCastTimestampFields.$cast.text) ?? ''), String((farcasterCastTimestampFields.$cast.hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast'].filter(Boolean).join(' ') || 'Farcaster cast observation'}
			{/snippet}

			{#snippet Value()}
				{[String((farcasterCastTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
