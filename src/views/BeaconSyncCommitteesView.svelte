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
		title = 'Sync committees',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Beacon sync committees...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconSyncCommittees-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconSyncCommittee>
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
	import BeaconSyncCommitteeView from '$/views/BeaconSyncCommitteeView.svelte'
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
					period: true,
					$network: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconSyncCommittee}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(beaconSyncCommittees)}
			{@const uniqueBeaconSyncCommittees = [...new Map(beaconSyncCommittees.values.map((beaconSyncCommittee) => [beaconSyncCommittee[EntityMetaKey.SelectorKey], beaconSyncCommittee])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconSyncCommittee}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={beaconSyncCommittees.values.length === uniqueBeaconSyncCommittees.length && beaconSyncCommittees.totalCount != null && beaconSyncCommittees.totalCount >= uniqueBeaconSyncCommittees.length ? beaconSyncCommittees.totalCount : uniqueBeaconSyncCommittees.length}
				getKey={(beaconSyncCommittee) => beaconSyncCommittee[EntityMetaKey.SelectorKey]}
				items={uniqueBeaconSyncCommittees}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Beacon sync committees yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: beaconSyncCommittee }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconSyncCommittee> })}
					<BeaconSyncCommitteeView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/sync-committee/[period=nonNegativeInteger]', {
								caip2: `${String(({ ...beaconSyncCommittee.entitySelector, ...beaconSyncCommittee }).caip2.namespace)}:${String(({ ...beaconSyncCommittee.entitySelector, ...beaconSyncCommittee }).caip2.reference)}`,
								period: String(({ ...beaconSyncCommittee.entitySelector, ...beaconSyncCommittee }).period),
							})
						}
						selection={select(EntityType.BeaconSyncCommittee, beaconSyncCommittee.entitySelector)}
						prefetched={beaconSyncCommittee}
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
		entityType={EntityType.BeaconSyncCommittee}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
