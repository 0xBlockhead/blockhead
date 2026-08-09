<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StarknetClass>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
			Source.Starkscan,
			Source.Voyager,
		],
	}))
	const starknetClass = $derived(viewSelection({
		fields: {
			contractClassVersion: true,
			declaredAtBlockNumber: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.classHash || 'starknet class')


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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/class/[classHash=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					classHash: selection.entitySelector.classHash,
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
		<ResourceBoundary resource={starknetClass}>
			{#snippet children(entity)}
				{(entity.contractClassVersion ?? '') || selection.entitySelector.classHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={starknetClass}>
			{#snippet children(entity)}
				{@const declaredAtBlockNumber = entity.declaredAtBlockNumber}
				{#if declaredAtBlockNumber != null}
					<span data-text="muted">
						<NumberValue
							value={declaredAtBlockNumber}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StarknetNetworkView
						selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>class hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.classHash} />
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
								<TruncatedValue value={abiHash} />
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

	{#snippet Details()}
		{@const contractsResource = selection.$$contracts}
		<ResourceBoundary
			resource={contractsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<StarknetContractsView
						selection={contractsResource}
						countResource={contractsResource.count}
						title='contracts'
						id='contracts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
