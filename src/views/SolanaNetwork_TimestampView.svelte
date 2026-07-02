<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaNetwork_Timestamp>>
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

	const solanaNetworkTimestamp = $derived(selection({
		fields: {
			absoluteSlot: true,
			blockHeight: true,
			health: true,
			epoch: true,
			slotIndex: true,
			slotsInEpoch: true,
			transactionCount: true,
			currentValidatorCount: true,
			delinquentValidatorCount: true,
			totalActivatedStakeLamports: true,
			solanaCoreVersion: true,
			featureSet: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || 'solana network timestamp')
	const viewDomId = $derived('solana-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaNetworkView from '$/views/SolanaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/observations/[timestampMs=nonNegativeInteger]/[source]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'solana network timestamp'}
		{:else}
			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'solana network timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).absoluteSlot) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).blockHeight) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'solana network timestamp'}
		{:else}
			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).absoluteSlot) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).blockHeight) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'solana network timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.absoluteSlot) ?? ''), String((entity.blockHeight) ?? '')].filter(Boolean).join(' ') || [String((entity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const health0 = prefetched.health}
			{#if health0 !== undefined && health0 !== null}
				<span data-text="muted">
					{String((health0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const health0 = prefetched.health}
					{#if health0 !== undefined && health0 !== null}
						<span data-text="muted">
							{String((health0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const health0 = entity.health}
					{#if health0 !== undefined && health0 !== null}
						<span data-text="muted">
							{String((health0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary resource={solanaNetworkTimestamp}>
						{#snippet Pending()}
							{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const epoch = prefetched.epoch ?? selection.entitySelector.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>Epoch</dt>
							<dd>
								{String((epoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const epoch = entity.epoch ?? selection.entitySelector.epoch ?? prefetched.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>Epoch</dt>
							<dd>
								{String((epoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const slotIndex = prefetched.slotIndex ?? selection.entitySelector.slotIndex}
					{#if slotIndex !== undefined && slotIndex !== null}
						<div>
							<dt>Slot index</dt>
							<dd>
								{String((slotIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const slotIndex = entity.slotIndex ?? selection.entitySelector.slotIndex ?? prefetched.slotIndex}
					{#if slotIndex !== undefined && slotIndex !== null}
						<div>
							<dt>Slot index</dt>
							<dd>
								{String((slotIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const slotsInEpoch = prefetched.slotsInEpoch ?? selection.entitySelector.slotsInEpoch}
					{#if slotsInEpoch !== undefined && slotsInEpoch !== null}
						<div>
							<dt>Slots in epoch</dt>
							<dd>
								{String((slotsInEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const slotsInEpoch = entity.slotsInEpoch ?? selection.entitySelector.slotsInEpoch ?? prefetched.slotsInEpoch}
					{#if slotsInEpoch !== undefined && slotsInEpoch !== null}
						<div>
							<dt>Slots in epoch</dt>
							<dd>
								{String((slotsInEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const transactionCount = prefetched.transactionCount ?? selection.entitySelector.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount ?? selection.entitySelector.transactionCount ?? prefetched.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const currentValidatorCount = prefetched.currentValidatorCount ?? selection.entitySelector.currentValidatorCount}
					{#if currentValidatorCount !== undefined && currentValidatorCount !== null}
						<div>
							<dt>Current validator count</dt>
							<dd>
								{String((currentValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const currentValidatorCount = entity.currentValidatorCount ?? selection.entitySelector.currentValidatorCount ?? prefetched.currentValidatorCount}
					{#if currentValidatorCount !== undefined && currentValidatorCount !== null}
						<div>
							<dt>Current validator count</dt>
							<dd>
								{String((currentValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const delinquentValidatorCount = prefetched.delinquentValidatorCount ?? selection.entitySelector.delinquentValidatorCount}
					{#if delinquentValidatorCount !== undefined && delinquentValidatorCount !== null}
						<div>
							<dt>Delinquent validator count</dt>
							<dd>
								{String((delinquentValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const delinquentValidatorCount = entity.delinquentValidatorCount ?? selection.entitySelector.delinquentValidatorCount ?? prefetched.delinquentValidatorCount}
					{#if delinquentValidatorCount !== undefined && delinquentValidatorCount !== null}
						<div>
							<dt>Delinquent validator count</dt>
							<dd>
								{String((delinquentValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const totalActivatedStakeLamports = prefetched.totalActivatedStakeLamports ?? selection.entitySelector.totalActivatedStakeLamports}
					{#if totalActivatedStakeLamports !== undefined && totalActivatedStakeLamports !== null}
						<div>
							<dt>Total activated stake</dt>
							<dd>
								{String((totalActivatedStakeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const totalActivatedStakeLamports = entity.totalActivatedStakeLamports ?? selection.entitySelector.totalActivatedStakeLamports ?? prefetched.totalActivatedStakeLamports}
					{#if totalActivatedStakeLamports !== undefined && totalActivatedStakeLamports !== null}
						<div>
							<dt>Total activated stake</dt>
							<dd>
								{String((totalActivatedStakeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const solanaCoreVersion = prefetched.solanaCoreVersion ?? selection.entitySelector.solanaCoreVersion}
					{#if solanaCoreVersion !== undefined && solanaCoreVersion !== null}
						<div>
							<dt>Solana core version</dt>
							<dd>
								{String((solanaCoreVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const solanaCoreVersion = entity.solanaCoreVersion ?? selection.entitySelector.solanaCoreVersion ?? prefetched.solanaCoreVersion}
					{#if solanaCoreVersion !== undefined && solanaCoreVersion !== null}
						<div>
							<dt>Solana core version</dt>
							<dd>
								{String((solanaCoreVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaNetworkTimestamp}>
				{#snippet Pending()}
					{@const featureSet = prefetched.featureSet ?? selection.entitySelector.featureSet}
					{#if featureSet !== undefined && featureSet !== null}
						<div>
							<dt>Feature set</dt>
							<dd>
								{String((featureSet) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const featureSet = entity.featureSet ?? selection.entitySelector.featureSet ?? prefetched.featureSet}
					{#if featureSet !== undefined && featureSet !== null}
						<div>
							<dt>Feature set</dt>
							<dd>
								{String((featureSet) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<SolanaNetworkView
						selection={select(EntityType.SolanaNetwork, selection.entitySelector.$network)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
