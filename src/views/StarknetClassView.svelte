<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.StarknetClass>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.StarknetClass>
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
	const starknetClass = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			contractClassVersion: true,
			declaredAtBlockNumber: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			contractClassVersion: true,
			declaredAtBlockNumber: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.classHash) ?? '')].filter(Boolean).join(' ') || 'starknet class')
	const viewDomId = $derived('starknet-class-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetContractsView from '$/views/StarknetContractsView.svelte'
	import StarknetNetworkView from '$/views/StarknetNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetClass}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'contractClassVersion') && Object.hasOwn(prefetched, 'declaredAtBlockNumber')}
			{[String((pendingEntity.classHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={starknetClass}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.classHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'contractClassVersion') && Object.hasOwn(prefetched, 'declaredAtBlockNumber')}
			{[String((pendingEntity.contractClassVersion) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.classHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={starknetClass}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.contractClassVersion) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.classHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'contractClassVersion') && Object.hasOwn(prefetched, 'declaredAtBlockNumber')}
			{@const declaredAtBlockNumber0 = pendingEntity.declaredAtBlockNumber}
			{#if declaredAtBlockNumber0 !== undefined && declaredAtBlockNumber0 !== null}
				<span data-text="muted">
					<NumberValue
						value={declaredAtBlockNumber0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={starknetClass}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const declaredAtBlockNumber0 = resolvedEntity.declaredAtBlockNumber}
					{#if declaredAtBlockNumber0 !== undefined && declaredAtBlockNumber0 !== null}
						<span data-text="muted">
							<NumberValue
								value={declaredAtBlockNumber0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									classHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const classHash = resolvedEntity.classHash}
							{#if classHash !== undefined && classHash !== null}
								<TruncatedValue value={String((classHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							contractClassVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractClassVersion = resolvedEntity.contractClassVersion}
					{#if contractClassVersion !== undefined && contractClassVersion !== null}
						<div>
							<dt>contract class version</dt>
							<dd>
								{String((contractClassVersion) ?? '')}
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
							sierraProgramHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sierraProgramHash = resolvedEntity.sierraProgramHash}
					{#if sierraProgramHash !== undefined && sierraProgramHash !== null}
						<div>
							<dt>sierra program hash</dt>
							<dd>
								<TruncatedValue value={String((sierraProgramHash) ?? '')} />
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
							casmClassHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const casmClassHash = resolvedEntity.casmClassHash}
					{#if casmClassHash !== undefined && casmClassHash !== null}
						<div>
							<dt>casm class hash</dt>
							<dd>
								<TruncatedValue value={String((casmClassHash) ?? '')} />
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
						sources: selection.sources,
						fields: {
							abiHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const abiHash = resolvedEntity.abiHash}
					{#if abiHash !== undefined && abiHash !== null}
						<div>
							<dt>ABI hash</dt>
							<dd>
								<TruncatedValue value={String((abiHash) ?? '')} />
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
							declaredAtBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const declaredAtBlockNumber = resolvedEntity.declaredAtBlockNumber}
					{#if declaredAtBlockNumber !== undefined && declaredAtBlockNumber !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							declaredByTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const declaredByTransactionHash = resolvedEntity.declaredByTransactionHash}
					{#if declaredByTransactionHash !== undefined && declaredByTransactionHash !== null}
						<div>
							<dt>declared by transaction hash</dt>
							<dd>
								<TruncatedValue value={String((declaredByTransactionHash) ?? '')} />
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
					id='StarknetContractsView-contracts'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
