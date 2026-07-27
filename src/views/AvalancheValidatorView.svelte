<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AvalancheValidator> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const avalancheValidator = $derived(selection({
		fields: {
			stakeAmountNavax: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.nodeId ?? '') || 'avalanche validator')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalancheValidator_TimestampsView from '$/views/AvalancheValidator_TimestampsView.svelte'
	import AvalancheSubnetView from '$/views/AvalancheSubnetView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheValidator}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.nodeId ?? '') || 'avalanche validator'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalancheValidator}>
			{#snippet children(entity)}
				{@const stakeAmountNavax0 = entity.stakeAmountNavax}
				{#if stakeAmountNavax0 != null}
					<NumberValue
						value={stakeAmountNavax0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={Number(pendingEntity.startTimeMs)} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					{pendingEntity.nodeId}
				</dd>
			</div>

			<div>
				<dt>subnet ID</dt>
				<dd>
					{pendingEntity.subnetId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$subnet}
			>
				{#snippet children(avalancheSubnet)}
					{#if avalancheSubnet != null}
						<div>
							<dt>subnet</dt>
							<dd>
								<AvalancheSubnetView
									selection={select(EntityType.AvalancheSubnet, avalancheSubnet[EntityMetaKey.Selector])}
									prefetched={avalancheSubnet}
									layout={EntityLayout.Value}
									open={false}
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
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
									open={false}
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
					<Timestamp timestamp={Number(pendingEntity.startTimeMs)} />
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
								<Timestamp timestamp={Number(endTimeMs)} />
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

	{#snippet Details({ open: detailsOpen })}
		{@const avalancheValidatorAvalancheValidatorTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={avalancheValidatorAvalancheValidatorTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheValidator_TimestampsView
						selection={avalancheValidatorAvalancheValidatorTimestampsViewTimestampsResource}
						countResource={avalancheValidatorAvalancheValidatorTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
