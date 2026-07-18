<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.Eip8004AgentRegistration>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Eip8004AgentRegistration>>
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
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.agentId) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 agent registration')
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.agentId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={eip8004AgentRegistration}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.agentId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.namespace) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.agentId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={eip8004AgentRegistration}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.namespace) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.agentId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const chainId0 = pendingEntity.chainId}
			{#if chainId0 !== undefined && chainId0 !== null}
				<span data-text="muted">
					{String((chainId0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={eip8004AgentRegistration}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									namespace: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									chainId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const chainId = resolvedEntity.chainId}
							{#if chainId !== undefined && chainId !== null}
								<NumberValue
									value={chainId}
								/>
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
								sources: selection.sources,
								fields: {
									identityRegistry: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									agentId: true,
								},
							})
						}
					>
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
				resource={selection.$evmNft}
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
										(evmNft[EntityMetaKey.Selector].tokenId !== undefined && evmNft[EntityMetaKey.Selector].$contract !== undefined && evmNft[EntityMetaKey.Selector].$contract.$network !== undefined && evmNft[EntityMetaKey.Selector].$contract.$network.caip2 !== undefined && evmNft[EntityMetaKey.Selector].$contract.$network.caip2.reference !== undefined && evmNft[EntityMetaKey.Selector].$contract.address !== undefined ? resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]', {
											tokenId: String(evmNft[EntityMetaKey.Selector].tokenId ?? ''),
											chainId: String(evmNft[EntityMetaKey.Selector].$contract.$network.caip2.reference ?? ''),
											contractAddress: String(evmNft[EntityMetaKey.Selector].$contract.address ?? ''),
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<Eip8004AgentRegistration_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Timestamps'
				emptyText='No EIP-8004 registration observations.'
				id='Eip8004AgentRegistration_TimestampsView-timestamps'
			/>

			<Eip8004AgentRegistrationFilesView
				selection={
						selection.$$files({
							count: true,
						})
					}
				title='Files'
				emptyText='No EIP-8004 registration files.'
				id='Eip8004AgentRegistrationFilesView-files'
			/>
		{/if}
	{/snippet}
</EntityView>
