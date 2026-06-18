<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NearReceipt>
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
	import NearAccountView from '$/views/NearAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.NearReceipt}
	entitySelector={selector}
	title={selector.receiptId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.receiptId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.NearReceipt, selector, ({ fields: { $predecessor: true, $receiver: true } }))}
			placeholderText="Loading NEAR Receipt..."
		>
			{#snippet children(nearReceipt)}
				<dl>
					{#if nearReceipt.fields.$predecessor != null}
						<div>
							<dt>Predecessor</dt>
							<dd>
								<NearAccountView
									selector={nearReceipt.fields.$predecessor[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}

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
									selector={nearReceipt.fields.$receiver[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}

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
