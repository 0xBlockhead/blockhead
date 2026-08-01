<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.BlockheadZcashNoteState> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
	}))
	const blockheadZcashNoteState = $derived(viewSelection({
		fields: {
			valueZatoshis: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.noteCommitment || 'blockhead zcash note state')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadZcashNoteState_TimestampsView from '$/views/BlockheadZcashNoteState_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import ZcashShieldedActionView from '$/views/ZcashShieldedActionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashNoteState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.pool || selection.entitySelector.noteCommitment || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZcashNoteState}>
			{#snippet children(entity)}
				{@const valueZatoshis = entity.valueZatoshis}
				{#if valueZatoshis != null}
					<span data-text="muted">
						<NumberValue
							value={valueZatoshis}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					{selection.entitySelector.walletId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$shieldedAction}
			>
				{#snippet children(zcashShieldedAction)}
					{#if zcashShieldedAction != null}
						<div>
							<dt>shielded action</dt>
							<dd>
								<ZcashShieldedActionView
									selection={select(EntityType.ZcashShieldedAction, zcashShieldedAction[EntityMetaKey.Selector])}
									prefetched={zcashShieldedAction}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>pool</dt>
				<dd>
					{selection.entitySelector.pool}
				</dd>
			</div>

			<div>
				<dt>note commitment</dt>
				<dd>
					{selection.entitySelector.noteCommitment}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nullifier: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nullifier = entity.nullifier}
					{#if nullifier != null}
						<div>
							<dt>nullifier</dt>
							<dd>
								{nullifier}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadZcashNoteState}
			>
				{#snippet children(entity)}
					{@const valueZatoshis = entity.valueZatoshis}
					{#if valueZatoshis != null}
						<div>
							<dt>value zatoshis</dt>
							<dd>
								<NumberValue
									value={valueZatoshis}
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
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memo = entity.memo}
					{#if memo != null}
						<div>
							<dt>memo</dt>
							<dd>
								{memo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							diversifier: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const diversifier = entity.diversifier}
					{#if diversifier != null}
						<div>
							<dt>diversifier</dt>
							<dd>
								{diversifier}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							recipientAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const recipientAddress = entity.recipientAddress}
					{#if recipientAddress != null}
						<div>
							<dt>recipient address</dt>
							<dd>
								<TruncatedValue value={recipientAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							receivedTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receivedTransactionId = entity.receivedTransactionId}
					{#if receivedTransactionId != null}
						<div>
							<dt>received transaction ID</dt>
							<dd>
								{receivedTransactionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							receivedAtHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receivedAtHeight = entity.receivedAtHeight}
					{#if receivedAtHeight != null}
						<div>
							<dt>received AT height</dt>
							<dd>
								<NumberValue
									value={receivedAtHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadZcashNoteState_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
