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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BeaconSlashing>
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
	import BeaconSlashingView from '$/views/BeaconSlashingView.svelte'
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
					kind: true,
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
				entityType={EntityType.BeaconSlashing}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(beaconSlashings)}
			{@const uniqueBeaconSlashings = [...new Map(beaconSlashings.values.map((beaconSlashing) => [beaconSlashing[EntityMetaKey.SelectorKey], beaconSlashing])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconSlashing}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={beaconSlashings.totalCount}
				getKey={(beaconSlashing) => beaconSlashing[EntityMetaKey.SelectorKey]}
				items={uniqueBeaconSlashings}
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
					{@const selection = select(EntityType.BeaconSlashing, beaconSlashing[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const beaconSlashingHrefFields = { ...beaconSlashing, ...beaconSlashing[EntityMetaKey.Selector] }}
					<BeaconSlashingView
						selection={selection}
						prefetched={beaconSlashingFields}
						href={
							(beaconSlashingHrefFields.slot !== undefined && beaconSlashingHrefFields.kind !== undefined && beaconSlashingHrefFields.indexInSlot !== undefined && beaconSlashingHrefFields.$network !== undefined && beaconSlashingHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', {
								slot: String(beaconSlashingHrefFields.slot ?? ''),
								kind: String(beaconSlashingHrefFields.kind ?? ''),
								index: String(beaconSlashingHrefFields.indexInSlot ?? ''),
								network: String(caip2StringFromValue(beaconSlashingHrefFields.$network.caip2) ?? ''),
							}) : beaconSlashingHrefFields.slot !== undefined && beaconSlashingHrefFields.kind !== undefined && beaconSlashingHrefFields.indexInSlot !== undefined && beaconSlashingHrefFields.$network !== undefined && beaconSlashingHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', {
								slot: String(beaconSlashingHrefFields.slot ?? ''),
								kind: String(beaconSlashingHrefFields.kind ?? ''),
								index: String(beaconSlashingHrefFields.indexInSlot ?? ''),
								network: String(beaconSlashingHrefFields.$network.slug ?? ''),
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
		entityType={EntityType.BeaconSlashing}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
