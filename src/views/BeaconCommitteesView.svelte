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
		title = 'Committees',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Beacon committees...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconCommittees-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconCommittee>
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
	import BeaconCommitteeView from '$/views/BeaconCommitteeView.svelte'
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
					indexInSlot: true,
					slot: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconCommittee}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(beaconCommittees)}
			{@const uniqueBeaconCommittees = [...new Map(beaconCommittees.values.map((beaconCommittee) => [beaconCommittee[EntityMetaKey.SelectorKey], beaconCommittee])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconCommittee}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={beaconCommittees.values.length === uniqueBeaconCommittees.length && beaconCommittees.totalCount != null && beaconCommittees.totalCount >= uniqueBeaconCommittees.length ? beaconCommittees.totalCount : uniqueBeaconCommittees.length}
				getKey={(beaconCommittee) => beaconCommittee[EntityMetaKey.SelectorKey]}
				items={uniqueBeaconCommittees}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Beacon committees yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: beaconCommittee }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconCommittee> })}
					<BeaconCommitteeView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/committee/[index=nonNegativeInteger]', {
								caip2: `${String(({ ...beaconCommittee.entitySelector, ...beaconCommittee }).caip2.namespace)}:${String(({ ...beaconCommittee.entitySelector, ...beaconCommittee }).caip2.reference)}`,
								slot: String(({ ...beaconCommittee.entitySelector, ...beaconCommittee }).slot),
								index: String(({ ...beaconCommittee.entitySelector, ...beaconCommittee }).indexInSlot),
							})
						}
						selection={select(EntityType.BeaconCommittee, beaconCommittee.entitySelector)}
						prefetched={beaconCommittee}
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
		entityType={EntityType.BeaconCommittee}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
