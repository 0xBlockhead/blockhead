<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TonMessage>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const sourceTransaction = $derived(selection.entitySelector.$sourceTransaction)


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
	href={
		href === undefined ?
			(
				selection.entitySelector.outIndex !== undefined
				&& sourceTransaction !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]/(tonTransaction)/message/[outIndex=nonNegativeInteger]',
						{
							network: (
								sourceTransaction.$account.$network.caip2 !== undefined ?
									caip2StringFromValue(sourceTransaction.$account.$network.caip2)
								:
									sourceTransaction.$account.$network.slug
							),
							accountId: sourceTransaction.$account.address,
							lt: String(sourceTransaction.lt),
							outIndex: String(selection.entitySelector.outIndex),
						}
					)
				:
					selection.entitySelector.messageHash !== undefined
					&& network !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/ton/[messageHash=stringSegment]',
							{
								network: (
									network.caip2 !== undefined ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								messageHash: selection.entitySelector.messageHash,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{@const networkInitial = untrack(() => network)}
							<NetworkView
								selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
								prefetched={network ?? networkInitial}
								layout={EntityLayout.Value}
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
									layout={EntityLayout.Value}
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
									layout={EntityLayout.Value}
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
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
