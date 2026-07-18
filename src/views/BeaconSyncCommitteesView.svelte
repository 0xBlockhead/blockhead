<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Sync committees',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconSyncCommittees-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BeaconSyncCommittee>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BeaconSyncCommitteeView from '$/views/BeaconSyncCommitteeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconSyncCommittee}
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
				period: true,
				$network: true,
			},
		})
	}
	getResourceItems={(beaconSyncCommittees) => [...new Map(beaconSyncCommittees.values.map((beaconSyncCommittee) => [beaconSyncCommittee[EntityMetaKey.SelectorKey], beaconSyncCommittee])).values()]}
	getKey={(beaconSyncCommittee) => beaconSyncCommittee[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Beacon sync committees yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: beaconSyncCommittee })}
		{@const beaconSyncCommitteeFields = { ...beaconSyncCommittee[EntityMetaKey.Selector], ...beaconSyncCommittee }}
		{@const selection = select(EntityType.BeaconSyncCommittee, beaconSyncCommittee[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const beaconSyncCommitteeHrefFields = { ...beaconSyncCommittee, ...beaconSyncCommittee[EntityMetaKey.Selector] }}
		<BeaconSyncCommitteeView
			selection={selection}
			prefetched={beaconSyncCommitteeFields}
			href={
				(beaconSyncCommitteeHrefFields.period !== undefined && beaconSyncCommitteeHrefFields.$network !== undefined && beaconSyncCommitteeHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/sync-committee/[period=nonNegativeInteger]', {
					period: String(beaconSyncCommitteeHrefFields.period ?? ''),
					network: String(caip2StringFromValue(beaconSyncCommitteeHrefFields.$network.caip2) ?? ''),
				}) : beaconSyncCommitteeHrefFields.period !== undefined && beaconSyncCommitteeHrefFields.$network !== undefined && beaconSyncCommitteeHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/sync-committee/[period=nonNegativeInteger]', {
					period: String(beaconSyncCommitteeHrefFields.period ?? ''),
					network: String(beaconSyncCommitteeHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
