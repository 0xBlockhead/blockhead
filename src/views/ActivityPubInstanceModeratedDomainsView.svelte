<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'ActivityPub instance moderated domains',
		typeAnnotationParagraphs = ['A domain that a declared ActivityPub instance reports in its public moderation-domain list.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubInstanceModeratedDomains-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ActivityPubInstanceModeratedDomain>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActivityPubInstanceModeratedDomainView from '$/views/ActivityPubInstanceModeratedDomainView.svelte'
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
					domain: true,
					severity: true,
					comment: true,
					instanceOrigin: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ActivityPubInstanceModeratedDomain}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(activityPubInstanceModeratedDomains)}
			{@const uniqueActivityPubInstanceModeratedDomains = [...new Map(activityPubInstanceModeratedDomains.values.map((activityPubInstanceModeratedDomain) => [activityPubInstanceModeratedDomain[EntityMetaKey.SelectorKey], activityPubInstanceModeratedDomain])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ActivityPubInstanceModeratedDomain}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={activityPubInstanceModeratedDomains.totalCount}
				getKey={(activityPubInstanceModeratedDomain) => activityPubInstanceModeratedDomain[EntityMetaKey.SelectorKey]}
				items={uniqueActivityPubInstanceModeratedDomains}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ActivityPub instance moderated domains yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: activityPubInstanceModeratedDomain })}
					{@const activityPubInstanceModeratedDomainFields = { ...activityPubInstanceModeratedDomain[EntityMetaKey.Selector], ...activityPubInstanceModeratedDomain }}
					{@const selection = select(EntityType.ActivityPubInstanceModeratedDomain, activityPubInstanceModeratedDomain[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					<ActivityPubInstanceModeratedDomainView
						selection={selection}
						prefetched={activityPubInstanceModeratedDomainFields}
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
		entityType={EntityType.ActivityPubInstanceModeratedDomain}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
