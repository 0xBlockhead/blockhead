<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { select } from '$/routes/+layout.svelte'

	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.HyperliquidAccount>
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
	entitySelector={selector}
	title={selector.address}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selector.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.HyperliquidAccount, selector, ({ fields: { accountRole: true, $masterAccount: true, $agentAccount: true } }))}
			placeholderText={`Loading Hyperliquid Account...`}
		>
			{#snippet children(hyperliquidAccount)}
				<dl>
					{#if hyperliquidAccount.fields.accountRole != null}
						<div>
							<dt>Role</dt>
							<dd>{hyperliquidAccount.fields.accountRole}</dd>
						</div>
					{/if}

					{#if hyperliquidAccount.fields.$masterAccount != null}
						<div>
							<dt>Master account</dt>
							<dd>
								<Self
									selector={hyperliquidAccount.fields.$masterAccount[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}

								/>
							</dd>
						</div>
					{/if}

					{#if hyperliquidAccount.fields.$agentAccount != null}
						<div>
							<dt>Agent account</dt>
							<dd>
								<Self
									selector={hyperliquidAccount.fields.$agentAccount[EntityMetaKey.Selector]}
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
