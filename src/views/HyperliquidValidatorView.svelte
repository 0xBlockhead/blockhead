<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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

	const hyperliquidValidator = useEntity(EntityType.HyperliquidValidator, entityId, {
		name: {},
		$signer: {},
		commission: {},
		recentBlockCount: {},
		isActive: {},
		stake: {},
		isJailed: {},
	})


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
					{#if hyperliquidValidator.name != null}
						<div>
							<dt>Name</dt>
							<dd>{hyperliquidValidator.name}</dd>
						</div>
					{/if}

					{#if hyperliquidValidator.$signer != null}
						<div>
							<dt>Signer</dt>
							<dd>
								<HyperliquidAccountView
									entityId={hyperliquidValidator.$signer[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if hyperliquidValidator.commission != null}
						<div>
							<dt>Commission</dt>
							<dd>{hyperliquidValidator.commission}</dd>
						</div>
					{/if}

					{#if hyperliquidValidator.recentBlockCount != null}
						<div>
							<dt>Recent blocks</dt>
							<dd><NumberValue value={hyperliquidValidator.recentBlockCount} /></dd>
						</div>
					{/if}

					{#if hyperliquidValidator.isActive != null}
						<div>
							<dt>Active</dt>
							<dd>{hyperliquidValidator.isActive ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if hyperliquidValidator.stake != null}
						<div>
							<dt>Stake</dt>
							<dd><NumberValue value={hyperliquidValidator.stake} /></dd>
						</div>
					{/if}

					{#if hyperliquidValidator.isJailed != null}
						<div>
							<dt>Jailed</dt>
							<dd>{hyperliquidValidator.isJailed ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
