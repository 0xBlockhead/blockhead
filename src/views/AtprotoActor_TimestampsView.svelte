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
		title = 'AT Protocol account observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoActor_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AtprotoActor_Timestamp>
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
	import AtprotoActor_TimestampView from '$/views/AtprotoActor_TimestampView.svelte'
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
					timestampMs: true,
					followersCount: true,
					postsCount: true,
					$actor: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(atprotoActorTimestamps)}
			{@const uniqueAtprotoActorTimestamps = [...new Map(atprotoActorTimestamps.values.map((atprotoActorTimestamp) => [atprotoActorTimestamp[EntityMetaKey.SelectorKey], atprotoActorTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AtprotoActor_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={atprotoActorTimestamps.totalCount}
				getKey={(atprotoActorTimestamp) => atprotoActorTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAtprotoActorTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AT Protocol account observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: atprotoActorTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AtprotoActor_Timestamp> })}
					{@const atprotoActorTimestampFields = { ...atprotoActorTimestamp[EntityMetaKey.Selector], ...atprotoActorTimestamp }}
					{@const atprotoActorTimestampHrefFields = { ...atprotoActorTimestamp, ...atprotoActorTimestamp[EntityMetaKey.Selector] }}
					<AtprotoActor_TimestampView
						selection={select(EntityType.AtprotoActor_Timestamp, atprotoActorTimestamp[EntityMetaKey.Selector])}
						prefetched={atprotoActorTimestampFields}
						href={
							(atprotoActorTimestampHrefFields.$actor !== undefined && atprotoActorTimestampHrefFields.$actor.did !== undefined && atprotoActorTimestampHrefFields.timestampMs !== undefined ? resolve('/(social)/(atproto)/atproto/actor/[did]/(actor)/observations/[timestampMs=nonNegativeInteger]', {
								did: String(atprotoActorTimestampHrefFields.$actor.did ?? ''),
								timestampMs: String(atprotoActorTimestampHrefFields.timestampMs ?? ''),
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
		entityType={EntityType.AtprotoActor_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
