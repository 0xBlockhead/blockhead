<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EthereumNetworkUpgrade>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EthereumNetworkUpgrade>>
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
	const ethereumNetworkUpgrade = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.upgradeId) ?? '')].filter(Boolean).join(' ') || [String((prefetched.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum network upgrade')
	const viewDomId = $derived('ethereum-network-upgrade-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumNetworkUpgrade}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.slug !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			upgradeSlug: String(pendingEntity.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ethereumNetworkUpgrade}>
			{#snippet Pending()}
				{[String((prefetched.upgradeId) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum network upgrade'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ethereumNetworkUpgrade}>
			{#snippet Pending()}
				{[String((prefetched.upgradeId) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum network upgrade'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							activationBlock: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activationBlock = prefetched.activationBlock}
					{#if activationBlock !== undefined && activationBlock !== null}
						<div>
							<dt>Activation block</dt>
							<dd>
								<NumberValue value={Number(activationBlock)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationBlock = resolvedEntity.activationBlock}
					{#if activationBlock !== undefined && activationBlock !== null}
						<div>
							<dt>Activation block</dt>
							<dd>
								<NumberValue value={Number(activationBlock)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activationEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activationEpoch = prefetched.activationEpoch}
					{#if activationEpoch !== undefined && activationEpoch !== null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue value={Number(activationEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationEpoch = resolvedEntity.activationEpoch}
					{#if activationEpoch !== undefined && activationEpoch !== null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue value={Number(activationEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activationTimestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activationTimestampMs = prefetched.activationTimestampMs}
					{#if activationTimestampMs !== undefined && activationTimestampMs !== null}
						<div>
							<dt>Activation time</dt>
							<dd>
								<Timestamp timestamp={Number(activationTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationTimestampMs = resolvedEntity.activationTimestampMs}
					{#if activationTimestampMs !== undefined && activationTimestampMs !== null}
						<div>
							<dt>Activation time</dt>
							<dd>
								<Timestamp timestamp={Number(activationTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<div>
					<dt>Execution layer</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection[EntityProxyField]<EntityType.EthereumExecutionUpgrade, false>('$networkExecutionUpgrade', {
									sources: [
										Source.Constants_Internal,
									],
								})
							}
						>
							{#snippet children(ethereumExecutionUpgrade)}
								{#if ethereumExecutionUpgrade[EntityMetaKey.Selector] != null}
									<EthereumExecutionUpgradeView
										selection={select(EntityType.EthereumExecutionUpgrade, ethereumExecutionUpgrade[EntityMetaKey.Selector])}
										prefetched={ethereumExecutionUpgrade}
										href={
											(ethereumExecutionUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2 !== undefined && ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && ethereumExecutionUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2 !== undefined && ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.reference !== undefined && ethereumExecutionUpgrade[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/execution/[upgradeSlug]', {
												caip2: `${String(ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
												upgradeSlug: String(ethereumExecutionUpgrade[EntityMetaKey.Selector].slug ?? ''),
											}) : undefined)
										}
										layout={EntityLayout.Value}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection[EntityProxyField]<EntityType.EthereumConsensusUpgrade, false>('$networkConsensusUpgrade', {
							sources: [
								Source.Constants_Internal,
							],
						})
					}
				>
					{#snippet children(ethereumConsensusUpgrade)}
						{#if ethereumConsensusUpgrade != null && ethereumConsensusUpgrade[EntityMetaKey.Selector] != null}
							<div>
								<dt>Consensus layer</dt>
								<dd>
									<EthereumConsensusUpgradeView
										selection={select(EntityType.EthereumConsensusUpgrade, ethereumConsensusUpgrade[EntityMetaKey.Selector])}
										prefetched={ethereumConsensusUpgrade}
										href={
											(ethereumConsensusUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2 !== undefined && ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && ethereumConsensusUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2 !== undefined && ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.reference !== undefined && ethereumConsensusUpgrade[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/consensus/[upgradeSlug]', {
												caip2: `${String(ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
												upgradeSlug: String(ethereumConsensusUpgrade[EntityMetaKey.Selector].slug ?? ''),
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
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<SpecificationProposalsView
				selection={
						selection[EntityProxyField]<EntityType.SpecificationProposal>('$$proposals', {
							sources: [
								Source.Constants_Internal,
							],
						})
					}
				title='Specification proposals'
				emptyText='No specification proposals for this upgrade.'
				id='SpecificationProposalsView-$$proposals'
			/>
		{/if}
	{/snippet}
</EntityView>
