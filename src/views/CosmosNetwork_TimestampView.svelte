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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosNetwork_Timestamp>>
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
	const cosmosNetworkTimestamp = $derived(selection({
		fields: {
			latestBlockHeight: true,
			chainId: true,
			isSyncing: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || 'Cosmos network timestamp')
	const viewDomId = $derived('cosmos-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosNetworkTimestamp}>
			{#snippet Pending()}
				{[String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosNetworkTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.latestBlockHeight) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.latestBlockHeight) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosNetworkTimestamp}>
			{#snippet Pending()}
				{@const chainId0 = prefetched.chainId}
				{#if chainId0 !== undefined && chainId0 !== null}
					<span data-text="muted">
						{String((chainId0) ?? '')}
					</span>
				{/if}
				{@const isSyncing1 = prefetched.isSyncing}
				{#if isSyncing1 !== undefined && isSyncing1 !== null}
					<span data-text="muted">
						{isSyncing1 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const chainId0 = resolvedEntity.chainId}
				{#if chainId0 !== undefined && chainId0 !== null}
					<span data-text="muted">
						{String((chainId0) ?? '')}
					</span>
				{/if}
				{@const isSyncing1 = resolvedEntity.isSyncing}
				{#if isSyncing1 !== undefined && isSyncing1 !== null}
					<span data-text="muted">
						{isSyncing1 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
							chainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainId = prefetched.chainId}
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
							latestBlockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockHeight = prefetched.latestBlockHeight}
					{#if latestBlockHeight !== undefined && latestBlockHeight !== null}
						<div>
							<dt>Latest block height</dt>
							<dd>
								{String((latestBlockHeight) ?? '')}
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
								{String((latestBlockHeight) ?? '')}
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
					{@const latestBlockHash = prefetched.latestBlockHash}
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
					{@const latestBlockTimeMs = prefetched.latestBlockTimeMs}
					{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								{String((latestBlockTimeMs) ?? '')}
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
								{String((latestBlockTimeMs) ?? '')}
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
					{@const latestBlockTransactionCount = prefetched.latestBlockTransactionCount}
					{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								{String((latestBlockTransactionCount) ?? '')}
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
								{String((latestBlockTransactionCount) ?? '')}
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
							nodeNetwork: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeNetwork = prefetched.nodeNetwork}
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
					{@const applicationName = prefetched.applicationName}
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
					{@const applicationVersion = prefetched.applicationVersion}
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
					{@const cosmosSdkVersion = prefetched.cosmosSdkVersion}
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
					{@const isSyncing = prefetched.isSyncing}
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
					{@const validatorCount = prefetched.validatorCount}
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
					{@const bondedValidatorCount = prefetched.bondedValidatorCount}
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
					{@const bondedTokens = prefetched.bondedTokens}
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
					{@const notBondedTokens = prefetched.notBondedTokens}
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
					{@const governanceProposalCount = prefetched.governanceProposalCount}
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
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
