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
									selection={select(EntityType.HyperliquidAccount, hyperliquidValidator.fields.$signer[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

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
