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
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EasSchema>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EasSchema>>
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
	const easSchema = $derived(selection({
		sources: [
			Source.Blockscout_Rest,
			Source.EasContracts_Evm,
			Source.EasScan_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			schema: true,
			resolver: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.schemaUid ?? prefetched.schemaUid) ?? '')].filter(Boolean).join(' ') || 'EAS schema')
	const viewDomId = $derived('eas-schema-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EasAttestationsView from '$/views/EasAttestationsView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EasSchema}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={easSchema}>
			{#snippet Pending()}
				{[String((selection.entitySelector.schemaUid ?? prefetched.schemaUid) ?? '')].filter(Boolean).join(' ') || title || 'EAS schema'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.schemaUid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={easSchema}>
			{#snippet Pending()}
				{[String((prefetched.schema) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.schemaUid ?? prefetched.schemaUid) ?? '')].filter(Boolean).join(' ') || title || 'EAS schema'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.schema) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.schemaUid) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={easSchema}>
			{#snippet Pending()}
				{@const resolver0 = prefetched.resolver}
				{#if resolver0 !== undefined && resolver0 !== null}
					<span data-text="muted">
						{String((resolver0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const resolver0 = resolvedEntity.resolver}
				{#if resolver0 !== undefined && resolver0 !== null}
					<span data-text="muted">
						{String((resolver0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Schema UID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									schemaUid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const schemaUid = selection.entitySelector.schemaUid ?? prefetched.schemaUid}
							{#if schemaUid !== undefined && schemaUid !== null}
								{String((schemaUid) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const schemaUid = resolvedEntity.schemaUid}
							{#if schemaUid !== undefined && schemaUid !== null}
								{String((schemaUid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Schema</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									schema: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const schema = prefetched.schema}
							{#if schema !== undefined && schema !== null}
								{String((schema) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const schema = resolvedEntity.schema}
							{#if schema !== undefined && schema !== null}
								{String((schema) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resolver: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resolver = prefetched.resolver}
					{#if resolver !== undefined && resolver !== null}
						<div>
							<dt>Resolver</dt>
							<dd>
								{String((resolver) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resolver = resolvedEntity.resolver}
					{#if resolver !== undefined && resolver !== null}
						<div>
							<dt>Resolver</dt>
							<dd>
								{String((resolver) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							revocable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revocable = prefetched.revocable}
					{#if revocable !== undefined && revocable !== null}
						<div>
							<dt>Revocable</dt>
							<dd>
								{revocable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revocable = resolvedEntity.revocable}
					{#if revocable !== undefined && revocable !== null}
						<div>
							<dt>Revocable</dt>
							<dd>
								{revocable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							registerer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registerer = prefetched.registerer}
					{#if registerer !== undefined && registerer !== null}
						<div>
							<dt>Registerer</dt>
							<dd>
								{String((registerer) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registerer = resolvedEntity.registerer}
					{#if registerer !== undefined && registerer !== null}
						<div>
							<dt>Registerer</dt>
							<dd>
								{String((registerer) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							registeredAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registeredAt = prefetched.registeredAt}
					{#if registeredAt !== undefined && registeredAt !== null}
						<div>
							<dt>Registered at</dt>
							<dd>
								<Timestamp timestamp={Number(registeredAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registeredAt = resolvedEntity.registeredAt}
					{#if registeredAt !== undefined && registeredAt !== null}
						<div>
							<dt>Registered at</dt>
							<dd>
								<Timestamp timestamp={Number(registeredAt)} />
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
							registeredTransactionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registeredTransactionHash = prefetched.registeredTransactionHash}
					{#if registeredTransactionHash !== undefined && registeredTransactionHash !== null}
						<div>
							<dt>Registered transaction hash</dt>
							<dd>
								<TruncatedValue value={String((registeredTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registeredTransactionHash = resolvedEntity.registeredTransactionHash}
					{#if registeredTransactionHash !== undefined && registeredTransactionHash !== null}
						<div>
							<dt>Registered transaction hash</dt>
							<dd>
								<TruncatedValue value={String((registeredTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							registeredLogIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registeredLogIndex = prefetched.registeredLogIndex}
					{#if registeredLogIndex !== undefined && registeredLogIndex !== null}
						<div>
							<dt>Registered log index</dt>
							<dd>
								<NumberValue value={Number(registeredLogIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registeredLogIndex = resolvedEntity.registeredLogIndex}
					{#if registeredLogIndex !== undefined && registeredLogIndex !== null}
						<div>
							<dt>Registered log index</dt>
							<dd>
								<NumberValue value={Number(registeredLogIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$resolverContract')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Resolver contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2 !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2 !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2.reference !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(evmContract[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(evmContract[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetworkAccount, false>('$registererAccount')}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null && evmNetworkAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Registerer account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EasAttestationsView
				selection={selection[EntityProxyField]<EntityType.EasAttestation>('$$attestations')}
				title='Attestations'
				emptyText='No EAS attestations.'
				id='EasAttestationsView-$$attestations'
			/>
		{/if}
	{/snippet}
</EntityView>
