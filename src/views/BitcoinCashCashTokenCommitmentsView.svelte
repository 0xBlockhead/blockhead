<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitcoinCashCashTokenCommitment>
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
	import BitcoinCashCashTokenCommitmentView from '$/views/BitcoinCashCashTokenCommitmentView.svelte'
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
		{@const selection = select(EntityType.BitcoinCashCashTokenCommitment, bitcoinCashCashTokenCommitment[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitcoinCashCashTokenCommitmentView
			selection={selection}
			prefetched={bitcoinCashCashTokenCommitmentFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
