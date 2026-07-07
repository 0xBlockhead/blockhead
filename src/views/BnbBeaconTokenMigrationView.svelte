<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconTokenMigration>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BnbBeaconTokenMigration>>
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
	const bnbBeaconTokenMigration = $derived(selection({
		fields: {
			migrationKind: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.migrationKind) ?? '')].filter(Boolean).join(' ') || 'bnb beacon token migration')
	const viewDomId = $derived('bnb-beacon-token-migration-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbBeaconTokenMigration_TimestampsView from '$/views/BnbBeaconTokenMigration_TimestampsView.svelte'
	import BnbBeaconTokenView from '$/views/BnbBeaconTokenView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconTokenMigration}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bnbBeaconTokenMigration}>
			{#snippet Pending()}
				{[String((prefetched.migrationKind) ?? '')].filter(Boolean).join(' ') || title || 'bnb beacon token migration'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.migrationKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconTokenMigration}>
			{#snippet Pending()}
				<BnbBeaconTokenView
					selection={select(EntityType.BnbBeaconToken, selection.entitySelector.$token)}
					layout={EntityLayout.Value}
					open={false}
				/>

				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$targetNetwork)}
					href={
						(selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
							caip2: `${String(selection.entitySelector.$targetNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$targetNetwork.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
							caip2: `${String(selection.entitySelector.$targetNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$targetNetwork.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$targetNetwork.caip2.namespace) + ':' + String(selection.entitySelector.$targetNetwork.caip2.reference))].slug ?? ''),
						}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
							networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
						}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
							networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
						}) : selection.entitySelector.$targetNetwork.ledgerModels !== undefined && selection.entitySelector.$targetNetwork.ledgerModels.values.includes('Utxo') && selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
							networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
						}) : selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$targetNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$targetNetwork.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<BnbBeaconTokenView
					selection={select(EntityType.BnbBeaconToken, selection.entitySelector.$token)}
					layout={EntityLayout.Value}
					open={false}
				/>

				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$targetNetwork)}
					href={
						(selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
							caip2: `${String(selection.entitySelector.$targetNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$targetNetwork.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
							caip2: `${String(selection.entitySelector.$targetNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$targetNetwork.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$targetNetwork.caip2.namespace) + ':' + String(selection.entitySelector.$targetNetwork.caip2.reference))].slug ?? ''),
						}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
							networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
						}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
							networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
						}) : selection.entitySelector.$targetNetwork.ledgerModels !== undefined && selection.entitySelector.$targetNetwork.ledgerModels.values.includes('Utxo') && selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
							networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
						}) : selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$targetNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$targetNetwork.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>token</dt>
				<dd>
					<BnbBeaconTokenView
						selection={select(EntityType.BnbBeaconToken, selection.entitySelector.$token, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>target network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$targetNetwork, {})}
						href={
							(selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$targetNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$targetNetwork.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$targetNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$targetNetwork.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$targetNetwork.caip2.namespace) + ':' + String(selection.entitySelector.$targetNetwork.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
							}) : selection.entitySelector.$targetNetwork.executionModels !== undefined && selection.entitySelector.$targetNetwork.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
							}) : selection.entitySelector.$targetNetwork.ledgerModels !== undefined && selection.entitySelector.$targetNetwork.ledgerModels.values.includes('Utxo') && selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
							}) : selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.namespace !== undefined && selection.entitySelector.$targetNetwork.caip2 !== undefined && selection.entitySelector.$targetNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$targetNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$targetNetwork.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$targetNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$targetNetwork.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>target address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									targetAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const targetAddress = selection.entitySelector.targetAddress ?? prefetched.targetAddress}
							{#if targetAddress !== undefined && targetAddress !== null}
								<TruncatedValue value={String((targetAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const targetAddress = resolvedEntity.targetAddress}
							{#if targetAddress !== undefined && targetAddress !== null}
								<TruncatedValue value={String((targetAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>migration kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									migrationKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const migrationKind = prefetched.migrationKind}
							{#if migrationKind !== undefined && migrationKind !== null}
								{String((migrationKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const migrationKind = resolvedEntity.migrationKind}
							{#if migrationKind !== undefined && migrationKind !== null}
								{String((migrationKind) ?? '')}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							targetContractAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const targetContractAddress = prefetched.targetContractAddress}
					{#if targetContractAddress !== undefined && targetContractAddress !== null}
						<div>
							<dt>target contract address</dt>
							<dd>
								<TruncatedValue value={String((targetContractAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const targetContractAddress = resolvedEntity.targetContractAddress}
					{#if targetContractAddress !== undefined && targetContractAddress !== null}
						<div>
							<dt>target contract address</dt>
							<dd>
								<TruncatedValue value={String((targetContractAddress) ?? '')} />
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
					{@const amount = prefetched.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue value={Number(amount)} />
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
								<NumberValue value={Number(amount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							eventTxHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const eventTxHash = prefetched.eventTxHash}
					{#if eventTxHash !== undefined && eventTxHash !== null}
						<div>
							<dt>event transaction hash</dt>
							<dd>
								<TruncatedValue value={String((eventTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const eventTxHash = resolvedEntity.eventTxHash}
					{#if eventTxHash !== undefined && eventTxHash !== null}
						<div>
							<dt>event transaction hash</dt>
							<dd>
								<TruncatedValue value={String((eventTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BnbBeaconTokenMigration_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BnbBeaconTokenMigration_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='BnbBeaconTokenMigration_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
