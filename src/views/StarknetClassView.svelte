<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetClass>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StarknetClass>>
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
	const starknetClass = $derived(selection({
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder_JsonRpc,
			Source.Starknet_JsonRpc,
			Source.Starkscan_Rest,
			Source.Voyager_Rest,
		],
		fields: {
			contractClassVersion: true,
			declaredAtBlockNumber: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.classHash ?? prefetched.classHash) ?? '')].filter(Boolean).join(' ') || 'starknet class')
	const viewDomId = $derived('starknet-class-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={starknetClass}>
			{#snippet Pending()}
				{[String((selection.entitySelector.classHash ?? prefetched.classHash) ?? '')].filter(Boolean).join(' ') || title || 'starknet class'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.classHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetClass}>
			{#snippet Pending()}
				{[String((prefetched.contractClassVersion) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.classHash ?? prefetched.classHash) ?? '')].filter(Boolean).join(' ') || title || 'starknet class'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.contractClassVersion) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.classHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={starknetClass}>
			{#snippet Pending()}
				{@const declaredAtBlockNumber0 = prefetched.declaredAtBlockNumber}
				{#if declaredAtBlockNumber0 !== undefined && declaredAtBlockNumber0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(declaredAtBlockNumber0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const declaredAtBlockNumber0 = resolvedEntity.declaredAtBlockNumber}
				{#if declaredAtBlockNumber0 !== undefined && declaredAtBlockNumber0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(declaredAtBlockNumber0)} />
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
						selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network, {})}
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
								fields: {
									classHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const classHash = selection.entitySelector.classHash ?? prefetched.classHash}
							{#if classHash !== undefined && classHash !== null}
								<TruncatedValue value={String((classHash) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							contractClassVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contractClassVersion = prefetched.contractClassVersion}
					{#if contractClassVersion !== undefined && contractClassVersion !== null}
						<div>
							<dt>contract class version</dt>
							<dd>
								{String((contractClassVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							sierraProgramHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sierraProgramHash = prefetched.sierraProgramHash}
					{#if sierraProgramHash !== undefined && sierraProgramHash !== null}
						<div>
							<dt>sierra program hash</dt>
							<dd>
								<TruncatedValue value={String((sierraProgramHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							casmClassHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const casmClassHash = prefetched.casmClassHash}
					{#if casmClassHash !== undefined && casmClassHash !== null}
						<div>
							<dt>casm class hash</dt>
							<dd>
								<TruncatedValue value={String((casmClassHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							abiHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const abiHash = prefetched.abiHash}
					{#if abiHash !== undefined && abiHash !== null}
						<div>
							<dt>ABI hash</dt>
							<dd>
								<TruncatedValue value={String((abiHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							declaredAtBlockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const declaredAtBlockNumber = prefetched.declaredAtBlockNumber}
					{#if declaredAtBlockNumber !== undefined && declaredAtBlockNumber !== null}
						<div>
							<dt>declared at block number</dt>
							<dd>
								<NumberValue value={Number(declaredAtBlockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const declaredAtBlockNumber = resolvedEntity.declaredAtBlockNumber}
					{#if declaredAtBlockNumber !== undefined && declaredAtBlockNumber !== null}
						<div>
							<dt>declared at block number</dt>
							<dd>
								<NumberValue value={Number(declaredAtBlockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							declaredByTransactionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const declaredByTransactionHash = prefetched.declaredByTransactionHash}
					{#if declaredByTransactionHash !== undefined && declaredByTransactionHash !== null}
						<div>
							<dt>declared by transaction hash</dt>
							<dd>
								<TruncatedValue value={String((declaredByTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<StarknetContractsView
				selection={selection[EntityProxyField]<EntityType.StarknetContract>('$$contracts')}
				title='contracts'
				emptyText='No Starknet contracts.'
				id='StarknetContractsView-$$contracts'
			/>
		{/if}
	{/snippet}
</EntityView>
