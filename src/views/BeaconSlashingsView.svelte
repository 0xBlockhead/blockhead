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
		title = 'Slashings',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconSlashings-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconSlashing>
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

				{#snippet Item({ item: beaconSlashing }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconSlashing> })}
					{@const beaconSlashingFields = { ...beaconSlashing[EntityMetaKey.Selector], ...beaconSlashing }}
					{@const beaconSlashingHrefFields = { ...beaconSlashing, ...beaconSlashing[EntityMetaKey.Selector] }}
					<BeaconSlashingView
						selection={select(EntityType.BeaconSlashing, beaconSlashing[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={beaconSlashingFields}
						href={
							(beaconSlashingHrefFields.$network !== undefined && beaconSlashingHrefFields.$network.slug !== undefined && beaconSlashingHrefFields.slot !== undefined && beaconSlashingHrefFields.kind !== undefined && beaconSlashingHrefFields.indexInSlot !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', {
								network: String(beaconSlashingHrefFields.$network.slug ?? ''),
								slot: String(beaconSlashingHrefFields.slot ?? ''),
								kind: String(beaconSlashingHrefFields.kind ?? ''),
								index: String(beaconSlashingHrefFields.indexInSlot ?? ''),
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
