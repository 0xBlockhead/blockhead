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
		placeholderText,
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
			selection({
				fields: {
					indexInSlot: true,
					slot: true,
					$network: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={beaconCommittees.totalCount}
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
					{@const beaconCommitteeFields = { ...beaconCommittee[EntityMetaKey.Selector], ...beaconCommittee }}
					{@const beaconCommitteeHrefFields = { ...beaconCommittee, ...beaconCommittee[EntityMetaKey.Selector] }}
					<BeaconCommitteeView
						selection={select(EntityType.BeaconCommittee, beaconCommittee[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={beaconCommitteeFields}
						href={
							(beaconCommitteeHrefFields.$network !== undefined && beaconCommitteeHrefFields.$network.caip2 !== undefined && beaconCommitteeHrefFields.$network.caip2.namespace !== undefined && beaconCommitteeHrefFields.$network !== undefined && beaconCommitteeHrefFields.$network.caip2 !== undefined && beaconCommitteeHrefFields.$network.caip2.reference !== undefined && beaconCommitteeHrefFields.slot !== undefined && beaconCommitteeHrefFields.indexInSlot !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/committee/[index=nonNegativeInteger]', {
								caip2: `${String(beaconCommitteeHrefFields.$network.caip2.namespace ?? '')}:${String(beaconCommitteeHrefFields.$network.caip2.reference ?? '')}`,
								slot: String(beaconCommitteeHrefFields.slot ?? ''),
								index: String(beaconCommitteeHrefFields.indexInSlot ?? ''),
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
		entityType={EntityType.BeaconCommittee}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
