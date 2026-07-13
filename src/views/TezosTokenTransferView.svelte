<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosTokenTransfer>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosTokenTransfer>>
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
	const tezosTokenTransfer = $derived(selection({}))
	const titleFallback = $derived('tezos token transfer')
	const viewDomId = $derived('tezos-token-transfer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
	import TezosTokenView from '$/views/TezosTokenView.svelte'
	import TezosAccountView from '$/views/TezosAccountView.svelte'
	import TezosOperationView from '$/views/TezosOperationView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosTokenTransfer}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosTokenTransfer}>
			{#snippet Pending()}
				{title || 'tezos token transfer'}
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
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transfer ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transferId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transferId = pendingEntity.transferId}
							{#if transferId !== undefined && transferId !== null}
								{String((transferId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transferId = resolvedEntity.transferId}
							{#if transferId !== undefined && transferId !== null}
								{String((transferId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tezosToken)}
					{#if tezosToken != null && tezosToken[EntityMetaKey.Selector] != null}
						<div>
							<dt>token</dt>
							<dd>
								<TezosTokenView
									selection={select(EntityType.TezosToken, tezosToken[EntityMetaKey.Selector])}
									prefetched={tezosToken}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tezosAccount)}
					{#if tezosAccount != null && tezosAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>from</dt>
							<dd>
								<TezosAccountView
									selection={select(EntityType.TezosAccount, tezosAccount[EntityMetaKey.Selector])}
									prefetched={tezosAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tezosAccount)}
					{#if tezosAccount != null && tezosAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>to</dt>
							<dd>
								<TezosAccountView
									selection={select(EntityType.TezosAccount, tezosAccount[EntityMetaKey.Selector])}
									prefetched={tezosAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operation}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tezosOperation)}
					{#if tezosOperation != null && tezosOperation[EntityMetaKey.Selector] != null}
						<div>
							<dt>operation</dt>
							<dd>
								<TezosOperationView
									selection={select(EntityType.TezosOperation, tezosOperation[EntityMetaKey.Selector])}
									prefetched={tezosOperation}
									layout={EntityLayout.Value}
									open={false}
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
							level: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const level = pendingEntity.level}
					{#if level !== undefined && level !== null}
						<div>
							<dt>level</dt>
							<dd>
								{String((level) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const level = resolvedEntity.level}
					{#if level !== undefined && level !== null}
						<div>
							<dt>level</dt>
							<dd>
								{String((level) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
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
					{@const contractAddress = pendingEntity.contractAddress}
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
							tokenId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenId = pendingEntity.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{String((tokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenId = resolvedEntity.tokenId}
					{#if tokenId !== undefined && tokenId !== null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{String((tokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amount = pendingEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								{String((amount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								{String((amount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							standard: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const standard = pendingEntity.standard}
					{#if standard !== undefined && standard !== null}
						<div>
							<dt>standard</dt>
							<dd>
								{String((standard) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const standard = resolvedEntity.standard}
					{#if standard !== undefined && standard !== null}
						<div>
							<dt>standard</dt>
							<dd>
								{String((standard) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionId = pendingEntity.transactionId}
					{#if transactionId !== undefined && transactionId !== null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								{String((transactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionId = resolvedEntity.transactionId}
					{#if transactionId !== undefined && transactionId !== null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								{String((transactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
