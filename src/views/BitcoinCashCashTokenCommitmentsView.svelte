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
		title = 'Bitcoin Cash CashToken commitments',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashCashTokenCommitments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitcoinCashCashTokenCommitment>
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
	entityType={EntityType.BitcoinCashCashTokenCommitment}
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
				commitmentHex: true,
				$output: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bitcoinCashCashTokenCommitments) => [...new Map(bitcoinCashCashTokenCommitments.values.map((bitcoinCashCashTokenCommitment) => [bitcoinCashCashTokenCommitment[EntityMetaKey.SelectorKey], bitcoinCashCashTokenCommitment])).values()]}
	getKey={(bitcoinCashCashTokenCommitment) => bitcoinCashCashTokenCommitment[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bitcoin Cash CashToken commitments yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitcoinCashCashTokenCommitment })}
		{@const bitcoinCashCashTokenCommitmentFields = { ...bitcoinCashCashTokenCommitment[EntityMetaKey.Selector], ...bitcoinCashCashTokenCommitment }}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenCommitment}
			entitySelector={bitcoinCashCashTokenCommitment[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitcoinCashCashTokenCommitmentFields.commitmentHex) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken commitment'}
			{/snippet}

			{#snippet Value()}
				{[String((bitcoinCashCashTokenCommitmentFields.commitmentHex) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((bitcoinCashCashTokenCommitmentFields.$output.indexInTransaction) ?? '') ? 'Output #' + String((bitcoinCashCashTokenCommitmentFields.$output.indexInTransaction) ?? '') : '') || 'UTXO output'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
