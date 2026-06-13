<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FilecoinMessage>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const filecoinMessage = subscribe(EntityType.FilecoinMessage,
		entityId,
		({ fields: { method: true, nonce: true, valueAttoFil: true, gasLimit: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMessage}
	{entityId}
	title={entityId.cid}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.cid}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={filecoinMessage}
			placeholderText="Loading Filecoin message…"
		>
			{#snippet children(filecoinMessage)}
				<dl>
					{#if filecoinMessage.fields.method != null}
						<div>
							<dt>Method</dt>
							<dd><NumberValue value={filecoinMessage.fields.method} /></dd>
						</div>
					{/if}

					{#if filecoinMessage.fields.nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd><NumberValue value={filecoinMessage.fields.nonce} /></dd>
						</div>
					{/if}

					{#if filecoinMessage.fields.valueAttoFil != null}
						<div>
							<dt>Value</dt>
							<dd><NumberValue value={filecoinMessage.fields.valueAttoFil} /> attoFIL</dd>
						</div>
					{/if}

					{#if filecoinMessage.fields.gasLimit != null}
						<div>
							<dt>Gas Limit</dt>
							<dd><NumberValue value={filecoinMessage.fields.gasLimit} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
