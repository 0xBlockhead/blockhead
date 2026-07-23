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
		title = 'Farcaster user observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterUser_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterUser_Timestamp>
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
	entityType={EntityType.FarcasterUser_Timestamp}
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
				$user: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(farcasterUserTimestamps) => [...new Map(farcasterUserTimestamps.values.map((farcasterUserTimestamp) => [farcasterUserTimestamp[EntityMetaKey.SelectorKey], farcasterUserTimestamp])).values()]}
	getKey={(farcasterUserTimestamp) => farcasterUserTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster user observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterUserTimestamp })}
		{@const farcasterUserTimestampFields = { ...farcasterUserTimestamp[EntityMetaKey.Selector], ...farcasterUserTimestamp }}
		<EntityView
			entityType={EntityType.FarcasterUser_Timestamp}
			entitySelector={farcasterUserTimestamp[EntityMetaKey.Selector]}
			href={
				(
					farcasterUserTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in farcasterUserTimestamp[EntityMetaKey.Selector]
					&& farcasterUserTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& farcasterUserTimestamp[EntityMetaKey.Selector] != null && '$user' in farcasterUserTimestamp[EntityMetaKey.Selector]
					&& farcasterUserTimestamp[EntityMetaKey.Selector].$user != null && 'fid' in farcasterUserTimestamp[EntityMetaKey.Selector].$user
					&& farcasterUserTimestamp[EntityMetaKey.Selector].$user.fid != null ?
						resolve('/farcaster/user/[userId=farcasterFid]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(farcasterUserTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					userId: String(farcasterUserTimestamp[EntityMetaKey.Selector].$user.fid ?? ''),
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
				{[[String((farcasterUserTimestampFields.$user.displayName) ?? ''), String((farcasterUserTimestampFields.$user.username) ?? ''), String((farcasterUserTimestampFields.$user.fid) ?? '')].filter(Boolean).join(' ') || 'Farcaster user'].filter(Boolean).join(' ') || 'Farcaster user observation'}
			{/snippet}

			{#snippet Value()}
				{[String((farcasterUserTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
