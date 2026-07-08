<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoTxOutput>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoTxOutput>>
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
	const cardanoTxOutput = $derived(selection({}))
	const titleFallback = $derived('Cardano transaction output')
	const viewDomId = $derived('cardano-tx-output-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoTxOutput}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoTxOutput}>
			{#snippet Pending()}
				{title || 'Cardano transaction output'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
				<dt>output index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									outputIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const outputIndex = selection.entitySelector.outputIndex ?? prefetched.outputIndex}
							{#if outputIndex !== undefined && outputIndex !== null}
								{String((outputIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outputIndex = resolvedEntity.outputIndex}
							{#if outputIndex !== undefined && outputIndex !== null}
								{String((outputIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const address = prefetched.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address = resolvedEntity.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$address}
			>
				{#snippet children(cardanoAddress)}
					{#if cardanoAddress != null && cardanoAddress[EntityMetaKey.Selector] != null}
						<div>
							<dt>Address</dt>
							<dd>
								<CardanoAddressView
									selection={select(EntityType.CardanoAddress, cardanoAddress[EntityMetaKey.Selector])}
									prefetched={cardanoAddress}
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
						fields: {
							lovelace: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lovelace = prefetched.lovelace}
					{#if lovelace !== undefined && lovelace !== null}
						<div>
							<dt>lovelace</dt>
							<dd>
								{String((lovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lovelace = resolvedEntity.lovelace}
					{#if lovelace !== undefined && lovelace !== null}
						<div>
							<dt>lovelace</dt>
							<dd>
								{String((lovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							datumHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const datumHash = prefetched.datumHash}
					{#if datumHash !== undefined && datumHash !== null}
						<div>
							<dt>datum hash</dt>
							<dd>
								<TruncatedValue value={String((datumHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datumHash = resolvedEntity.datumHash}
					{#if datumHash !== undefined && datumHash !== null}
						<div>
							<dt>datum hash</dt>
							<dd>
								<TruncatedValue value={String((datumHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							referenceScriptHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const referenceScriptHash = prefetched.referenceScriptHash}
					{#if referenceScriptHash !== undefined && referenceScriptHash !== null}
						<div>
							<dt>reference script hash</dt>
							<dd>
								<TruncatedValue value={String((referenceScriptHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const referenceScriptHash = resolvedEntity.referenceScriptHash}
					{#if referenceScriptHash !== undefined && referenceScriptHash !== null}
						<div>
							<dt>reference script hash</dt>
							<dd>
								<TruncatedValue value={String((referenceScriptHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spentByTxHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spentByTxHash = prefetched.spentByTxHash}
					{#if spentByTxHash !== undefined && spentByTxHash !== null}
						<div>
							<dt>spent by transaction hash</dt>
							<dd>
								<TruncatedValue value={String((spentByTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentByTxHash = resolvedEntity.spentByTxHash}
					{#if spentByTxHash !== undefined && spentByTxHash !== null}
						<div>
							<dt>spent by transaction hash</dt>
							<dd>
								<TruncatedValue value={String((spentByTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spentByInputIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spentByInputIndex = prefetched.spentByInputIndex}
					{#if spentByInputIndex !== undefined && spentByInputIndex !== null}
						<div>
							<dt>spent by input index</dt>
							<dd>
								{String((spentByInputIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentByInputIndex = resolvedEntity.spentByInputIndex}
					{#if spentByInputIndex !== undefined && spentByInputIndex !== null}
						<div>
							<dt>spent by input index</dt>
							<dd>
								{String((spentByInputIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
