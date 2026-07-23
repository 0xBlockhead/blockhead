<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.EthereumNetworkUpgrade>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EthereumNetworkUpgrade>
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
	const ethereumNetworkUpgrade = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			name: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			name: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum network upgrade')
	const viewDomId = $derived('ethereum-network-upgrade-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'slug' in selection.entitySelector
			&& selection.entitySelector.slug != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
				upgradeSlug: String(selection.entitySelector.slug ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
					upgradeSlug: String(selection.entitySelector.slug ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'upgradeId') && Object.hasOwn(prefetched, 'name')}
			{[String((pendingEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={ethereumNetworkUpgrade}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'upgradeId') && Object.hasOwn(prefetched, 'name')}
			{[String((pendingEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={ethereumNetworkUpgrade}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							activationBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationBlock = resolvedEntity.activationBlock}
					{#if activationBlock !== undefined && activationBlock !== null}
						<div>
							<dt>Activation block</dt>
							<dd>
								<NumberValue
									value={activationBlock}
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
							activationEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationEpoch = resolvedEntity.activationEpoch}
					{#if activationEpoch !== undefined && activationEpoch !== null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue
									value={activationEpoch}
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
							activationTimestampMs: true,
						},
					})
				}
			>
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
								selection
									.$networkExecutionUpgrade({
										sources: [
											Source.Constants_Internal,
										],
									})
							}
						>
							{#snippet children(ethereumExecutionUpgrade)}
								{#if ethereumExecutionUpgrade != null && ethereumExecutionUpgrade[EntityMetaKey.Selector] != null}
									<EthereumExecutionUpgradeView
										selection={select(EntityType.EthereumExecutionUpgrade, ethereumExecutionUpgrade[EntityMetaKey.Selector])}
										prefetched={ethereumExecutionUpgrade}
										href={
											(
												ethereumExecutionUpgrade[EntityMetaKey.Selector] != null && 'slug' in ethereumExecutionUpgrade[EntityMetaKey.Selector]
												&& ethereumExecutionUpgrade[EntityMetaKey.Selector].slug != null
												&& ethereumExecutionUpgrade[EntityMetaKey.Selector] != null && '$network' in ethereumExecutionUpgrade[EntityMetaKey.Selector] ?
													ethereumExecutionUpgrade[EntityMetaKey.Selector].$network != null && 'caip2' in ethereumExecutionUpgrade[EntityMetaKey.Selector].$network
													&& ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2 != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/execution/[upgradeSlug=stringSegment]', {
													upgradeSlug: String(ethereumExecutionUpgrade[EntityMetaKey.Selector].slug ?? ''),
													network: String(caip2StringFromValue(ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2) ?? ''),
												})
												:
														ethereumExecutionUpgrade[EntityMetaKey.Selector].$network != null && 'slug' in ethereumExecutionUpgrade[EntityMetaKey.Selector].$network
														&& ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.slug != null ?
															resolve('/network/[network=networkCaip2OrNetworkSlug]/execution/[upgradeSlug=stringSegment]', {
														upgradeSlug: String(ethereumExecutionUpgrade[EntityMetaKey.Selector].slug ?? ''),
														network: String(ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.slug ?? ''),
													})
													:
														undefined
											:
													undefined
											)
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
						selection
							.$networkConsensusUpgrade({
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
											(
												ethereumConsensusUpgrade[EntityMetaKey.Selector] != null && 'slug' in ethereumConsensusUpgrade[EntityMetaKey.Selector]
												&& ethereumConsensusUpgrade[EntityMetaKey.Selector].slug != null
												&& ethereumConsensusUpgrade[EntityMetaKey.Selector] != null && '$network' in ethereumConsensusUpgrade[EntityMetaKey.Selector] ?
													ethereumConsensusUpgrade[EntityMetaKey.Selector].$network != null && 'caip2' in ethereumConsensusUpgrade[EntityMetaKey.Selector].$network
													&& ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2 != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/consensus/[upgradeSlug=stringSegment]', {
													upgradeSlug: String(ethereumConsensusUpgrade[EntityMetaKey.Selector].slug ?? ''),
													network: String(caip2StringFromValue(ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2) ?? ''),
												})
												:
														ethereumConsensusUpgrade[EntityMetaKey.Selector].$network != null && 'slug' in ethereumConsensusUpgrade[EntityMetaKey.Selector].$network
														&& ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.slug != null ?
															resolve('/network/[network=networkCaip2OrNetworkSlug]/consensus/[upgradeSlug=stringSegment]', {
														upgradeSlug: String(ethereumConsensusUpgrade[EntityMetaKey.Selector].slug ?? ''),
														network: String(ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.slug ?? ''),
													})
													:
														undefined
											:
													undefined
											)
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
				{@const ethereumNetworkUpgradeSpecificationProposalsViewProposalsResource = selection
		.$$proposals({
			sources: [
				Source.Constants_Internal,
			],
		})}
				<ResourceBoundary
					resource={ethereumNetworkUpgradeSpecificationProposalsViewProposalsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<SpecificationProposalsView
							selection={ethereumNetworkUpgradeSpecificationProposalsViewProposalsResource}
							countResource={ethereumNetworkUpgradeSpecificationProposalsViewProposalsResource.count}
							title='Specification proposals'
							id='SpecificationProposalsView-proposals'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
