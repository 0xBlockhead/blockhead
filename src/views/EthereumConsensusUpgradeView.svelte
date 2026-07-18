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
	import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EthereumConsensusUpgrade>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EthereumConsensusUpgrade>>
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
	const ethereumConsensusUpgrade = $derived(selection({
		sources: selection.sources,
		fields: {
			name: true,
			protocol: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum consensus upgrade')
	const viewDomId = $derived('ethereum-consensus-upgrade-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumConsensusUpgrade}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.slug !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/consensus/[upgradeSlug=stringSegment]', {
			upgradeSlug: String(pendingEntity.slug ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.slug !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/consensus/[upgradeSlug=stringSegment]', {
			upgradeSlug: String(pendingEntity.slug ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={ethereumConsensusUpgrade}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.upgradeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={ethereumConsensusUpgrade}>
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
							protocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocol = resolvedEntity.protocol}
					{#if protocol !== undefined && protocol !== null}
						<div>
							<dt>Consensus fork</dt>
							<dd>
								{String((protocol) ?? '')}
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
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								previousForkVersion: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const previousForkVersion = resolvedEntity.previousForkVersion}
						{#if previousForkVersion !== undefined && previousForkVersion !== null}
							<div>
								<dt>Previous fork version</dt>
								<dd>
									<TruncatedValue value={String((previousForkVersion) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								currentForkVersion: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const currentForkVersion = resolvedEntity.currentForkVersion}
						{#if currentForkVersion !== undefined && currentForkVersion !== null}
							<div>
								<dt>Current fork version</dt>
								<dd>
									<TruncatedValue value={String((currentForkVersion) ?? '')} />
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
						selection.$$proposals({
							count: true,
						})
					}
				title='Specification proposals'
				emptyText='No specification proposals for this upgrade.'
				id='SpecificationProposalsView-proposals'
			/>
		{/if}
	{/snippet}
</EntityView>
