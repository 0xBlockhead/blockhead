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
		title = 'ActivityPub actors',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubActors-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ActivityPubActor>
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
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
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
					$icon: true,
					displayName: true,
					acct: true,
					username: true,
					localAccountId: true,
					instanceOrigin: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ActivityPubActor}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(activityPubActors)}
			{@const uniqueActivityPubActors = [...new Map(activityPubActors.values.map((activityPubActor) => [activityPubActor[EntityMetaKey.SelectorKey], activityPubActor])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ActivityPubActor}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={activityPubActors.totalCount}
				getKey={(activityPubActor) => activityPubActor[EntityMetaKey.SelectorKey]}
				items={uniqueActivityPubActors}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ActivityPub actors yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: activityPubActor }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ActivityPubActor> })}
					{@const activityPubActorFields = { ...activityPubActor[EntityMetaKey.Selector], ...activityPubActor }}
					{@const activityPubActorHrefFields = { ...activityPubActor, ...activityPubActor[EntityMetaKey.Selector] }}
					<ActivityPubActorView
						selection={select(EntityType.ActivityPubActor, activityPubActor[EntityMetaKey.Selector])}
						prefetched={activityPubActorFields}
						href={
							(activityPubActorHrefFields.instanceOrigin !== undefined && activityPubActorHrefFields.localAccountId !== undefined ? resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
								instanceOrigin: String(activityPubActorHrefFields.instanceOrigin ?? ''),
								localAccountId: String(activityPubActorHrefFields.localAccountId ?? ''),
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
		entityType={EntityType.ActivityPubActor}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
