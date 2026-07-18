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
		title = 'Withdrawals',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconWithdrawals-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BeaconWithdrawal>
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
	import BeaconWithdrawalView from '$/views/BeaconWithdrawalView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconWithdrawal}
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
				amountGwei: true,
				slot: true,
				$network: true,
			},
		})
	}
	getResourceItems={(beaconWithdrawals) => [...new Map(beaconWithdrawals.values.map((beaconWithdrawal) => [beaconWithdrawal[EntityMetaKey.SelectorKey], beaconWithdrawal])).values()]}
	getKey={(beaconWithdrawal) => beaconWithdrawal[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Beacon withdrawals yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: beaconWithdrawal })}
		{@const beaconWithdrawalFields = { ...beaconWithdrawal[EntityMetaKey.Selector], ...beaconWithdrawal }}
		{@const selection = select(EntityType.BeaconWithdrawal, beaconWithdrawal[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const beaconWithdrawalHrefFields = { ...beaconWithdrawal, ...beaconWithdrawal[EntityMetaKey.Selector] }}
		<BeaconWithdrawalView
			selection={selection}
			prefetched={beaconWithdrawalFields}
			href={
				(beaconWithdrawalHrefFields.slot !== undefined && beaconWithdrawalHrefFields.indexInSlot !== undefined && beaconWithdrawalHrefFields.$network !== undefined && beaconWithdrawalHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]', {
					slot: String(beaconWithdrawalHrefFields.slot ?? ''),
					index: String(beaconWithdrawalHrefFields.indexInSlot ?? ''),
					network: String(caip2StringFromValue(beaconWithdrawalHrefFields.$network.caip2) ?? ''),
				}) : beaconWithdrawalHrefFields.slot !== undefined && beaconWithdrawalHrefFields.indexInSlot !== undefined && beaconWithdrawalHrefFields.$network !== undefined && beaconWithdrawalHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]', {
					slot: String(beaconWithdrawalHrefFields.slot ?? ''),
					index: String(beaconWithdrawalHrefFields.indexInSlot ?? ''),
					network: String(beaconWithdrawalHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
