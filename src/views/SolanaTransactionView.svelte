<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SolanaTransaction>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const solanaTransaction = $derived(selection({
		fields: {
			status: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaInstructionsView from '$/views/SolanaInstructionsView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.signature || 'solana transaction')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					transactionId: selection.entitySelector.signature,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.signature} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.signature} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTransaction}>
			{#snippet children(entity)}
				{@const status = entity.status}
				{#if status != null}
					<span data-text="muted">
						{status}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Signature</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.signature} />
				</dd>
			</div>

			<ResourceBoundary
				resource={solanaTransaction}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slot = entity.slot}
					{#if slot != null}
						<div>
							<dt>Slot</dt>
							<dd>
								{slot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeLamports: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeLamports = entity.feeLamports}
					{#if feeLamports != null}
						<div>
							<dt>Fee</dt>
							<dd>
								{feeLamports}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							computeUnitsConsumed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const computeUnitsConsumed = entity.computeUnitsConsumed}
					{#if computeUnitsConsumed != null}
						<div>
							<dt>Compute units consumed</dt>
							<dd>
								{computeUnitsConsumed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(solanaBlock)}
					{#if solanaBlock != null}
						<div>
							<dt>Block</dt>
							<dd>
								<SolanaBlockView
									selection={select(EntityType.SolanaBlock, solanaBlock[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$feePayer}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null}
						<div>
							<dt>Fee payer</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const instructionsResource = selection.$$instructions}
		<ResourceBoundary
			resource={instructionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SolanaInstructionsView
						selection={instructionsResource}
						countResource={instructionsResource.count}
						title='Instructions'
						id='instructions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
