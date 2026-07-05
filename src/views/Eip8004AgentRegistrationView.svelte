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
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004AgentRegistration>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Eip8004AgentRegistration>>
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
	const eip8004AgentRegistration = $derived(selection({
		sources: [
			Source.Eip8004Scan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.agentId ?? prefetched.agentId) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 agent registration')
	const viewDomId = $derived('eip8004agent-registration-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Eip8004AgentRegistration_TimestampsView from '$/views/Eip8004AgentRegistration_TimestampsView.svelte'
	import Eip8004AgentRegistrationFilesView from '$/views/Eip8004AgentRegistrationFilesView.svelte'
	import EvmNftView from '$/views/EvmNftView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004AgentRegistration}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eip8004AgentRegistration}>
			{#snippet Pending()}
				{[String((selection.entitySelector.agentId ?? prefetched.agentId) ?? '')].filter(Boolean).join(' ') || title || 'EIP-8004 agent registration'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.agentId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eip8004AgentRegistration}>
			{#snippet Pending()}
				{[String((selection.entitySelector.namespace ?? prefetched.namespace) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.agentId ?? prefetched.agentId) ?? '')].filter(Boolean).join(' ') || title || 'EIP-8004 agent registration'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.namespace) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.agentId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eip8004AgentRegistration}>
			{#snippet Pending()}
				{@const chainId0 = selection.entitySelector.chainId ?? prefetched.chainId}
				{#if chainId0 !== undefined && chainId0 !== null}
					<span data-text="muted">
						{String((chainId0) ?? '')}
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
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									namespace: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const namespace = selection.entitySelector.namespace ?? prefetched.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const namespace = resolvedEntity.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Chain ID</dt>
				<dd>
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
							{@const chainId = selection.entitySelector.chainId ?? prefetched.chainId}
							{#if chainId !== undefined && chainId !== null}
								<NumberValue value={Number(chainId)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const chainId = resolvedEntity.chainId}
							{#if chainId !== undefined && chainId !== null}
								<NumberValue value={Number(chainId)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Identity registry</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									identityRegistry: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const identityRegistry = selection.entitySelector.identityRegistry ?? prefetched.identityRegistry}
							{#if identityRegistry !== undefined && identityRegistry !== null}
								{String((identityRegistry) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const identityRegistry = resolvedEntity.identityRegistry}
							{#if identityRegistry !== undefined && identityRegistry !== null}
								{String((identityRegistry) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Agent ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									agentId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const agentId = selection.entitySelector.agentId ?? prefetched.agentId}
							{#if agentId !== undefined && agentId !== null}
								{String((agentId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const agentId = resolvedEntity.agentId}
							{#if agentId !== undefined && agentId !== null}
								{String((agentId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNft, false>('$evmNft')}
			>
				{#snippet children(evmNft)}
					{#if evmNft != null && evmNft[EntityMetaKey.Selector] != null}
						<div>
							<dt>EVM NFT</dt>
							<dd>
								<EvmNftView
									selection={select(EntityType.EvmNft, evmNft[EntityMetaKey.Selector])}
									prefetched={evmNft}
									href={
										(({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).$contract !== undefined && ({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).$contract.$network !== undefined && ({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).$contract.$network.caip2 !== undefined && ({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).$contract.$network.caip2.reference !== undefined && ({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).$contract !== undefined && ({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).$contract.address !== undefined && ({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).tokenId !== undefined ? resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId]', {
											chainId: String(({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).$contract.$network.caip2.reference ?? ''),
											contractAddress: String(({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).$contract.address ?? ''),
											tokenId: String(({ ...evmNft[EntityMetaKey.Selector], ...evmNft }).tokenId ?? ''),
										}) : undefined)
									}
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

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<Eip8004AgentRegistration_TimestampsView
				selection={selection[EntityProxyField]<EntityType.Eip8004AgentRegistration_Timestamp>('$$timestamps')}
				title='Timestamps'
				emptyText='No EIP-8004 registration observations.'
				id='Eip8004AgentRegistration_TimestampsView-$$timestamps'
			/>

			<Eip8004AgentRegistrationFilesView
				selection={selection[EntityProxyField]<EntityType.Eip8004AgentRegistrationFile>('$$files')}
				title='Files'
				emptyText='No EIP-8004 registration files.'
				id='Eip8004AgentRegistrationFilesView-$$files'
			/>
		{/if}
	{/snippet}
</EntityView>
