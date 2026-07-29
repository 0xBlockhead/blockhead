<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FilecoinBlock> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	}))


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
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.cid || 'filecoin block')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.cid} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$miner}
		>
			{#snippet children(filecoinMiner)}
				{#if filecoinMiner != null}
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
						prefetched={filecoinMiner}
						href={null}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$tipset}
		>
			{#snippet children(filecoinTipset)}
				{#if filecoinTipset != null}
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>CID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.cid} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$tipset}
			>
				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null}
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
				resource={selection.$miner}
			>
				{#snippet children(filecoinMiner)}
					{#if filecoinMiner != null}
						<div>
							<dt>Miner</dt>
							<dd>
								<FilecoinMinerView
									selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
									prefetched={filecoinMiner}
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
					viewSelection({
						fields: {
							ticketVrFProof: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ticketVrFProof = entity.ticketVrFProof}
					{#if ticketVrFProof != null}
						<div>
							<dt>Ticket VRF proof</dt>
							<dd>
								<TruncatedValue value={ticketVrFProof} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							winCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const winCount = entity.winCount}
					{#if winCount != null}
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
		{@const messagesResource = selection.$$messages}
		<ResourceBoundary
			resource={messagesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinMessagesView
						selection={messagesResource}
						countResource={messagesResource.count}
						title='Messages'
						id='messages'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
