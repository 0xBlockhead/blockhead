<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Lightning payment observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningPayment_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLightningPayment_Timestamp>
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
	entityType={EntityType.BlockheadLightningPayment_Timestamp}
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
				timestampMs: true,
				status: true,
				feeMsat: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLightningPaymentTimestamps) => [...new Map(blockheadLightningPaymentTimestamps.values.map((blockheadLightningPaymentTimestamp) => [blockheadLightningPaymentTimestamp[EntityMetaKey.SelectorKey], blockheadLightningPaymentTimestamp])).values()]}
	getKey={(blockheadLightningPaymentTimestamp) => blockheadLightningPaymentTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lightning payment observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningPaymentTimestamp })}
		{@const blockheadLightningPaymentTimestampFields = { ...blockheadLightningPaymentTimestamp[EntityMetaKey.Selector], ...blockheadLightningPaymentTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadLightningPayment_Timestamp}
			entitySelector={blockheadLightningPaymentTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLightningPaymentTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Lightning payment timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLightningPaymentTimestampFields.status) ?? ''), String((blockheadLightningPaymentTimestampFields.feeMsat) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
