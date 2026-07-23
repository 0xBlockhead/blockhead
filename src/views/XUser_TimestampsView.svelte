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
		title = 'X user observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XUser_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XUser_Timestamp>
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
	entityType={EntityType.XUser_Timestamp}
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
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(xUserTimestamps) => [...new Map(xUserTimestamps.values.map((xUserTimestamp) => [xUserTimestamp[EntityMetaKey.SelectorKey], xUserTimestamp])).values()]}
	getKey={(xUserTimestamp) => xUserTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No X user observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xUserTimestamp })}
		{@const xUserTimestampFields = { ...xUserTimestamp[EntityMetaKey.Selector], ...xUserTimestamp }}
		<EntityView
			entityType={EntityType.XUser_Timestamp}
			entitySelector={xUserTimestamp[EntityMetaKey.Selector]}
			href={
				(
					xUserTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in xUserTimestamp[EntityMetaKey.Selector]
					&& xUserTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& xUserTimestamp[EntityMetaKey.Selector] != null && 'source' in xUserTimestamp[EntityMetaKey.Selector]
					&& xUserTimestamp[EntityMetaKey.Selector].source != null
					&& xUserTimestamp[EntityMetaKey.Selector] != null && '$user' in xUserTimestamp[EntityMetaKey.Selector]
					&& xUserTimestamp[EntityMetaKey.Selector].$user != null && 'id' in xUserTimestamp[EntityMetaKey.Selector].$user
					&& xUserTimestamp[EntityMetaKey.Selector].$user.id != null ?
						resolve('/x/user/[userId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(xUserTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(xUserTimestamp[EntityMetaKey.Selector].source ?? ''),
					userId: String(xUserTimestamp[EntityMetaKey.Selector].$user.id ?? ''),
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
				{[[String((xUserTimestampFields.$user.name) ?? ''), String((xUserTimestampFields.$user.username) ?? ''), String((xUserTimestampFields.$user.id) ?? '')].filter(Boolean).join(' ') || 'X user'].filter(Boolean).join(' ') || 'X user observation'}
			{/snippet}

			{#snippet Value()}
				{[String((xUserTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((xUserTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
