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
		title = 'Withdrawals',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Beacon withdrawals...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconWithdrawals-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconWithdrawal>
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
	import BeaconWithdrawalView from '$/views/BeaconWithdrawalView.svelte'
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
					amountGwei: true,
					slot: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconWithdrawal}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(beaconWithdrawals)}
			{@const uniqueBeaconWithdrawals = [...new Map(beaconWithdrawals.values.map((beaconWithdrawal) => [beaconWithdrawal[EntityMetaKey.SelectorKey], beaconWithdrawal])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconWithdrawal}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={beaconWithdrawals.values.length === uniqueBeaconWithdrawals.length && beaconWithdrawals.totalCount != null && beaconWithdrawals.totalCount >= uniqueBeaconWithdrawals.length ? beaconWithdrawals.totalCount : uniqueBeaconWithdrawals.length}
				getKey={(beaconWithdrawal) => beaconWithdrawal[EntityMetaKey.SelectorKey]}
				items={uniqueBeaconWithdrawals}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Beacon withdrawals yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: beaconWithdrawal }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconWithdrawal> })}
					<BeaconWithdrawalView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]', {
								caip2: `${String(({ ...beaconWithdrawal.entitySelector, ...beaconWithdrawal }).caip2.namespace)}:${String(({ ...beaconWithdrawal.entitySelector, ...beaconWithdrawal }).caip2.reference)}`,
								slot: String(({ ...beaconWithdrawal.entitySelector, ...beaconWithdrawal }).slot),
								index: String(({ ...beaconWithdrawal.entitySelector, ...beaconWithdrawal }).indexInSlot),
							})
						}
						selection={select(EntityType.BeaconWithdrawal, beaconWithdrawal.entitySelector)}
						prefetched={beaconWithdrawal}
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
		entityType={EntityType.BeaconWithdrawal}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
