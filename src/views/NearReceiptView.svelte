<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
			entityId: EntityId<typeof schema, EntityType.NearReceipt>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const nearReceipt = subscribe(EntityType.NearReceipt,
		entityId,
		({ fields: { $predecessor: true, $receiver: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NearAccountView from '$/views/NearAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.NearReceipt}
	{entityId}
	title={entityId.receiptId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.receiptId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={nearReceipt}
			placeholderText="Loading NEAR Receipt..."
		>
			{#snippet children(nearReceipt)}
				<dl>
					{#if nearReceipt.fields.$predecessor != null}
						<div>
							<dt>Predecessor</dt>
							<dd>
								<NearAccountView
									entityId={nearReceipt.fields.$predecessor[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if nearReceipt.fields.$receiver != null}
						<div>
							<dt>Receiver</dt>
							<dd>
								<NearAccountView
									entityId={nearReceipt.fields.$receiver[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
				</dl>
	{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
