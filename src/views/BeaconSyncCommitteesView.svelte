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
		placeholderText,
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
			selection({
				fields: {
					period: true,
					$network: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={beaconSyncCommittees.totalCount}
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
					{@const beaconSyncCommitteeFields = { ...beaconSyncCommittee[EntityMetaKey.Selector], ...beaconSyncCommittee }}
					{@const beaconSyncCommitteeHrefFields = { ...beaconSyncCommittee, ...beaconSyncCommittee[EntityMetaKey.Selector] }}
					<BeaconSyncCommitteeView
						selection={select(EntityType.BeaconSyncCommittee, beaconSyncCommittee[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={beaconSyncCommitteeFields}
						href={
							(beaconSyncCommitteeHrefFields.$network !== undefined && beaconSyncCommitteeHrefFields.$network.slug !== undefined && beaconSyncCommitteeHrefFields.period !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/sync-committee/[period=nonNegativeInteger]', {
								network: String(beaconSyncCommitteeHrefFields.$network.slug ?? ''),
								period: String(beaconSyncCommitteeHrefFields.period ?? ''),
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
		entityType={EntityType.BeaconSyncCommittee}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
