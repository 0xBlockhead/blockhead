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
	}: Omit<EntitySelectionViewProps<EntityType.SolanaInstruction>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaInstruction}
	entitySelector={selection.entitySelector}
	title={title ?? 'solana instruction'}
	href={
		href === undefined ?
			(
				selection.entitySelector.instructionKind === 'InnerInstruction'
				&& 'indexInInstruction' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]',
						{
							network: (
								'caip2' in transaction.$network ?
									caip2StringFromValue(transaction.$network.caip2)
								:
									transaction.$network.slug
							),
							transactionId: transaction.signature,
							instructionKind: selection.entitySelector.instructionKind,
							indexInTransaction: String(selection.entitySelector.indexInTransaction),
							indexInInstruction: String(selection.entitySelector.indexInInstruction),
						}
					)
				:
					selection.entitySelector.instructionKind === 'Instruction' ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]',
							{
								network: (
									'caip2' in transaction.$network ?
										caip2StringFromValue(transaction.$network.caip2)
									:
										transaction.$network.slug
								),
								transactionId: transaction.signature,
								instructionKind: selection.entitySelector.instructionKind,
								indexInTransaction: String(selection.entitySelector.indexInTransaction),
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
	{#snippet Title()}
		<SolanaTransactionView
			selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<SolanaTransactionView
			selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.instructionKind}
		</span>

		<span data-text="muted">
			{selection.entitySelector.indexInTransaction}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Instruction kind</dt>
				<dd>
					{selection.entitySelector.instructionKind}
				</dd>
			</div>

			<div>
				<dt>Index in transaction</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.indexInTransaction}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							indexInInstruction: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const indexInInstruction = entity.indexInInstruction}
					{#if indexInInstruction != null}
						<div>
							<dt>Index in instruction</dt>
							<dd>
								<NumberValue
									value={indexInInstruction}
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
							parsedType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parsedType = entity.parsedType}
					{#if parsedType != null}
						<div>
							<dt>Parsed type</dt>
							<dd>
								{parsedType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stackHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stackHeight = entity.stackHeight}
					{#if stackHeight != null}
						<div>
							<dt>Stack height</dt>
							<dd>
								{stackHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$program}
			>
				{#snippet children(solanaProgram)}
					{#if solanaProgram != null}
						<div>
							<dt>Program</dt>
							<dd>
								<SolanaProgramView
									selection={select(EntityType.SolanaProgram, solanaProgram[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Transaction</dt>
				<dd>
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						data: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const data = entity.data}
				{#if data != null && data !== ''}
					<code>{data}</code>
				{:else}
					<p data-text="muted">No instruction data available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const accountsResource = selection.$$accounts}
		<ResourceBoundary
			resource={accountsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SolanaAccountsView
						selection={accountsResource}
						countResource={accountsResource.count}
						title='Accounts'
						id='accounts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
