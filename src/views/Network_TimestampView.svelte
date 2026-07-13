<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.Network_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Network_Timestamp>>
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
	const networkTimestamp = $derived(selection({
		fields: {
			latestHeight: true,
			health: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Network timestamp')
	const viewDomId = $derived('network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Network_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			network: String(pendingEntity.$network.slug ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={networkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={networkTimestamp}>
			{#snippet Pending()}
				{@const latestHeight0 = pendingEntity.latestHeight}
				{#if latestHeight0 !== undefined && latestHeight0 !== null}
					<NumberValue value={Number(latestHeight0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const latestHeight0 = resolvedEntity.latestHeight}
				{#if latestHeight0 !== undefined && latestHeight0 !== null}
					<NumberValue value={Number(latestHeight0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={networkTimestamp}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
				{@const health1 = pendingEntity.health}
				{#if health1 !== undefined && health1 !== null}
					<span data-text="muted">
						{String((health1) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
				{@const health1 = resolvedEntity.health}
				{#if health1 !== undefined && health1 !== null}
					<span data-text="muted">
						{String((health1) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A point-in-time observation of network status or metrics.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
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
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
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
				resource={
					selection({
						fields: {
							latestHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestHeight = pendingEntity.latestHeight}
					{#if latestHeight !== undefined && latestHeight !== null}
						<div>
							<dt>Latest height</dt>
							<dd>
								<NumberValue value={Number(latestHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestHeight = resolvedEntity.latestHeight}
					{#if latestHeight !== undefined && latestHeight !== null}
						<div>
							<dt>Latest height</dt>
							<dd>
								<NumberValue value={Number(latestHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							txCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const txCount = pendingEntity.txCount}
					{#if txCount !== undefined && txCount !== null}
						<div>
							<dt>Transactions</dt>
							<dd>
								<NumberValue value={Number(txCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txCount = resolvedEntity.txCount}
					{#if txCount !== undefined && txCount !== null}
						<div>
							<dt>Transactions</dt>
							<dd>
								<NumberValue value={Number(txCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockHeight = pendingEntity.latestBlockHeight}
					{#if latestBlockHeight !== undefined && latestBlockHeight !== null}
						<div>
							<dt>Latest block height</dt>
							<dd>
								<NumberValue value={Number(latestBlockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockHeight = resolvedEntity.latestBlockHeight}
					{#if latestBlockHeight !== undefined && latestBlockHeight !== null}
						<div>
							<dt>Latest block height</dt>
							<dd>
								<NumberValue value={Number(latestBlockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockHash = pendingEntity.latestBlockHash}
					{#if latestBlockHash !== undefined && latestBlockHash !== null}
						<div>
							<dt>Latest block hash</dt>
							<dd>
								<TruncatedValue value={String((latestBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockHash = resolvedEntity.latestBlockHash}
					{#if latestBlockHash !== undefined && latestBlockHash !== null}
						<div>
							<dt>Latest block hash</dt>
							<dd>
								<TruncatedValue value={String((latestBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockTimeMs = pendingEntity.latestBlockTimeMs}
					{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								<Timestamp timestamp={Number(latestBlockTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockTimeMs = resolvedEntity.latestBlockTimeMs}
					{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								<Timestamp timestamp={Number(latestBlockTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockTransactionCount = pendingEntity.latestBlockTransactionCount}
					{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								<NumberValue value={Number(latestBlockTransactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockTransactionCount = resolvedEntity.latestBlockTransactionCount}
					{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								<NumberValue value={Number(latestBlockTransactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							health: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const health = pendingEntity.health}
					{#if health !== undefined && health !== null}
						<div>
							<dt>Health</dt>
							<dd>
								{String((health) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const health = resolvedEntity.health}
					{#if health !== undefined && health !== null}
						<div>
							<dt>Health</dt>
							<dd>
								{String((health) ?? '')}
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
							chainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainId = pendingEntity.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								{String((chainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainId = resolvedEntity.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								{String((chainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeNetwork: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeNetwork = pendingEntity.nodeNetwork}
					{#if nodeNetwork !== undefined && nodeNetwork !== null}
						<div>
							<dt>Node network</dt>
							<dd>
								{String((nodeNetwork) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeNetwork = resolvedEntity.nodeNetwork}
					{#if nodeNetwork !== undefined && nodeNetwork !== null}
						<div>
							<dt>Node network</dt>
							<dd>
								{String((nodeNetwork) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							applicationName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const applicationName = pendingEntity.applicationName}
					{#if applicationName !== undefined && applicationName !== null}
						<div>
							<dt>Application name</dt>
							<dd>
								{String((applicationName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const applicationName = resolvedEntity.applicationName}
					{#if applicationName !== undefined && applicationName !== null}
						<div>
							<dt>Application name</dt>
							<dd>
								{String((applicationName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							applicationVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const applicationVersion = pendingEntity.applicationVersion}
					{#if applicationVersion !== undefined && applicationVersion !== null}
						<div>
							<dt>Application version</dt>
							<dd>
								{String((applicationVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const applicationVersion = resolvedEntity.applicationVersion}
					{#if applicationVersion !== undefined && applicationVersion !== null}
						<div>
							<dt>Application version</dt>
							<dd>
								{String((applicationVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cosmosSdkVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cosmosSdkVersion = pendingEntity.cosmosSdkVersion}
					{#if cosmosSdkVersion !== undefined && cosmosSdkVersion !== null}
						<div>
							<dt>Cosmos SDK version</dt>
							<dd>
								{String((cosmosSdkVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cosmosSdkVersion = resolvedEntity.cosmosSdkVersion}
					{#if cosmosSdkVersion !== undefined && cosmosSdkVersion !== null}
						<div>
							<dt>Cosmos SDK version</dt>
							<dd>
								{String((cosmosSdkVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isSyncing: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isSyncing = pendingEntity.isSyncing}
					{#if isSyncing !== undefined && isSyncing !== null}
						<div>
							<dt>Syncing</dt>
							<dd>
								{isSyncing ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isSyncing = resolvedEntity.isSyncing}
					{#if isSyncing !== undefined && isSyncing !== null}
						<div>
							<dt>Syncing</dt>
							<dd>
								{isSyncing ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validatorCount = pendingEntity.validatorCount}
					{#if validatorCount !== undefined && validatorCount !== null}
						<div>
							<dt>Validator count</dt>
							<dd>
								{String((validatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validatorCount = resolvedEntity.validatorCount}
					{#if validatorCount !== undefined && validatorCount !== null}
						<div>
							<dt>Validator count</dt>
							<dd>
								{String((validatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bondedValidatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bondedValidatorCount = pendingEntity.bondedValidatorCount}
					{#if bondedValidatorCount !== undefined && bondedValidatorCount !== null}
						<div>
							<dt>Bonded validators</dt>
							<dd>
								{String((bondedValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bondedValidatorCount = resolvedEntity.bondedValidatorCount}
					{#if bondedValidatorCount !== undefined && bondedValidatorCount !== null}
						<div>
							<dt>Bonded validators</dt>
							<dd>
								{String((bondedValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bondedTokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bondedTokens = pendingEntity.bondedTokens}
					{#if bondedTokens !== undefined && bondedTokens !== null}
						<div>
							<dt>Bonded tokens</dt>
							<dd>
								{String((bondedTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bondedTokens = resolvedEntity.bondedTokens}
					{#if bondedTokens !== undefined && bondedTokens !== null}
						<div>
							<dt>Bonded tokens</dt>
							<dd>
								{String((bondedTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							notBondedTokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const notBondedTokens = pendingEntity.notBondedTokens}
					{#if notBondedTokens !== undefined && notBondedTokens !== null}
						<div>
							<dt>Not bonded tokens</dt>
							<dd>
								{String((notBondedTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const notBondedTokens = resolvedEntity.notBondedTokens}
					{#if notBondedTokens !== undefined && notBondedTokens !== null}
						<div>
							<dt>Not bonded tokens</dt>
							<dd>
								{String((notBondedTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							governanceProposalCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const governanceProposalCount = pendingEntity.governanceProposalCount}
					{#if governanceProposalCount !== undefined && governanceProposalCount !== null}
						<div>
							<dt>Governance proposals</dt>
							<dd>
								{String((governanceProposalCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const governanceProposalCount = resolvedEntity.governanceProposalCount}
					{#if governanceProposalCount !== undefined && governanceProposalCount !== null}
						<div>
							<dt>Governance proposals</dt>
							<dd>
								{String((governanceProposalCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
