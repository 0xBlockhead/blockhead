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
		placeholderText = 'Loading Beacon slashings...',
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
			selection.sources == null ? selection({
				fields: {
					indexInSlot: true,
					kind: true,
					slot: true,
				},
			}) : selection
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
				totalCount={beaconSlashings.values.length === uniqueBeaconSlashings.length && beaconSlashings.totalCount != null && beaconSlashings.totalCount >= uniqueBeaconSlashings.length ? beaconSlashings.totalCount : uniqueBeaconSlashings.length}
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
					<BeaconSlashingView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/slashing/[kind]/[index=nonNegativeInteger]', {
								caip2: `${String(({ ...beaconSlashing.entitySelector, ...beaconSlashing }).caip2.namespace)}:${String(({ ...beaconSlashing.entitySelector, ...beaconSlashing }).caip2.reference)}`,
								slot: String(({ ...beaconSlashing.entitySelector, ...beaconSlashing }).slot),
								kind: String(({ ...beaconSlashing.entitySelector, ...beaconSlashing }).kind),
								index: String(({ ...beaconSlashing.entitySelector, ...beaconSlashing }).indexInSlot),
							})
						}
						selection={select(EntityType.BeaconSlashing, beaconSlashing.entitySelector)}
						prefetched={beaconSlashing}
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
