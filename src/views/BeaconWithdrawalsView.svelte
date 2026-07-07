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
		placeholderText,
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
			selection({
				fields: {
					indexInSlot: true,
					amountGwei: true,
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
				entityType={EntityType.BeaconWithdrawal}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
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
				totalCount={beaconWithdrawals.totalCount}
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
					{@const beaconWithdrawalFields = { ...beaconWithdrawal[EntityMetaKey.Selector], ...beaconWithdrawal }}
					{@const beaconWithdrawalHrefFields = { ...beaconWithdrawal, ...beaconWithdrawal[EntityMetaKey.Selector] }}
					<BeaconWithdrawalView
						selection={select(EntityType.BeaconWithdrawal, beaconWithdrawal[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={beaconWithdrawalFields}
						href={
							(beaconWithdrawalHrefFields.$network !== undefined && beaconWithdrawalHrefFields.$network.caip2 !== undefined && beaconWithdrawalHrefFields.$network.caip2.namespace !== undefined && beaconWithdrawalHrefFields.$network !== undefined && beaconWithdrawalHrefFields.$network.caip2 !== undefined && beaconWithdrawalHrefFields.$network.caip2.reference !== undefined && beaconWithdrawalHrefFields.slot !== undefined && beaconWithdrawalHrefFields.indexInSlot !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]', {
								caip2: `${String(beaconWithdrawalHrefFields.$network.caip2.namespace ?? '')}:${String(beaconWithdrawalHrefFields.$network.caip2.reference ?? '')}`,
								slot: String(beaconWithdrawalHrefFields.slot ?? ''),
								index: String(beaconWithdrawalHrefFields.indexInSlot ?? ''),
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
		entityType={EntityType.BeaconWithdrawal}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
