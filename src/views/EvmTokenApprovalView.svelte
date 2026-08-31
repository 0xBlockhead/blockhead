<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmTokenApproval> = $props()

	const log = $derived(selection.entitySelector.$log)
	const evmTokenApproval = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockscout_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			approvalKind: true,
			standard: true,
		},
	}))
	const titleFallback = $derived([(prefetched.approvalKind ?? ''), (prefetched.standard ?? '')].filter(Boolean).join(' ') || 'Token approval')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTokenApproval}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-approval',
				{
					network: (
						'caip2' in log.$transaction.$network ?
							caip2StringFromValue(log.$transaction.$network.caip2)
						:
							log.$transaction.$network.slug
					),
					transactionId: log.$transaction.txHash,
					indexInTransaction: String(log.indexInTransaction),
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
		<ResourceBoundary resource={evmTokenApproval}>
			{#snippet children(entity)}
				{[entity.approvalKind, (entity.standard ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ProjectionBoundary
			resource={selection.Allowance}
		>
			{#snippet Applicable(projection)}
				<ResourceBoundary
					resource={projection.amount}
				>
					{#snippet children(amount)}
						<NumberValue
							value={amount}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Token}
		>
			{#snippet Applicable(projection)}
				<ResourceBoundary
					resource={projection.tokenId}
				>
					{#snippet children(tokenId)}
						<NumberValue
							value={tokenId}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Operator}
		>
			{#snippet Applicable(projection)}
				<ResourceBoundary
					resource={projection.approved}
				>
					{#snippet children(approved)}
						{approved ? 'Yes' : 'No'}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$approvedActor}
		>
			{#snippet children(evmAccount)}
				<span data-text="muted">
					<EvmAccountView
						selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Log</dt>
				<dd>
					<EvmLogView
						selection={select(EntityType.EvmLog, selection.entitySelector.$log)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Token contract</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$tokenContract}
					>
						{#snippet children(evmContract)}
							{@const evmContractInitial = untrack(() => evmContract)}
							<EvmContractView
								selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
								prefetched={evmContract ?? evmContractInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Owner</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$owner}
					>
						{#snippet children(evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Approved actor</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$approvedActor}
					>
						{#snippet children(evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Approval kind</dt>
				<dd>
					<ResourceBoundary
						resource={evmTokenApproval}
					>
						{#snippet children(entity)}
							{entity.approvalKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={evmTokenApproval}
			>
				{#snippet children(entity)}
					{@const standard = entity.standard}
					{#if standard != null}
						<div>
							<dt>Token standard</dt>
							<dd>
								{standard}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ProjectionBoundary
				resource={selection.Allowance}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Amount</dt>
						<dd>
							<ResourceBoundary
								resource={projection.amount}
							>
								{#snippet children(amount)}
									<NumberValue
										value={amount}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Token}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Token ID</dt>
						<dd>
							<ResourceBoundary
								resource={projection.tokenId}
							>
								{#snippet children(tokenId)}
									<NumberValue
										value={tokenId}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Operator}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Approved</dt>
						<dd>
							<ResourceBoundary
								resource={projection.approved}
							>
								{#snippet children(approved)}
									{approved ? 'Yes' : 'No'}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>
		</dl>
	{/snippet}
</EntityView>
