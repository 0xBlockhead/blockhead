<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EthereumConsensusUpgrade>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EthereumConsensusUpgrade>>
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

	const ethereumConsensusUpgrade = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			protocol: true,
			activationBlock: true,
			activationEpoch: true,
			activationTimestampMs: true,
			...(open && {
				previousForkVersion: true,
				currentForkVersion: true,
				$$proposals: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.upgradeId) ?? '')].filter(Boolean).join(' ') || 'Ethereum consensus upgrade')
	const viewDomId = $derived('ethereum-consensus-upgrade-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumConsensusUpgrade}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/consensus/[upgradeSlug]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			upgradeSlug: String(({ ...selection.entitySelector, ...prefetched }).slug),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.upgradeId) ?? '')].filter(Boolean).join(' ') || 'Ethereum consensus upgrade'}
		{:else}
			<ResourceBoundary resource={ethereumConsensusUpgrade}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.upgradeId) ?? '')].filter(Boolean).join(' ') || 'Ethereum consensus upgrade'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.upgradeId) ?? '')].filter(Boolean).join(' ') || 'Ethereum consensus upgrade'}
		{:else}
			<ResourceBoundary resource={ethereumConsensusUpgrade}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.upgradeId) ?? '')].filter(Boolean).join(' ') || 'Ethereum consensus upgrade'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || [String((entity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={ethereumConsensusUpgrade}>
				{#snippet Pending()}
					{@const protocol = prefetched.protocol ?? selection.entitySelector.protocol}
					{#if protocol !== undefined && protocol !== null}
						<div>
							<dt>Consensus fork</dt>
							<dd>
								{String((protocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const protocol = entity.protocol ?? selection.entitySelector.protocol ?? prefetched.protocol}
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

			<ResourceBoundary resource={ethereumConsensusUpgrade}>
				{#snippet Pending()}
					{@const activationBlock = prefetched.activationBlock ?? selection.entitySelector.activationBlock}
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
					{@const activationBlock = entity.activationBlock ?? selection.entitySelector.activationBlock ?? prefetched.activationBlock}
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

			<ResourceBoundary resource={ethereumConsensusUpgrade}>
				{#snippet Pending()}
					{@const activationEpoch = prefetched.activationEpoch ?? selection.entitySelector.activationEpoch}
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
					{@const activationEpoch = entity.activationEpoch ?? selection.entitySelector.activationEpoch ?? prefetched.activationEpoch}
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

			<ResourceBoundary resource={ethereumConsensusUpgrade}>
				{#snippet Pending()}
					{@const activationTimestampMs = prefetched.activationTimestampMs ?? selection.entitySelector.activationTimestampMs}
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
					{@const activationTimestampMs = entity.activationTimestampMs ?? selection.entitySelector.activationTimestampMs ?? prefetched.activationTimestampMs}
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
				<ResourceBoundary resource={ethereumConsensusUpgrade}>
					{#snippet Pending()}
						{@const previousForkVersion = prefetched.previousForkVersion ?? selection.entitySelector.previousForkVersion}
						{#if previousForkVersion !== undefined && previousForkVersion !== null}
							<div>
								<dt>Previous fork version</dt>
								<dd>
									<TruncatedValue value={String(previousForkVersion)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const previousForkVersion = entity.previousForkVersion ?? selection.entitySelector.previousForkVersion ?? prefetched.previousForkVersion}
						{#if previousForkVersion !== undefined && previousForkVersion !== null}
							<div>
								<dt>Previous fork version</dt>
								<dd>
									<TruncatedValue value={String(previousForkVersion)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={ethereumConsensusUpgrade}>
					{#snippet Pending()}
						{@const currentForkVersion = prefetched.currentForkVersion ?? selection.entitySelector.currentForkVersion}
						{#if currentForkVersion !== undefined && currentForkVersion !== null}
							<div>
								<dt>Current fork version</dt>
								<dd>
									<TruncatedValue value={String(currentForkVersion)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const currentForkVersion = entity.currentForkVersion ?? selection.entitySelector.currentForkVersion ?? prefetched.currentForkVersion}
						{#if currentForkVersion !== undefined && currentForkVersion !== null}
							<div>
								<dt>Current fork version</dt>
								<dd>
									<TruncatedValue value={String(currentForkVersion)} />
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
