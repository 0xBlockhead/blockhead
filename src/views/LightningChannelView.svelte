<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
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
	href={
		'networkSlug' in entityId.$network ?
			`/network/${entityId.$network.networkSlug}/channels/${entityId.channelId}`
		:
			`/network/${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}/channels/${entityId.channelId}`
	}
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
			{#snippet children(lightningChannel)}
				<dl>
					{#if lightningChannel.shortChannelId != null}
						<div>
							<dt>Short channel id</dt>
							<dd>{lightningChannel.shortChannelId}</dd>
						</div>
					{/if}

					{#if lightningChannel.status != null}
						<div>
							<dt>Status</dt>
							<dd>{lightningChannel.status}</dd>
						</div>
					{/if}

					{#if lightningChannel.capacitySats != null}
						<div>
							<dt>Capacity</dt>
							<dd>{lightningChannel.capacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningChannel.localBalanceSats != null}
						<div>
							<dt>Local balance</dt>
							<dd>{lightningChannel.localBalanceSats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningChannel.remoteBalanceSats != null}
						<div>
							<dt>Remote balance</dt>
							<dd>{lightningChannel.remoteBalanceSats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningChannel.feeRatePpm != null}
						<div>
							<dt>Fee rate</dt>
							<dd><NumberValue value={lightningChannel.feeRatePpm} /> ppm</dd>
						</div>
					{/if}

					{#if lightningChannel.active != null}
						<div>
							<dt>Active</dt>
							<dd>{lightningChannel.active ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if lightningChannel.private != null}
						<div>
							<dt>Private</dt>
							<dd>{lightningChannel.private ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if lightningChannel.$node0 != null}
						<div>
							<dt>Node 0</dt>
							<dd>
								<LightningNodeView
									entityId={lightningChannel.$node0[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if lightningChannel.$node1 != null}
						<div>
							<dt>Node 1</dt>
							<dd>
								<LightningNodeView
									entityId={lightningChannel.$node1[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if lightningChannel.fundingTransactionId != null}
						<div>
							<dt>Funding outpoint</dt>
							<dd>
								<TruncatedValue
									value={`${lightningChannel.fundingTransactionId}:${lightningChannel.fundingOutputIndex ?? 0}`}
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
