<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/channels'),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.StateChannelDeposit>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const deposit = useEntity(
		EntityType.StateChannelDeposit,
		entityId,
		{
			$: [Source.Local_Internal],
			availableBalance: {},
			lockedBalance: {},
			lastUpdated: {},
			$account: {},
			$network: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannelDeposit}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Deposit </span>
			<ResourceBoundary
				resource={deposit}
				placeholderText="…"
			>
				{#snippet children(loadedDeposit)}
					{#if loadedDeposit.$account?.[EntityMetaKey.Id].address !== undefined}
						<ActorView
							entityId={loadedDeposit.$account[EntityMetaKey.Id]}
							href={resolve('/account/[address]', {
								address: loadedDeposit.$account[EntityMetaKey.Id].address,
							})}
							layout={EntityLayout.Value}
							open={false}
						/>
					{:else}
						{@render Value()}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Per-participant collateral slice tracked for channel funding and dispute reserves.
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={deposit}
				placeholderText="Loading channel deposit…"
			>
				{#snippet children(loadedDeposit)}
					{#if loadedDeposit.$account?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>Account</dt>
							<dd>
								{#if loadedDeposit.$network?.[EntityMetaKey.Id].chainId !== undefined}
									<ActorNetworkView
										entityId={{
											$network: loadedDeposit.$network[EntityMetaKey.Id],
											$actor: loadedDeposit.$account[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Title}
										open={false}
									/>
								{:else}
									<ActorView
										entityId={loadedDeposit.$account[EntityMetaKey.Id]}
										href={resolve('/account/[address]', {
											address: loadedDeposit.$account[EntityMetaKey.Id].address,
										})}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							</dd>
						</div>
					{/if}

					{#if loadedDeposit.availableBalance !== undefined}
						<div>
							<dt>Available</dt>
							<dd>
								<NumberValue value={loadedDeposit.availableBalance} />
							</dd>
						</div>
					{/if}

					{#if loadedDeposit.lockedBalance !== undefined}
						<div>
							<dt>Locked</dt>
							<dd>
								<NumberValue value={loadedDeposit.lockedBalance} />
							</dd>
						</div>
					{/if}

					{#if loadedDeposit.lastUpdated !== undefined}
						<div>
							<dt>Last updated</dt>
							<dd>
								<Timestamp
									timestamp={loadedDeposit.lastUpdated}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.StateChannelDeposit}
			{entityId}
		/>
	{/snippet}
</EntityView>

