<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.FilecoinBlock>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.FilecoinBlock>
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
	const filecoinBlock = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.cid) ?? '')].filter(Boolean).join(' ') || 'filecoin block')
	const viewDomId = $derived('filecoin-block-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinMessagesView from '$/views/FilecoinMessagesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinBlock}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={filecoinBlock}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const cid0 = resolvedEntity.cid}
				{#if cid0 !== undefined && cid0 !== null}
					<TruncatedValue value={String((cid0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinBlock}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={
						selection
							.$miner({
								sources: [
									Source.Lotus_JsonRpc,
									Source.Filfox_Rest,
								],
							})
					}
				>
					{#snippet children(filecoinMiner)}
						{#if filecoinMiner != null && filecoinMiner[EntityMetaKey.Selector] != null}
							<FilecoinMinerView
								selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
								prefetched={filecoinMiner}
								href=""
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinBlock}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={
						selection
							.$tipset({
								sources: [
									Source.Lotus_JsonRpc,
									Source.Filfox_Rest,
								],
							})
					}
				>
					{#snippet children(filecoinTipset)}
						{#if filecoinTipset != null && filecoinTipset[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
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
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>CID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									cid: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const cid = resolvedEntity.cid}
							{#if cid !== undefined && cid !== null}
								<TruncatedValue value={String((cid) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection
						.$tipset({
							sources: [
								Source.Lotus_JsonRpc,
								Source.Filfox_Rest,
							],
						})
				}
			>
				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null && filecoinTipset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Tipset</dt>
							<dd>
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
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
					selection
						.$miner({
							sources: [
								Source.Lotus_JsonRpc,
								Source.Filfox_Rest,
							],
						})
				}
			>
				{#snippet children(filecoinMiner)}
					{#if filecoinMiner != null && filecoinMiner[EntityMetaKey.Selector] != null}
						<div>
							<dt>Miner</dt>
							<dd>
								<FilecoinMinerView
									selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
									prefetched={filecoinMiner}
									href={
										(
											filecoinMiner[EntityMetaKey.Selector] != null && 'minerAddress' in filecoinMiner[EntityMetaKey.Selector]
											&& filecoinMiner[EntityMetaKey.Selector].minerAddress != null
											&& filecoinMiner[EntityMetaKey.Selector] != null && '$network' in filecoinMiner[EntityMetaKey.Selector] ?
												filecoinMiner[EntityMetaKey.Selector].$network != null && 'caip2' in filecoinMiner[EntityMetaKey.Selector].$network
												&& filecoinMiner[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
												minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
												network: String(caip2StringFromValue(filecoinMiner[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													filecoinMiner[EntityMetaKey.Selector].$network != null && 'slug' in filecoinMiner[EntityMetaKey.Selector].$network
													&& filecoinMiner[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
													minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
													network: String(filecoinMiner[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							ticketVrFProof: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ticketVrFProof = resolvedEntity.ticketVrFProof}
					{#if ticketVrFProof !== undefined && ticketVrFProof !== null}
						<div>
							<dt>Ticket VRF proof</dt>
							<dd>
								<TruncatedValue value={String((ticketVrFProof) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							winCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const winCount = resolvedEntity.winCount}
					{#if winCount !== undefined && winCount !== null}
						<div>
							<dt>Win count</dt>
							<dd>
								<NumberValue
									value={winCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const filecoinBlockFilecoinMessagesViewMessagesResource = selection
		.$$messages({
			sources: [
				Source.Lotus_JsonRpc,
				Source.Filfox_Rest,
			],
		})}
				<ResourceBoundary
					resource={filecoinBlockFilecoinMessagesViewMessagesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<FilecoinMessagesView
							selection={filecoinBlockFilecoinMessagesViewMessagesResource}
							countResource={filecoinBlockFilecoinMessagesViewMessagesResource.count}
							title='Messages'
							id='FilecoinMessagesView-messages'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
