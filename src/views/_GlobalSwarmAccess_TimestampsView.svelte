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
		title = 'Global Swarm access observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalSwarmAccess_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalSwarmAccess_Timestamp>
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
	entityType={EntityType._GlobalSwarmAccess_Timestamp}
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
				$hub: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalSwarmAccessTimestamps) => [...new Map(globalSwarmAccessTimestamps.values.map((globalSwarmAccessTimestamp) => [globalSwarmAccessTimestamp[EntityMetaKey.SelectorKey], globalSwarmAccessTimestamp])).values()]}
	getKey={(globalSwarmAccessTimestamp) => globalSwarmAccessTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global Swarm access observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalSwarmAccessTimestamp })}
		{@const globalSwarmAccessTimestampFields = { ...globalSwarmAccessTimestamp[EntityMetaKey.Selector], ...globalSwarmAccessTimestamp }}
		<EntityView
			entityType={EntityType._GlobalSwarmAccess_Timestamp}
			entitySelector={globalSwarmAccessTimestamp[EntityMetaKey.Selector]}
			href={
				(
					globalSwarmAccessTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in globalSwarmAccessTimestamp[EntityMetaKey.Selector]
					&& globalSwarmAccessTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& globalSwarmAccessTimestamp[EntityMetaKey.Selector] != null && 'source' in globalSwarmAccessTimestamp[EntityMetaKey.Selector]
					&& globalSwarmAccessTimestamp[EntityMetaKey.Selector].source != null ?
						resolve('/swarm/access/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(globalSwarmAccessTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(globalSwarmAccessTimestamp[EntityMetaKey.Selector].source ?? ''),
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
				{['global Swarm access'].filter(Boolean).join(' ') || 'global Swarm access timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((globalSwarmAccessTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
