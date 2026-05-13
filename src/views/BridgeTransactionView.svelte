<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Transaction',
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
		>
	> = $props()


	const bridgeTransaction = useEntity(
		EntityType.BridgeTransaction,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
		},
	)
</script>


<EntityView
	entityType={EntityType.BridgeTransaction}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Source chain id</dt>
				<dd>{String(entityId.$sourceTx.$network.chainId)}</dd>
			</div>
			<div>
				<dt>Source tx</dt>
				<dd>
					<TruncatedValue
						value={entityId.$sourceTx.txHash}
						format={TruncatedValueFormat.Abbr}
					/>
				</dd>
			</div>
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp
						timestamp={entityId.createdAt}
						format={TimestampFormat.Both}
					/>
				</dd>
			</div>
			{#if open}
				<ResourceBoundary resource={bridgeTransaction}>
					{#snippet children(_row)}
						<div>
							<dt>Account</dt>
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
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _open })}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BridgeTransaction}
				{entityId}
			/>
		{/if}
	{/snippet}
</EntityView>
