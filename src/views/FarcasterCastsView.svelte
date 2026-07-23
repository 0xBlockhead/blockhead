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
		title = 'Farcaster casts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterCasts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterCast>
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
	entityType={EntityType.FarcasterCast}
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
				text: true,
				hash: true,
				fid: true,
				timestamp: true,
				username: true,
				hashPrefix: true,
			},
		})
	}
	{countResource}
	getResourceItems={(farcasterCasts) => [...new Map(farcasterCasts.values.map((farcasterCast) => [farcasterCast[EntityMetaKey.SelectorKey], farcasterCast])).values()]}
	getKey={(farcasterCast) => farcasterCast[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster casts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterCast })}
		{@const farcasterCastFields = { ...farcasterCast[EntityMetaKey.Selector], ...farcasterCast }}
		<EntityView
			entityType={EntityType.FarcasterCast}
			entitySelector={farcasterCast[EntityMetaKey.Selector]}
			href={
				(
					farcasterCast[EntityMetaKey.Selector] != null && 'fid' in farcasterCast[EntityMetaKey.Selector]
					&& farcasterCast[EntityMetaKey.Selector].fid != null
					&& farcasterCast[EntityMetaKey.Selector] != null && 'hash' in farcasterCast[EntityMetaKey.Selector]
					&& farcasterCast[EntityMetaKey.Selector].hash != null ?
						resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]', {
					fid: String(farcasterCast[EntityMetaKey.Selector].fid ?? ''),
					hash: String(farcasterCast[EntityMetaKey.Selector].hash ?? ''),
				})
				:
						farcasterCast[EntityMetaKey.Selector] != null && 'username' in farcasterCast[EntityMetaKey.Selector]
						&& farcasterCast[EntityMetaKey.Selector].username != null
						&& farcasterCast[EntityMetaKey.Selector] != null && 'hashPrefix' in farcasterCast[EntityMetaKey.Selector]
						&& farcasterCast[EntityMetaKey.Selector].hashPrefix != null ?
							resolve('/farcaster/c/[fname=stringSegment]/[hash=zeroExHex]', {
						fname: String(farcasterCast[EntityMetaKey.Selector].username ?? ''),
						hash: String(farcasterCast[EntityMetaKey.Selector].hashPrefix ?? ''),
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
				{[String((farcasterCastFields.text) ?? ''), String((farcasterCastFields.hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast'}
			{/snippet}

			{#snippet Value()}
				{[String((farcasterCastFields.fid) ?? ''), String((farcasterCastFields.hash) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((farcasterCastFields.timestamp) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
