<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.StarknetClass> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Juno_JsonRpc,
			Source.Pathfinder_JsonRpc,
			Source.Starknet_JsonRpc,
			Source.Starkscan_Rest,
			Source.Voyager_Rest,
		],
	}))
	const starknetClass = $derived(viewSelection({
		fields: {
			contractClassVersion: true,
			declaredAtBlockNumber: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.classHash ?? '') || 'starknet class')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetContractsView from '$/views/StarknetContractsView.svelte'
	import StarknetNetworkView from '$/views/StarknetNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetClass}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.classHash ?? '') || 'starknet class'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetClass}>
			{#snippet children(entity)}
				{(entity.contractClassVersion ?? '') || pendingEntity.classHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={starknetClass}>
			{#snippet children(entity)}
				{@const declaredAtBlockNumber0 = entity.declaredAtBlockNumber}
				{#if declaredAtBlockNumber0 != null}
					<span data-text="muted">
						<NumberValue
							value={declaredAtBlockNumber0}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StarknetNetworkView
						selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>class hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.classHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={starknetClass}
			>
				{#snippet children(entity)}
					{@const contractClassVersion = entity.contractClassVersion}
					{#if contractClassVersion != null}
						<div>
							<dt>contract class version</dt>
							<dd>
								{contractClassVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sierraProgramHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sierraProgramHash = entity.sierraProgramHash}
					{#if sierraProgramHash != null}
						<div>
							<dt>sierra program hash</dt>
							<dd>
								<TruncatedValue value={sierraProgramHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							casmClassHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const casmClassHash = entity.casmClassHash}
					{#if casmClassHash != null}
						<div>
							<dt>casm class hash</dt>
							<dd>
								<TruncatedValue value={casmClassHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							abiHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const abiHash = entity.abiHash}
					{#if abiHash != null}
						<div>
							<dt>ABI hash</dt>
							<dd>
								<TruncatedValue value={String(abiHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={starknetClass}
			>
				{#snippet children(entity)}
					{@const declaredAtBlockNumber = entity.declaredAtBlockNumber}
					{#if declaredAtBlockNumber != null}
						<div>
							<dt>declared at block number</dt>
							<dd>
								<NumberValue
									value={declaredAtBlockNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							declaredByTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const declaredByTransactionHash = entity.declaredByTransactionHash}
					{#if declaredByTransactionHash != null}
						<div>
							<dt>declared by transaction hash</dt>
							<dd>
								<TruncatedValue value={declaredByTransactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const starknetClassStarknetContractsViewContractsResource = selection.$$contracts}
		<ResourceBoundary
			resource={starknetClassStarknetContractsViewContractsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<StarknetContractsView
						selection={starknetClassStarknetContractsViewContractsResource}
						countResource={starknetClassStarknetContractsViewContractsResource.count}
						title='contracts'
						id='contracts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
