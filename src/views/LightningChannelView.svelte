<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelectorForSelectorName } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { LightningChannelSelector } from '$/schema/LightningChannel.ts'
	import { NetworkSelector } from '$/schema/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelectorForSelectorName<typeof schema, EntityType.LightningChannel, LightningChannelSelector.NetworkChannelId> & {
				$network: EntitySelectorForSelectorName<typeof schema, EntityType.Network, NetworkSelector.Slug>
			}
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const channel = $derived(subscribe(EntityType.LightningChannel,
		selector,
		({ sources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			], fields: { shortChannelId: true, status: true, capacitySats: true, localBalanceSats: true, remoteBalanceSats: true, $node0: true, $node1: true, fundingTransactionId: true, fundingOutputIndex: true, feeRatePpm: true, active: true, private: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannel}
	entitySelector={selector}
	href={`/network/${selector.$network.slug}/channels/${selector.channelId}`}
	title={selector.channelId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selector.channelId}
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
					{#if lightningChannel.fields.shortChannelId != null}
						<div>
							<dt>Short channel id</dt>
							<dd>{lightningChannel.fields.shortChannelId}</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.status != null}
						<div>
							<dt>Status</dt>
							<dd>{lightningChannel.fields.status}</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.capacitySats != null}
						<div>
							<dt>Capacity</dt>
							<dd>{lightningChannel.fields.capacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.localBalanceSats != null}
						<div>
							<dt>Local balance</dt>
							<dd>{lightningChannel.fields.localBalanceSats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.remoteBalanceSats != null}
						<div>
							<dt>Remote balance</dt>
							<dd>{lightningChannel.fields.remoteBalanceSats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.feeRatePpm != null}
						<div>
							<dt>Fee rate</dt>
							<dd><NumberValue value={lightningChannel.fields.feeRatePpm} /> ppm</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.active != null}
						<div>
							<dt>Active</dt>
							<dd>{lightningChannel.fields.active ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.private != null}
						<div>
							<dt>Private</dt>
							<dd>{lightningChannel.fields.private ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.$node0 != null}
						<div>
							<dt>Node 0</dt>
							<dd>
								<LightningNodeView
									selector={lightningChannel.fields.$node0[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.$node1 != null}
						<div>
							<dt>Node 1</dt>
							<dd>
								<LightningNodeView
									selector={lightningChannel.fields.$node1[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}

					{#if lightningChannel.fields.fundingTransactionId != null}
						<div>
							<dt>Funding outpoint</dt>
							<dd>
								<TruncatedValue
									value={`${lightningChannel.fields.fundingTransactionId}:${lightningChannel.fields.fundingOutputIndex ?? 0}`}
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
