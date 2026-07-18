<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.CardanoCertificate>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CardanoCertificate>>
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
	const cardanoCertificate = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('Cardano certificate')
	const viewDomId = $derived('cardano-certificate-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import CardanoStakeCredentialView from '$/views/CardanoStakeCredentialView.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoCertificate}
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
			<ResourceBoundary resource={cardanoCertificate}>
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
				<dt>certificate index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									certificateIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const certificateIndex = resolvedEntity.certificateIndex}
							{#if certificateIndex !== undefined && certificateIndex !== null}
								{String((certificateIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>certificate kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									certificateKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const certificateKind = resolvedEntity.certificateKind}
							{#if certificateKind !== undefined && certificateKind !== null}
								{String((certificateKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$stakeCredential}
			>
				{#snippet children(cardanoStakeCredential)}
					{#if cardanoStakeCredential != null && cardanoStakeCredential[EntityMetaKey.Selector] != null}
						<div>
							<dt>stake credential</dt>
							<dd>
								<CardanoStakeCredentialView
									selection={select(EntityType.CardanoStakeCredential, cardanoStakeCredential[EntityMetaKey.Selector])}
									prefetched={cardanoStakeCredential}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$stakePool}
			>
				{#snippet children(cardanoStakePool)}
					{#if cardanoStakePool != null && cardanoStakePool[EntityMetaKey.Selector] != null}
						<div>
							<dt>stake pool</dt>
							<dd>
								<CardanoStakePoolView
									selection={select(EntityType.CardanoStakePool, cardanoStakePool[EntityMetaKey.Selector])}
									prefetched={cardanoStakePool}
									href={
										(cardanoStakePool[EntityMetaKey.Selector].poolId !== undefined && cardanoStakePool[EntityMetaKey.Selector].$network !== undefined && cardanoStakePool[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
											poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
											network: String(caip2StringFromValue(cardanoStakePool[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : cardanoStakePool[EntityMetaKey.Selector].poolId !== undefined && cardanoStakePool[EntityMetaKey.Selector].$network !== undefined && cardanoStakePool[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
											poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
											network: String(cardanoStakePool[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$drep}
			>
				{#snippet children(cardanoDRep)}
					{#if cardanoDRep != null && cardanoDRep[EntityMetaKey.Selector] != null}
						<div>
							<dt>drep</dt>
							<dd>
								<CardanoDRepView
									selection={select(EntityType.CardanoDRep, cardanoDRep[EntityMetaKey.Selector])}
									prefetched={cardanoDRep}
									href={
										(cardanoDRep[EntityMetaKey.Selector].drepCredential !== undefined && cardanoDRep[EntityMetaKey.Selector].$network !== undefined && cardanoDRep[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
											drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
											network: String(caip2StringFromValue(cardanoDRep[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : cardanoDRep[EntityMetaKey.Selector].drepCredential !== undefined && cardanoDRep[EntityMetaKey.Selector].$network !== undefined && cardanoDRep[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
											drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
											network: String(cardanoDRep[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
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
							poolId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const poolId = resolvedEntity.poolId}
					{#if poolId !== undefined && poolId !== null}
						<div>
							<dt>pool ID</dt>
							<dd>
								{String((poolId) ?? '')}
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
							rewardAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardAddress = resolvedEntity.rewardAddress}
					{#if rewardAddress !== undefined && rewardAddress !== null}
						<div>
							<dt>reward address</dt>
							<dd>
								<TruncatedValue value={String((rewardAddress) ?? '')} />
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
							depositLovelace: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epoch = resolvedEntity.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>epoch</dt>
							<dd>
								{String((epoch) ?? '')}
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
							metadataUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataUrl = resolvedEntity.metadataUrl}
					{#if metadataUrl !== undefined && metadataUrl !== null}
						<div>
							<dt>metadata URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(metadataUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(metadataUrl)} />
								</svelte:element>
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
							metadataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataHash = resolvedEntity.metadataHash}
					{#if metadataHash !== undefined && metadataHash !== null}
						<div>
							<dt>metadata hash</dt>
							<dd>
								<TruncatedValue value={String((metadataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
