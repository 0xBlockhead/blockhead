<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LightningChannel>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const channel = useEntity(
		EntityType.LightningChannel,
		entityId,
		{
			$: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
			shortChannelId: {},
			status: {},
			capacitySats: {},
			localBalanceSats: {},
			remoteBalanceSats: {},
			$node0: {},
			$node1: {},
			fundingTransactionId: {},
			fundingOutputIndex: {},
			feeRatePpm: {},
			active: {},
			private: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannel}
	{entityId}
	href={`/network/${entityId.$network.networkSlug}/channels/${entityId.channelId}`}
	title={entityId.channelId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={entityId.channelId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Lightning channel is a payment-channel relationship anchored by funding output metadata; Lightning payments through it are not base-layer transactions.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(row)}
				<dl>
					{#if row.shortChannelId != null}
						<div>
							<dt>Short channel id</dt>
							<dd>{row.shortChannelId}</dd>
						</div>
					{/if}

					{#if row.status != null}
						<div>
							<dt>Status</dt>
							<dd>{row.status}</dd>
						</div>
					{/if}

					{#if row.capacitySats != null}
						<div>
							<dt>Capacity</dt>
							<dd>{row.capacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if row.localBalanceSats != null}
						<div>
							<dt>Local balance</dt>
							<dd>{row.localBalanceSats.toString()} sats</dd>
						</div>
					{/if}

					{#if row.remoteBalanceSats != null}
						<div>
							<dt>Remote balance</dt>
							<dd>{row.remoteBalanceSats.toString()} sats</dd>
						</div>
					{/if}

					{#if row.feeRatePpm != null}
						<div>
							<dt>Fee rate</dt>
							<dd><NumberValue value={row.feeRatePpm} /> ppm</dd>
						</div>
					{/if}

					{#if row.active != null}
						<div>
							<dt>Active</dt>
							<dd>{row.active ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if row.private != null}
						<div>
							<dt>Private</dt>
							<dd>{row.private ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if row.$node0 != null}
						<div>
							<dt>Node 0</dt>
							<dd>
								<LightningNodeView
									entityId={row.$node0[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if row.$node1 != null}
						<div>
							<dt>Node 1</dt>
							<dd>
								<LightningNodeView
									entityId={row.$node1[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if row.fundingTransactionId != null}
						<div>
							<dt>Funding outpoint</dt>
							<dd>
								<TruncatedValue
									value={`${row.fundingTransactionId}:${row.fundingOutputIndex ?? 0}`}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
