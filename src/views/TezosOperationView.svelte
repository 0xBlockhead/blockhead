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
			selection: EntityProxyResource<typeof schema, EntityType.TezosOperation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosOperation>>
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
	const tezosOperation = $derived(selection({}))
	const titleFallback = $derived('tezos operation')
	const viewDomId = $derived('tezos-operation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosOperationGroupView from '$/views/TezosOperationGroupView.svelte'
	import TezosBlockView from '$/views/TezosBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosOperation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosOperation}>
			{#snippet Pending()}
				{title || 'tezos operation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>operation group</dt>
				<dd>
					<TezosOperationGroupView
						selection={select(EntityType.TezosOperationGroup, selection.entitySelector.$operationGroup)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>content index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									contentIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const contentIndex = selection.entitySelector.contentIndex ?? prefetched.contentIndex}
							{#if contentIndex !== undefined && contentIndex !== null}
								{String((contentIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const contentIndex = resolvedEntity.contentIndex}
							{#if contentIndex !== undefined && contentIndex !== null}
								{String((contentIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>operation kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operationKind = prefetched.operationKind}
							{#if operationKind !== undefined && operationKind !== null}
								{String((operationKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operationKind = resolvedEntity.operationKind}
							{#if operationKind !== undefined && operationKind !== null}
								{String((operationKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceAddress = prefetched.sourceAddress}
					{#if sourceAddress !== undefined && sourceAddress !== null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={String((sourceAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceAddress = resolvedEntity.sourceAddress}
					{#if sourceAddress !== undefined && sourceAddress !== null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={String((sourceAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const destinationAddress = prefetched.destinationAddress}
					{#if destinationAddress !== undefined && destinationAddress !== null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={String((destinationAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationAddress = resolvedEntity.destinationAddress}
					{#if destinationAddress !== undefined && destinationAddress !== null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={String((destinationAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegateAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delegateAddress = prefetched.delegateAddress}
					{#if delegateAddress !== undefined && delegateAddress !== null}
						<div>
							<dt>delegate address</dt>
							<dd>
								<TruncatedValue value={String((delegateAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegateAddress = resolvedEntity.delegateAddress}
					{#if delegateAddress !== undefined && delegateAddress !== null}
						<div>
							<dt>delegate address</dt>
							<dd>
								<TruncatedValue value={String((delegateAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contractAddress = prefetched.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractAddress = resolvedEntity.contractAddress}
					{#if contractAddress !== undefined && contractAddress !== null}
						<div>
							<dt>contract address</dt>
							<dd>
								<TruncatedValue value={String((contractAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							counter: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const counter = prefetched.counter}
					{#if counter !== undefined && counter !== null}
						<div>
							<dt>counter</dt>
							<dd>
								{String((counter) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const counter = resolvedEntity.counter}
					{#if counter !== undefined && counter !== null}
						<div>
							<dt>counter</dt>
							<dd>
								{String((counter) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeMutez: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeMutez = prefetched.feeMutez}
					{#if feeMutez !== undefined && feeMutez !== null}
						<div>
							<dt>fee mutez</dt>
							<dd>
								{String((feeMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeMutez = resolvedEntity.feeMutez}
					{#if feeMutez !== undefined && feeMutez !== null}
						<div>
							<dt>fee mutez</dt>
							<dd>
								{String((feeMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasLimit = prefetched.gasLimit}
					{#if gasLimit !== undefined && gasLimit !== null}
						<div>
							<dt>gas limit</dt>
							<dd>
								{String((gasLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasLimit = resolvedEntity.gasLimit}
					{#if gasLimit !== undefined && gasLimit !== null}
						<div>
							<dt>gas limit</dt>
							<dd>
								{String((gasLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageLimit = prefetched.storageLimit}
					{#if storageLimit !== undefined && storageLimit !== null}
						<div>
							<dt>storage limit</dt>
							<dd>
								{String((storageLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageLimit = resolvedEntity.storageLimit}
					{#if storageLimit !== undefined && storageLimit !== null}
						<div>
							<dt>storage limit</dt>
							<dd>
								{String((storageLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountMutez: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountMutez = prefetched.amountMutez}
					{#if amountMutez !== undefined && amountMutez !== null}
						<div>
							<dt>amount mutez</dt>
							<dd>
								{String((amountMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountMutez = resolvedEntity.amountMutez}
					{#if amountMutez !== undefined && amountMutez !== null}
						<div>
							<dt>amount mutez</dt>
							<dd>
								{String((amountMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consumedGas: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consumedGas = prefetched.consumedGas}
					{#if consumedGas !== undefined && consumedGas !== null}
						<div>
							<dt>consumed gas</dt>
							<dd>
								{String((consumedGas) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consumedGas = resolvedEntity.consumedGas}
					{#if consumedGas !== undefined && consumedGas !== null}
						<div>
							<dt>consumed gas</dt>
							<dd>
								{String((consumedGas) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageSize: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageSize = prefetched.storageSize}
					{#if storageSize !== undefined && storageSize !== null}
						<div>
							<dt>storage size</dt>
							<dd>
								{String((storageSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageSize = resolvedEntity.storageSize}
					{#if storageSize !== undefined && storageSize !== null}
						<div>
							<dt>storage size</dt>
							<dd>
								{String((storageSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							paidStorageSizeDiff: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paidStorageSizeDiff = prefetched.paidStorageSizeDiff}
					{#if paidStorageSizeDiff !== undefined && paidStorageSizeDiff !== null}
						<div>
							<dt>paid storage size diff</dt>
							<dd>
								{String((paidStorageSizeDiff) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paidStorageSizeDiff = resolvedEntity.paidStorageSizeDiff}
					{#if paidStorageSizeDiff !== undefined && paidStorageSizeDiff !== null}
						<div>
							<dt>paid storage size diff</dt>
							<dd>
								{String((paidStorageSizeDiff) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>originated contract addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									originatedContractAddresses: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const originatedContractAddresses = prefetched.originatedContractAddresses}
							{#if originatedContractAddresses !== undefined && originatedContractAddresses !== null}
								<TruncatedValue value={(originatedContractAddresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const originatedContractAddresses = resolvedEntity.originatedContractAddresses}
							{#if originatedContractAddresses !== undefined && originatedContractAddresses !== null}
								<TruncatedValue value={(originatedContractAddresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.TezosBlock, false>('$block')}
			>
				{#snippet children(tezosBlock)}
					{#if tezosBlock != null && tezosBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>block</dt>
							<dd>
								<TezosBlockView
									selection={select(EntityType.TezosBlock, tezosBlock[EntityMetaKey.Selector])}
									prefetched={tezosBlock}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
