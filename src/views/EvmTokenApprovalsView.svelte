<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmTokenApproval> = $props()


	// Components
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmTokenApproval}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
			fields: {
				approvalKind: true,
				standard: true,
				$approvedActor: true,
			},
		})
	}
>
	{#snippet Item({ item: evmTokenApproval })}
		{@const evmTokenApprovalSelector = evmTokenApproval[EntityMetaKey.Selector]}
		{@const log = evmTokenApprovalSelector.$log}
		{@const evmTokenApprovalHref = resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-approval',
				{
					network: (
						log.$transaction.$network.caip2 !== undefined ?
							caip2StringFromValue(log.$transaction.$network.caip2)
						:
							log.$transaction.$network.slug
					),
					transactionId: log.$transaction.txHash,
					indexInTransaction: String(log.indexInTransaction),
				}
			)}
		{@const selection = select(EntityType.EvmTokenApproval, evmTokenApprovalSelector)}
		<ProjectionBoundary
			resource={selection.Allowance}
		>
			{#snippet Applicable(evmTokenApprovalProjection0)}
				<ResourceBoundary
					resource={evmTokenApprovalProjection0.amount}
				>
					{#snippet children(allowanceAmount0)}
						<EntityView
							entityType={EntityType.EvmTokenApproval}
							entitySelector={evmTokenApprovalSelector}
							href={evmTokenApprovalHref}
						>
							{#snippet Title()}
								{[evmTokenApproval.approvalKind, (evmTokenApproval.standard ?? '')].filter(Boolean).join(' ') || 'Token approval'}
							{/snippet}

							{#snippet Value()}
								{allowanceAmount0}
							{/snippet}

							{#snippet HeadingAfter()}
								<span data-text="annotation">{evmTokenApproval.$approvedActor.address || 'EVM account'}</span>
							{/snippet}
						</EntityView>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Token}
		>
			{#snippet Applicable(evmTokenApprovalProjection1)}
				<ResourceBoundary
					resource={evmTokenApprovalProjection1.tokenId}
				>
					{#snippet children(tokenTokenId0)}
						<EntityView
							entityType={EntityType.EvmTokenApproval}
							entitySelector={evmTokenApprovalSelector}
							href={evmTokenApprovalHref}
						>
							{#snippet Title()}
								{[evmTokenApproval.approvalKind, (evmTokenApproval.standard ?? '')].filter(Boolean).join(' ') || 'Token approval'}
							{/snippet}

							{#snippet Value()}
								{tokenTokenId0}
							{/snippet}

							{#snippet HeadingAfter()}
								<span data-text="annotation">{evmTokenApproval.$approvedActor.address || 'EVM account'}</span>
							{/snippet}
						</EntityView>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Operator}
		>
			{#snippet Applicable(evmTokenApprovalProjection2)}
				<ResourceBoundary
					resource={evmTokenApprovalProjection2.approved}
				>
					{#snippet children(operatorApproved0)}
						<EntityView
							entityType={EntityType.EvmTokenApproval}
							entitySelector={evmTokenApprovalSelector}
							href={evmTokenApprovalHref}
						>
							{#snippet Title()}
								{[evmTokenApproval.approvalKind, (evmTokenApproval.standard ?? '')].filter(Boolean).join(' ') || 'Token approval'}
							{/snippet}

							{#snippet Value()}
								{operatorApproved0}
							{/snippet}

							{#snippet HeadingAfter()}
								<span data-text="annotation">{evmTokenApproval.$approvedActor.address || 'EVM account'}</span>
							{/snippet}
						</EntityView>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntitiesList>
