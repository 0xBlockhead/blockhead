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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningNodeState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLightningNodeState>>
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
	const blockheadLightningNodeState = $derived(selection({
		sources: [
			Source.LightningLnd_Grpc,
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
		fields: {
			alias: true,
			$node: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.alias) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.connectionId ?? prefetched.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning node state')
	const viewDomId = $derived('blockhead-lightning-node-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadLightningNodeState_TimestampsView from '$/views/BlockheadLightningNodeState_TimestampsView.svelte'
	import BlockheadLightningChannelStatesView from '$/views/BlockheadLightningChannelStatesView.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import BlockheadLightningInvoicesView from '$/views/BlockheadLightningInvoicesView.svelte'
	import BlockheadLightningPaymentsView from '$/views/BlockheadLightningPaymentsView.svelte'
	import LightningNetworkView from '$/views/LightningNetworkView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningNodeState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLightningNodeState}>
			{#snippet Pending()}
				{[String((prefetched.alias) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.connectionId ?? prefetched.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning node state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.alias) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningNodeState}>
			{#snippet Pending()}
				<LightningNetworkView
					selection={select(EntityType.LightningNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<LightningNetworkView
					selection={select(EntityType.LightningNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningNodeState}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.LightningNode, false>('$node')}
				>
					{#snippet children(lightningNode)}
						{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<LightningNodeView
									selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
									prefetched={lightningNode}
									href={
										(lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.slug !== undefined && lightningNode[EntityMetaKey.Selector].publicKey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
											networkSlug: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
											pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.LightningNode, false>('$node')}
				>
					{#snippet children(lightningNode)}
						{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<LightningNodeView
									selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
									prefetched={lightningNode}
									href={
										(lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.slug !== undefined && lightningNode[EntityMetaKey.Selector].publicKey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
											networkSlug: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
											pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									connectionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const connectionId = selection.entitySelector.connectionId ?? prefetched.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionId = resolvedEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<LightningNetworkView
						selection={select(EntityType.LightningNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lndPubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lndPubkey = prefetched.lndPubkey}
					{#if lndPubkey !== undefined && lndPubkey !== null}
						<div>
							<dt>lnd public key</dt>
							<dd>
								{String((lndPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lndPubkey = resolvedEntity.lndPubkey}
					{#if lndPubkey !== undefined && lndPubkey !== null}
						<div>
							<dt>lnd public key</dt>
							<dd>
								{String((lndPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							alias: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const alias = prefetched.alias}
					{#if alias !== undefined && alias !== null}
						<div>
							<dt>alias</dt>
							<dd>
								{String((alias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const alias = resolvedEntity.alias}
					{#if alias !== undefined && alias !== null}
						<div>
							<dt>alias</dt>
							<dd>
								{String((alias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.LightningNode, false>('$node')}
			>
				{#snippet children(lightningNode)}
					{#if lightningNode != null && lightningNode[EntityMetaKey.Selector] != null}
						<div>
							<dt>node</dt>
							<dd>
								<LightningNodeView
									selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector])}
									prefetched={lightningNode}
									href={
										(lightningNode[EntityMetaKey.Selector].$network !== undefined && lightningNode[EntityMetaKey.Selector].$network.slug !== undefined && lightningNode[EntityMetaKey.Selector].publicKey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
											networkSlug: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
											pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
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
			<BlockheadLightningNodeState_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadLightningNodeState_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No node-state observations.'
				id='BlockheadLightningNodeState_TimestampsView-$$timestamps'
			/>

			<BlockheadLightningChannelStatesView
				selection={selection[EntityProxyField]<EntityType.BlockheadLightningChannelState>('$$channelStates')}
				title='channel states'
				emptyText='No local channel states.'
				id='BlockheadLightningChannelStatesView-$$channelStates'
			/>

			<LightningChannelsView
				selection={selection[EntityProxyField]<EntityType.LightningChannel>('$$channels')}
				title='channels'
				emptyText='No public channel refs.'
				id='LightningChannelsView-$$channels'
			/>

			<BlockheadLightningInvoicesView
				selection={selection[EntityProxyField]<EntityType.BlockheadLightningInvoice>('$$invoices')}
				title='invoices'
				emptyText='No invoices.'
				id='BlockheadLightningInvoicesView-$$invoices'
			/>

			<BlockheadLightningPaymentsView
				selection={selection[EntityProxyField]<EntityType.BlockheadLightningPayment>('$$payments')}
				title='payments'
				emptyText='No payments.'
				id='BlockheadLightningPaymentsView-$$payments'
			/>
		{/if}
	{/snippet}
</EntityView>
