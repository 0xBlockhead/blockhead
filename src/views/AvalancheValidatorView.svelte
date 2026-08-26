<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AvalancheValidator>, 'prefetched'> = $props()

	const avalancheValidator = $derived(selection({
		fields: {
			stakeAmountNavax: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalancheDelegatorsView from '$/views/AvalancheDelegatorsView.svelte'
	import AvalancheValidator_TimestampsView from '$/views/AvalancheValidator_TimestampsView.svelte'
	import AvalancheSubnetView from '$/views/AvalancheSubnetView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheValidator}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.nodeId || 'avalanche validator')}
	href={
		href === undefined ?
			resolve(
				'/(avalanche)/avalanche/validator/[nodeId=stringSegment]/[subnetId=stringSegment]/[startTimeMs=nonNegativeInteger]',
				{
					nodeId: selection.entitySelector.nodeId,
					subnetId: selection.entitySelector.subnetId,
					startTimeMs: String(selection.entitySelector.startTimeMs),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={avalancheValidator}>
			{#snippet children(entity)}
				{@const stakeAmountNavax = entity.stakeAmountNavax}
				{#if stakeAmountNavax != null}
					<NumberValue
						value={stakeAmountNavax}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.startTimeMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					{selection.entitySelector.nodeId}
				</dd>
			</div>

			<div>
				<dt>subnet ID</dt>
				<dd>
					{selection.entitySelector.subnetId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$subnet}
			>
				{#snippet children(avalancheSubnet)}
					{#if avalancheSubnet != null}
						{@const avalancheSubnetInitial = untrack(() => avalancheSubnet)}
						<div>
							<dt>subnet</dt>
							<dd>
								<AvalancheSubnetView
									selection={select(EntityType.AvalancheSubnet, (avalancheSubnet ?? avalancheSubnetInitial)[EntityMetaKey.Selector])}
									prefetched={avalancheSubnet ?? avalancheSubnetInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>start time ms</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.startTimeMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endTimeMs = entity.endTimeMs}
					{#if endTimeMs != null}
						<div>
							<dt>end time ms</dt>
							<dd>
								<Timestamp timestamp={endTimeMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={avalancheValidator}
			>
				{#snippet children(entity)}
					{@const stakeAmountNavax = entity.stakeAmountNavax}
					{#if stakeAmountNavax != null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue
									value={stakeAmountNavax}
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
							potentialRewardNavax: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const potentialRewardNavax = entity.potentialRewardNavax}
					{#if potentialRewardNavax != null}
						<div>
							<dt>potential reward navax</dt>
							<dd>
								<NumberValue
									value={potentialRewardNavax}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							txId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const txId = entity.txId}
					{#if txId != null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								<TruncatedValue value={txId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegationFeePercent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegationFeePercent = entity.delegationFeePercent}
					{#if delegationFeePercent != null}
						<div>
							<dt>delegation fee percent</dt>
							<dd>
								<NumberValue
									value={delegationFeePercent}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const delegatorsResource = selection.$$delegators}
		<ResourceBoundary
			resource={delegatorsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheDelegatorsView
						selection={delegatorsResource}
						countResource={delegatorsResource.count}
						title='delegators'
						id='delegators'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheValidator_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
