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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BeaconWithdrawal>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BeaconWithdrawal}
			entitySelector={beaconWithdrawal[EntityMetaKey.Selector]}
			href={
				(
					beaconWithdrawal[EntityMetaKey.Selector] != null && 'slot' in beaconWithdrawal[EntityMetaKey.Selector]
					&& beaconWithdrawal[EntityMetaKey.Selector].slot != null
					&& beaconWithdrawal[EntityMetaKey.Selector] != null && 'indexInSlot' in beaconWithdrawal[EntityMetaKey.Selector]
					&& beaconWithdrawal[EntityMetaKey.Selector].indexInSlot != null
					&& beaconWithdrawal[EntityMetaKey.Selector] != null && '$network' in beaconWithdrawal[EntityMetaKey.Selector] ?
						beaconWithdrawal[EntityMetaKey.Selector].$network != null && 'caip2' in beaconWithdrawal[EntityMetaKey.Selector].$network
						&& beaconWithdrawal[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]', {
						slot: String(beaconWithdrawal[EntityMetaKey.Selector].slot ?? ''),
						index: String(beaconWithdrawal[EntityMetaKey.Selector].indexInSlot ?? ''),
						network: String(caip2StringFromValue(beaconWithdrawal[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							beaconWithdrawal[EntityMetaKey.Selector].$network != null && 'slug' in beaconWithdrawal[EntityMetaKey.Selector].$network
							&& beaconWithdrawal[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]', {
							slot: String(beaconWithdrawal[EntityMetaKey.Selector].slot ?? ''),
							index: String(beaconWithdrawal[EntityMetaKey.Selector].indexInSlot ?? ''),
							network: String(beaconWithdrawal[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{(String((beaconWithdrawalFields.indexInSlot) ?? '') ? 'Withdrawal #' + String((beaconWithdrawalFields.indexInSlot) ?? '') : '') || 'beacon withdrawal'}
			{/snippet}

			{#snippet Value()}
				{[(String((beaconWithdrawalFields.amountGwei) ?? '') ? String((beaconWithdrawalFields.amountGwei) ?? '') + ' gwei' : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((beaconWithdrawalFields.slot) ?? '') ? 'Slot ' + String((beaconWithdrawalFields.slot) ?? '') : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
