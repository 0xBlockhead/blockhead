<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		title = 'Bridge transaction',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BridgeTransaction>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'TypeAnnotationTooltip'
		>
	> = $props()


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeTransaction}
	bind:open
	{entityId}
	{href}
	{title}
	{...entityViewRest}
>
	{#snippet Heading()}
		{title}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Origin-chain bridge records usually list the depositor, source network, and the transaction that locked or burned funds on that side.
		</p>
		<p>
			Final delivery, relayer proofs, and refunds settle on the destination ledger and in the bridge’s own lifecycle rules—always verify both chains and the protocol’s status pages.
		</p>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">
			<dl data-column-item="center">
			<div>
				<dt>Origin chain</dt>
				<dd>
					<NetworkView
						entityId={entityId.$sourceTx.$network}
						href={resolve('/(explore)/(networks)/network/[networkId]', {
							networkId: String(entityId.$sourceTx.$network.chainId),
						})}
						layout={EntityLayout.Id}
						open={false}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
			<div>
				<dt>Origin transaction</dt>
				<dd>
					<EvmTransactionView
						entityId={entityId.$sourceTx}
						href={resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
							{
								networkId: String(entityId.$sourceTx.$network.chainId),
								transactionId: entityId.$sourceTx.txHash,
							},
						)}
						layout={EntityLayout.Id}
						open={false}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
			<div>
				<dt>Recorded at</dt>
				<dd>
					<Timestamp
						timestamp={entityId.createdAt}
						format={TimestampFormat.Both}
					/>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Initiator</dt>
					<dd>
						<ActorNetworkView
							entityId={{
								$network: entityId.$sourceTx.$network,
								$actor: entityId.$account,
							}}
							href={resolve('/~/(accounts)/accounts/account/[accountId]', {
								accountId: entityId.$account.address,
							})}
							layout={EntityLayout.Id}
							open={false}
							showTypeAnnotation={false}
						/>
					</dd>
				</div>
			{/if}
			</dl>
		</div>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.BridgeTransaction}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
