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
		title = 'Slashings',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconSlashings-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BeaconSlashing>
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
	entityType={EntityType.BeaconSlashing}
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
				indexInSlot: true,
				kind: true,
				slot: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(beaconSlashings) => [...new Map(beaconSlashings.values.map((beaconSlashing) => [beaconSlashing[EntityMetaKey.SelectorKey], beaconSlashing])).values()]}
	getKey={(beaconSlashing) => beaconSlashing[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Beacon slashings yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: beaconSlashing })}
		{@const beaconSlashingFields = { ...beaconSlashing[EntityMetaKey.Selector], ...beaconSlashing }}
		<EntityView
			entityType={EntityType.BeaconSlashing}
			entitySelector={beaconSlashing[EntityMetaKey.Selector]}
			href={
				(
					beaconSlashing[EntityMetaKey.Selector] != null && 'slot' in beaconSlashing[EntityMetaKey.Selector]
					&& beaconSlashing[EntityMetaKey.Selector].slot != null
					&& beaconSlashing[EntityMetaKey.Selector] != null && 'kind' in beaconSlashing[EntityMetaKey.Selector]
					&& beaconSlashing[EntityMetaKey.Selector].kind != null
					&& beaconSlashing[EntityMetaKey.Selector] != null && 'indexInSlot' in beaconSlashing[EntityMetaKey.Selector]
					&& beaconSlashing[EntityMetaKey.Selector].indexInSlot != null
					&& beaconSlashing[EntityMetaKey.Selector] != null && '$network' in beaconSlashing[EntityMetaKey.Selector] ?
						beaconSlashing[EntityMetaKey.Selector].$network != null && 'caip2' in beaconSlashing[EntityMetaKey.Selector].$network
						&& beaconSlashing[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', {
						slot: String(beaconSlashing[EntityMetaKey.Selector].slot ?? ''),
						kind: String(beaconSlashing[EntityMetaKey.Selector].kind ?? ''),
						index: String(beaconSlashing[EntityMetaKey.Selector].indexInSlot ?? ''),
						network: String(caip2StringFromValue(beaconSlashing[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							beaconSlashing[EntityMetaKey.Selector].$network != null && 'slug' in beaconSlashing[EntityMetaKey.Selector].$network
							&& beaconSlashing[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', {
							slot: String(beaconSlashing[EntityMetaKey.Selector].slot ?? ''),
							kind: String(beaconSlashing[EntityMetaKey.Selector].kind ?? ''),
							index: String(beaconSlashing[EntityMetaKey.Selector].indexInSlot ?? ''),
							network: String(beaconSlashing[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{(String((beaconSlashingFields.indexInSlot) ?? '') ? 'Slashing #' + String((beaconSlashingFields.indexInSlot) ?? '') : '') || [String((beaconSlashingFields.kind) ?? ''), (String((beaconSlashingFields.indexInSlot) ?? '') ? ' #' + String((beaconSlashingFields.indexInSlot) ?? '') : '')].filter(Boolean).join(' ') || 'beacon slashing'}
			{/snippet}

			{#snippet Value()}
				{[String((beaconSlashingFields.kind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((beaconSlashingFields.slot) ?? '') ? 'Slot ' + String((beaconSlashingFields.slot) ?? '') : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
