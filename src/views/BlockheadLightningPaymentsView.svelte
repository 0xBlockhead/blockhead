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
		title = 'Lightning payments',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningPayments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLightningPayment>
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
	entityType={EntityType.BlockheadLightningPayment}
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
				paymentHash: true,
				valueMsat: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLightningPayments) => [...new Map(blockheadLightningPayments.values.map((blockheadLightningPayment) => [blockheadLightningPayment[EntityMetaKey.SelectorKey], blockheadLightningPayment])).values()]}
	getKey={(blockheadLightningPayment) => blockheadLightningPayment[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lightning payments yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningPayment })}
		{@const blockheadLightningPaymentFields = { ...blockheadLightningPayment[EntityMetaKey.Selector], ...blockheadLightningPayment }}
		<EntityView
			entityType={EntityType.BlockheadLightningPayment}
			entitySelector={blockheadLightningPayment[EntityMetaKey.Selector]}
			href={
				(
					blockheadLightningPayment[EntityMetaKey.Selector] != null && 'paymentHash' in blockheadLightningPayment[EntityMetaKey.Selector]
					&& blockheadLightningPayment[EntityMetaKey.Selector].paymentHash != null
					&& blockheadLightningPayment[EntityMetaKey.Selector] != null && '$network' in blockheadLightningPayment[EntityMetaKey.Selector] ?
						blockheadLightningPayment[EntityMetaKey.Selector].$network != null && 'caip2' in blockheadLightningPayment[EntityMetaKey.Selector].$network
						&& blockheadLightningPayment[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/payments/[paymentHash=stringSegment]', {
						paymentHash: String(blockheadLightningPayment[EntityMetaKey.Selector].paymentHash ?? ''),
						network: String(caip2StringFromValue(blockheadLightningPayment[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							blockheadLightningPayment[EntityMetaKey.Selector].$network != null && 'slug' in blockheadLightningPayment[EntityMetaKey.Selector].$network
							&& blockheadLightningPayment[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/payments/[paymentHash=stringSegment]', {
							paymentHash: String(blockheadLightningPayment[EntityMetaKey.Selector].paymentHash ?? ''),
							network: String(blockheadLightningPayment[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((blockheadLightningPaymentFields.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning payment'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLightningPaymentFields.valueMsat) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
