<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.TonMessage> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TonTransactionView from '$/views/TonTransactionView.svelte'
	import TonTraceView from '$/views/TonTraceView.svelte'
</script>


<EntityView
	entityType={EntityType.TonMessage}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON message'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON message
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>message hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									messageHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.messageHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$sourceTransaction}
			>
				{#snippet children(tonTransaction)}
					{#if tonTransaction != null}
						<div>
							<dt>source transaction</dt>
							<dd>
								<TonTransactionView
									selection={select(EntityType.TonTransaction, tonTransaction[EntityMetaKey.Selector])}
									prefetched={tonTransaction}
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
						fields: {
							outIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outIndex = entity.outIndex}
					{#if outIndex != null}
						<div>
							<dt>out index</dt>
							<dd>
								{outIndex}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>message kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									messageKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.messageKind}
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
				{#snippet children(entity)}
					{@const sourceAddress = entity.sourceAddress}
					{#if sourceAddress != null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={sourceAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const destinationAddress = entity.destinationAddress}
					{#if destinationAddress != null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={destinationAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueNano = entity.valueNano}
					{#if valueNano != null}
						<div>
							<dt>value nano</dt>
							<dd>
								{valueNano}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdLt = entity.createdLt}
					{#if createdLt != null}
						<div>
							<dt>created lt</dt>
							<dd>
								{createdLt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ihrDisabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ihrDisabled = entity.ihrDisabled}
					{#if ihrDisabled != null}
						<div>
							<dt>ihr disabled</dt>
							<dd>
								{ihrDisabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bounce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bounce = entity.bounce}
					{#if bounce != null}
						<div>
							<dt>bounce</dt>
							<dd>
								{bounce ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bounced: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bounced = entity.bounced}
					{#if bounced != null}
						<div>
							<dt>bounced</dt>
							<dd>
								{bounced ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							opcode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const opcode = entity.opcode}
					{#if opcode != null}
						<div>
							<dt>opcode</dt>
							<dd>
								{opcode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bodyHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bodyHash = entity.bodyHash}
					{#if bodyHash != null}
						<div>
							<dt>body hash</dt>
							<dd>
								<TruncatedValue value={bodyHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateInitHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stateInitHash = entity.stateInitHash}
					{#if stateInitHash != null}
						<div>
							<dt>state init hash</dt>
							<dd>
								<TruncatedValue value={stateInitHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$trace}
			>
				{#snippet children(tonTrace)}
					{#if tonTrace != null}
						<div>
							<dt>trace</dt>
							<dd>
								<TonTraceView
									selection={select(EntityType.TonTrace, tonTrace[EntityMetaKey.Selector])}
									prefetched={tonTrace}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$destinationTransaction}
			>
				{#snippet children(tonTransaction)}
					{#if tonTransaction != null}
						<div>
							<dt>destination transaction</dt>
							<dd>
								<TonTransactionView
									selection={select(EntityType.TonTransaction, tonTransaction[EntityMetaKey.Selector])}
									prefetched={tonTransaction}
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
</EntityView>
