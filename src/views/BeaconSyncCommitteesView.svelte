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
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BeaconSyncCommittee>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BeaconSyncCommittee}
			entitySelector={beaconSyncCommittee[EntityMetaKey.Selector]}
			href={
				(
					beaconSyncCommittee[EntityMetaKey.Selector] != null && 'period' in beaconSyncCommittee[EntityMetaKey.Selector]
					&& beaconSyncCommittee[EntityMetaKey.Selector].period != null
					&& beaconSyncCommittee[EntityMetaKey.Selector] != null && '$network' in beaconSyncCommittee[EntityMetaKey.Selector] ?
						beaconSyncCommittee[EntityMetaKey.Selector].$network != null && 'caip2' in beaconSyncCommittee[EntityMetaKey.Selector].$network
						&& beaconSyncCommittee[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/sync-committee/[period=nonNegativeInteger]', {
						period: String(beaconSyncCommittee[EntityMetaKey.Selector].period ?? ''),
						network: String(caip2StringFromValue(beaconSyncCommittee[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							beaconSyncCommittee[EntityMetaKey.Selector].$network != null && 'slug' in beaconSyncCommittee[EntityMetaKey.Selector].$network
							&& beaconSyncCommittee[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/sync-committee/[period=nonNegativeInteger]', {
							period: String(beaconSyncCommittee[EntityMetaKey.Selector].period ?? ''),
							network: String(beaconSyncCommittee[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{(String((beaconSyncCommitteeFields.period) ?? '') ? 'Sync committee #' + String((beaconSyncCommitteeFields.period) ?? '') : '') || 'beacon sync committee'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((beaconSyncCommitteeFields.$network.name) ?? '')].filter(Boolean).join(' ') || [beaconSyncCommitteeFields.$network.caip2 == null ? '' : String(`${(beaconSyncCommitteeFields.$network.caip2).namespace}:${(beaconSyncCommitteeFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
