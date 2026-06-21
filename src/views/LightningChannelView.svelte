<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LightningChannel>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()



	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannel}
	entitySelector={selection.entitySelector}
	href={`/network/${
		'slug' in selection.entitySelector.$network ?
			selection.entitySelector.$network.slug
		:
			`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`
	}/channels/${selection.entitySelector.channelId}`}
	title={selection.entitySelector.channelId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.channelId}
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
			resource={selection(
		({ sources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			], fields: { shortChannelId: true, status: true, capacitySats: true, localBalanceSats: true, remoteBalanceSats: true, $node0: true, $node1: true, fundingTransactionId: true, fundingOutputIndex: true, feeRatePpm: true, active: true, private: true } }),
	)}
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
									selection={select(EntityType.LightningNode, lightningChannel.$node0[EntityMetaKey.Selector])}
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
									selection={select(EntityType.LightningNode, lightningChannel.$node1[EntityMetaKey.Selector])}
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
