<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoGovernanceProposal>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoGovernanceProposal>>
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
	const cardanoGovernanceProposal = $derived(selection({}))
	const titleFallback = $derived('Cardano governance proposal')
	const viewDomId = $derived('cardano-governance-proposal-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoNetworkView from '$/views/CardanoNetworkView.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoGovernanceProposal}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoGovernanceProposal}>
			{#snippet Pending()}
				{title || 'Cardano governance proposal'}
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
				<dt>network</dt>
				<dd>
					<CardanoNetworkView
						selection={select(EntityType.CardanoNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>proposal transaction hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									proposalTxHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const proposalTxHash = selection.entitySelector.proposalTxHash ?? prefetched.proposalTxHash}
							{#if proposalTxHash !== undefined && proposalTxHash !== null}
								<TruncatedValue value={String((proposalTxHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const proposalTxHash = resolvedEntity.proposalTxHash}
							{#if proposalTxHash !== undefined && proposalTxHash !== null}
								<TruncatedValue value={String((proposalTxHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>proposal index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									proposalIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const proposalIndex = selection.entitySelector.proposalIndex ?? prefetched.proposalIndex}
							{#if proposalIndex !== undefined && proposalIndex !== null}
								{String((proposalIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const proposalIndex = resolvedEntity.proposalIndex}
							{#if proposalIndex !== undefined && proposalIndex !== null}
								{String((proposalIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>proposal kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									proposalKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const proposalKind = prefetched.proposalKind}
							{#if proposalKind !== undefined && proposalKind !== null}
								{String((proposalKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const proposalKind = resolvedEntity.proposalKind}
							{#if proposalKind !== undefined && proposalKind !== null}
								{String((proposalKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.CardanoTransaction, false>('$transaction')}
			>
				{#snippet children(cardanoTransaction)}
					{#if cardanoTransaction != null && cardanoTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<CardanoTransactionView
									selection={select(EntityType.CardanoTransaction, cardanoTransaction[EntityMetaKey.Selector])}
									prefetched={cardanoTransaction}
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
							depositLovelace: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const depositLovelace = prefetched.depositLovelace}
					{#if depositLovelace !== undefined && depositLovelace !== null}
						<div>
							<dt>deposit lovelace</dt>
							<dd>
								{String((depositLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const depositLovelace = resolvedEntity.depositLovelace}
					{#if depositLovelace !== undefined && depositLovelace !== null}
						<div>
							<dt>deposit lovelace</dt>
							<dd>
								{String((depositLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							returnAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const returnAddress = prefetched.returnAddress}
					{#if returnAddress !== undefined && returnAddress !== null}
						<div>
							<dt>return address</dt>
							<dd>
								<TruncatedValue value={String((returnAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const returnAddress = resolvedEntity.returnAddress}
					{#if returnAddress !== undefined && returnAddress !== null}
						<div>
							<dt>return address</dt>
							<dd>
								<TruncatedValue value={String((returnAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							anchorUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const anchorUrl = prefetched.anchorUrl}
					{#if anchorUrl !== undefined && anchorUrl !== null}
						<div>
							<dt>anchor URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(anchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(anchorUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const anchorUrl = resolvedEntity.anchorUrl}
					{#if anchorUrl !== undefined && anchorUrl !== null}
						<div>
							<dt>anchor URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(anchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(anchorUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							anchorHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const anchorHash = prefetched.anchorHash}
					{#if anchorHash !== undefined && anchorHash !== null}
						<div>
							<dt>anchor hash</dt>
							<dd>
								<TruncatedValue value={String((anchorHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const anchorHash = resolvedEntity.anchorHash}
					{#if anchorHash !== undefined && anchorHash !== null}
						<div>
							<dt>anchor hash</dt>
							<dd>
								<TruncatedValue value={String((anchorHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
