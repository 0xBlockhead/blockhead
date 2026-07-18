<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.CardanoTxInput>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CardanoTxInput>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const cardanoTxInput = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('Cardano transaction input')
	const viewDomId = $derived('cardano-tx-input-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import CardanoTxOutputView from '$/views/CardanoTxOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoTxInput}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoTxInput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<CardanoTransactionView
						selection={select(EntityType.CardanoTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>input index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									inputIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const inputIndex = resolvedEntity.inputIndex}
							{#if inputIndex !== undefined && inputIndex !== null}
								{String((inputIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							inputKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputKind = resolvedEntity.inputKind}
					{#if inputKind !== undefined && inputKind !== null}
						<div>
							<dt>input kind</dt>
							<dd>
								{String((inputKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							spentTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentTxHash = resolvedEntity.spentTxHash}
					{#if spentTxHash !== undefined && spentTxHash !== null}
						<div>
							<dt>spent transaction hash</dt>
							<dd>
								<TruncatedValue value={String((spentTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							spentOutputIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentOutputIndex = resolvedEntity.spentOutputIndex}
					{#if spentOutputIndex !== undefined && spentOutputIndex !== null}
						<div>
							<dt>spent output index</dt>
							<dd>
								{String((spentOutputIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$spentOutput}
			>
				{#snippet children(cardanoTxOutput)}
					{#if cardanoTxOutput != null && cardanoTxOutput[EntityMetaKey.Selector] != null}
						<div>
							<dt>spent output</dt>
							<dd>
								<CardanoTxOutputView
									selection={select(EntityType.CardanoTxOutput, cardanoTxOutput[EntityMetaKey.Selector])}
									prefetched={cardanoTxOutput}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							redeemerIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const redeemerIndex = resolvedEntity.redeemerIndex}
					{#if redeemerIndex !== undefined && redeemerIndex !== null}
						<div>
							<dt>redeemer index</dt>
							<dd>
								{String((redeemerIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
