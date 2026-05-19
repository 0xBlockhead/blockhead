<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


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


	// State
	const bridgeTxKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
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
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

			<div>
				<dt>Origin chain</dt>
				<dd>
					<a
						href={resolve('/(explore)/(networks)/network/[networkId]', {
							networkId: String(entityId.$sourceTx.$network.chainId),
						})}
					>
						{String(entityId.$sourceTx.$network.chainId)}
					</a>
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
						layout={EntityLayout.Summary}
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

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${bridgeTxKey}:carousel-transaction`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>
							Transaction
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Transaction"
						href={`#${bridgeTxKey}:transaction`}
					>Transaction</a>
					<a
						data-scroll-marker-label="Initiator"
						href={`#${bridgeTxKey}:initiator`}
					>Initiator</a>
				{/snippet}

				{#snippet children(_ctx)}
					<section id={`${bridgeTxKey}:transaction`}>
						<EvmTransactionView
							entityId={entityId.$sourceTx}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
								{
									networkId: String(entityId.$sourceTx.$network.chainId),
									transactionId: entityId.$sourceTx.txHash,
								},
							)}
							open={false}
						/>
					</section>

					<section id={`${bridgeTxKey}:initiator`}>
						<ActorNetworkView
							entityId={{
								$network: entityId.$sourceTx.$network,
								$actor: entityId.$account,
							}}
							href={resolve('/~/(accounts)/accounts/account/[accountId]', {
								accountId: entityId.$account.address,
							})}
							layout={EntityLayout.Summary}
							open={false}
							showTypeAnnotation={false}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			<div
				class="bridge-transaction-carousel-groups"
				data-column="gap-3"
			>
				<CollapsibleTabs
					id={`${bridgeTxKey}:carousel-extra`}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>
								More
							</HeadingComponent>
						</header>
					{/snippet}

					{#snippet Markers()}
						<a
							data-scroll-marker-label="Content"
							href={`#${bridgeTxKey}:bridge-tx-extra`}
						>Content</a>
					{/snippet}

					{#snippet children(_childrenContext)}
						<section id={`${bridgeTxKey}:bridge-tx-extra`}>
							{@render children()}
						</section>
					{/snippet}
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>


<style>
	.bridge-transaction-carousel-groups :global(.carousel) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
