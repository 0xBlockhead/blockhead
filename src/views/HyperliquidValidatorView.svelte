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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidValidator>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidValidator}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.validator}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.validator.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { name: true, $signer: true, commission: true, recentBlockCount: true, isActive: true, stake: true, isJailed: true } })}
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
									selection={select(EntityType.HyperliquidAccount, hyperliquidValidator.$signer[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

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
