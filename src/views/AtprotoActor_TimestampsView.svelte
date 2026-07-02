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


	// State
	let {
		selection,
		title = 'AT Protocol account observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading AT Protocol account observations...',
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
	import NumberValue from '$/components/NumberValue.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
					timestampMs: true,
					followersCount: true,
					postsCount: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
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
		{/snippet}

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
				totalCount={atprotoActorTimestamps.values.length === uniqueAtprotoActorTimestamps.length && atprotoActorTimestamps.totalCount != null && atprotoActorTimestamps.totalCount >= uniqueAtprotoActorTimestamps.length ? atprotoActorTimestamps.totalCount : uniqueAtprotoActorTimestamps.length}
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
					<EntityView
						entityType={EntityType.AtprotoActor_Timestamp}
						entitySelector={atprotoActorTimestamp.entitySelector}
						href={
							resolve('/(social)/(atproto)/atproto/actor/[did]/(actor)/observations/[timestampMs=nonNegativeInteger]', {
								did: String(({ ...atprotoActorTimestamp.entitySelector, ...atprotoActorTimestamp }).$actor.did),
								timestampMs: String(({ ...atprotoActorTimestamp.entitySelector, ...atprotoActorTimestamp }).timestampMs),
							})
						}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const timestampMs0 = ({ ...atprotoActorTimestamp.entitySelector, ...atprotoActorTimestamp }).timestampMs}
							<Timestamp timestamp={Number(timestampMs0)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const followersCountAfter0 = ({ ...atprotoActorTimestamp.entitySelector, ...atprotoActorTimestamp }).followersCount}
							{#if followersCountAfter0 != null}
								<span data-text="muted">
									<NumberValue value={Number(followersCountAfter0)} />

									<span> followers</span>
									 followers
								</span>
							{/if}
							{@const postsCountAfter1 = ({ ...atprotoActorTimestamp.entitySelector, ...atprotoActorTimestamp }).postsCount}
							{#if postsCountAfter1 != null}
								<span data-text="muted">
									<NumberValue value={Number(postsCountAfter1)} />

									<span> posts</span>
									 posts
								</span>
							{/if}
						{/snippet}
					</EntityView>
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
