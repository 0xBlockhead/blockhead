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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidAccount>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Self from '$/views/HyperliquidAccountView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidAccount}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.address}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { accountRole: true, $masterAccount: true, $agentAccount: true } })}
			placeholderText={`Loading Hyperliquid Account...`}
		>
			{#snippet children(hyperliquidAccount)}
				<dl>
					{#if hyperliquidAccount.accountRole != null}
						<div>
							<dt>Role</dt>
							<dd>{hyperliquidAccount.accountRole}</dd>
						</div>
					{/if}

					{#if hyperliquidAccount.$masterAccount != null}
						<div>
							<dt>Master account</dt>
							<dd>
								<Self
									selection={select(EntityType.HyperliquidAccount, hyperliquidAccount.$masterAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

								/>
							</dd>
						</div>
					{/if}

					{#if hyperliquidAccount.$agentAccount != null}
						<div>
							<dt>Agent account</dt>
							<dd>
								<Self
									selection={select(EntityType.HyperliquidAccount, hyperliquidAccount.$agentAccount[EntityMetaKey.Selector])}
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
