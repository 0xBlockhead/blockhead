<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningChannel>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LightningChannel>>
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

	const lightningChannel = $derived(selection({
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
		fields: {
			shortChannelId: true,
			$node1: true,
			fundingTransactionId: true,
			fundingOutputIndex: true,
			...(open && {
				openedAtMs: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel')
	const viewDomId = $derived('lightning-channel-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannel}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			channelId: String(({ ...selection.entitySelector, ...prefetched }).channelId),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).shortChannelId) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel'}
		{:else}
			<ResourceBoundary resource={lightningChannel}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).shortChannelId) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.shortChannelId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.LightningNode, false>('$node1')}
			>
				{#snippet children(lightningNode)}
					{#if lightningNode != null}
						<LightningNodeView
							selection={select(EntityType.LightningNode, lightningNode.entitySelector)}
							prefetched={lightningNode}
							href={
									resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
										networkSlug: String(lightningNode.entitySelector.$network.slug),
										pubkey: String(lightningNode.entitySelector.publicKey),
									})
								}
							layout={EntityLayout.Value}
							open={false}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={lightningChannel}>
				{#snippet Pending()}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.LightningNode, false>('$node1')}
					>
						{#snippet children(lightningNode)}
							{#if lightningNode != null}
								<LightningNodeView
									selection={select(EntityType.LightningNode, lightningNode.entitySelector)}
									prefetched={lightningNode}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
											networkSlug: String(lightningNode.entitySelector.$network.slug),
											pubkey: String(lightningNode.entitySelector.publicKey),
										})
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(entity)}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.LightningNode, false>('$node1')}
					>
						{#snippet children(lightningNode)}
							{#if lightningNode != null}
								<LightningNodeView
									selection={select(EntityType.LightningNode, lightningNode.entitySelector)}
									prefetched={lightningNode}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
											networkSlug: String(lightningNode.entitySelector.$network.slug),
											pubkey: String(lightningNode.entitySelector.publicKey),
										})
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lightningChannel}>
				{#snippet Pending()}
					{@const fundingTransactionId = prefetched.fundingTransactionId ?? selection.entitySelector.fundingTransactionId}
					{#if fundingTransactionId !== undefined && fundingTransactionId !== null}
						<div>
							<dt>Funding transaction ID</dt>
							<dd>
								{String((fundingTransactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const fundingTransactionId = entity.fundingTransactionId ?? selection.entitySelector.fundingTransactionId ?? prefetched.fundingTransactionId}
					{#if fundingTransactionId !== undefined && fundingTransactionId !== null}
						<div>
							<dt>Funding transaction ID</dt>
							<dd>
								{String((fundingTransactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={lightningChannel}>
				{#snippet Pending()}
					{@const fundingOutputIndex = prefetched.fundingOutputIndex ?? selection.entitySelector.fundingOutputIndex}
					{#if fundingOutputIndex !== undefined && fundingOutputIndex !== null}
						<div>
							<dt>Funding output index</dt>
							<dd>
								<NumberValue value={Number(fundingOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const fundingOutputIndex = entity.fundingOutputIndex ?? selection.entitySelector.fundingOutputIndex ?? prefetched.fundingOutputIndex}
					{#if fundingOutputIndex !== undefined && fundingOutputIndex !== null}
						<div>
							<dt>Funding output index</dt>
							<dd>
								<NumberValue value={Number(fundingOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={lightningChannel}>
				{#snippet Pending()}
					{@const openedAtMs = prefetched.openedAtMs ?? selection.entitySelector.openedAtMs}
					{#if openedAtMs !== undefined && openedAtMs !== null}
						<div>
							<dt>Opened</dt>
							<dd>
								<Timestamp timestamp={Number(openedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const openedAtMs = entity.openedAtMs ?? selection.entitySelector.openedAtMs ?? prefetched.openedAtMs}
					{#if openedAtMs !== undefined && openedAtMs !== null}
						<div>
							<dt>Opened</dt>
							<dd>
								<Timestamp timestamp={Number(openedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
