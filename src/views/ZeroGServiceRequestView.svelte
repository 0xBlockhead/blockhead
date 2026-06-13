<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { subscribe } from '$/routes/+layout.svelte'

	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ZeroGServiceRequest>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const zeroGServiceRequest = subscribe(EntityType.ZeroGServiceRequest, entityId, ({ fields: { $requester: true, requestHash: true, responseHash: true, $settlementTrace: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGSettlementTraceView from '$/views/ZeroGSettlementTraceView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGServiceRequest}
	{entityId}
	title={entityId.requestId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={entityId.requestId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGServiceRequest}
			placeholderText={`Loading 0G service request...`}
		>
			{#snippet children(zeroGServiceRequest)}
				<dl>
					{#if zeroGServiceRequest.fields.$requester != null}
						<div>
							<dt>Requester</dt>
							<dd>
								<EvmAccountView
									entityId={zeroGServiceRequest.fields.$requester[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
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
									entityId={zeroGServiceRequest.fields.$settlementTrace[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
