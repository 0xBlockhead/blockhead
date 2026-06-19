<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { select } from '$/routes/+layout.svelte'

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGServiceRequest>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()


	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGSettlementTraceView from '$/views/ZeroGSettlementTraceView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGServiceRequest}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.requestId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.requestId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { $requester: true, requestHash: true, responseHash: true, $settlementTrace: true } })}
			placeholderText={`Loading 0G service request...`}
		>
			{#snippet children(zeroGServiceRequest)}
				<dl>
					{#if zeroGServiceRequest.fields.$requester != null}
						<div>
							<dt>Requester</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, zeroGServiceRequest.fields.$requester[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

								/>
							</dd>
						</div>
					{/if}

					{#if zeroGServiceRequest.fields.requestHash != null}
						<div>
							<dt>Request Hash</dt>
							<dd>
								<TruncatedValue
									value={zeroGServiceRequest.fields.requestHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if zeroGServiceRequest.fields.responseHash != null}
						<div>
							<dt>Response Hash</dt>
							<dd>
								<TruncatedValue
									value={zeroGServiceRequest.fields.responseHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if zeroGServiceRequest.fields.$settlementTrace != null}
						<div>
							<dt>Settlement</dt>
							<dd>
								<ZeroGSettlementTraceView
									selection={select(EntityType.ZeroGSettlementTrace, zeroGServiceRequest.fields.$settlementTrace[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
