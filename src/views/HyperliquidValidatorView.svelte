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
			entityId: EntityId<typeof schema, EntityType.HyperliquidValidator>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const hyperliquidValidator = subscribe(EntityType.HyperliquidValidator, entityId, ({ fields: { name: true, $signer: true, commission: true, recentBlockCount: true, isActive: true, stake: true, isJailed: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidValidator}
	{entityId}
	title={entityId.validator}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{entityId.validator.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={hyperliquidValidator}
			placeholderText={`Loading Hyperliquid Validator...`}
		>
			{#snippet children(hyperliquidValidator)}
				<dl>
					{#if hyperliquidValidator.fields.name != null}
						<div>
							<dt>Name</dt>
							<dd>{hyperliquidValidator.fields.name}</dd>
						</div>
					{/if}

					{#if hyperliquidValidator.fields.$signer != null}
						<div>
							<dt>Signer</dt>
							<dd>
								<HyperliquidAccountView
									entityId={hyperliquidValidator.fields.$signer[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if hyperliquidValidator.fields.commission != null}
						<div>
							<dt>Commission</dt>
							<dd>{hyperliquidValidator.fields.commission}</dd>
						</div>
					{/if}

					{#if hyperliquidValidator.fields.recentBlockCount != null}
						<div>
							<dt>Recent blocks</dt>
							<dd><NumberValue value={hyperliquidValidator.fields.recentBlockCount} /></dd>
						</div>
					{/if}

					{#if hyperliquidValidator.fields.isActive != null}
						<div>
							<dt>Active</dt>
							<dd>{hyperliquidValidator.fields.isActive ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if hyperliquidValidator.fields.stake != null}
						<div>
							<dt>Stake</dt>
							<dd><NumberValue value={hyperliquidValidator.fields.stake} /></dd>
						</div>
					{/if}

					{#if hyperliquidValidator.fields.isJailed != null}
						<div>
							<dt>Jailed</dt>
							<dd>{hyperliquidValidator.fields.isJailed ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
