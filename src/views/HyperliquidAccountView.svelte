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
			entityId: EntityId<typeof schema, EntityType.HyperliquidAccount>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const hyperliquidAccount = useEntity(EntityType.HyperliquidAccount, entityId, {
		accountRole: {},
		$masterAccount: {},
		$agentAccount: {},
	})


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Self from '$/views/HyperliquidAccountView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidAccount}
	{entityId}
	title={entityId.address}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={entityId.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={hyperliquidAccount}
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
									entityId={hyperliquidAccount.$masterAccount[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if hyperliquidAccount.$agentAccount != null}
						<div>
							<dt>Agent account</dt>
							<dd>
								<Self
									entityId={hyperliquidAccount.$agentAccount[EntityMetaKey.Id]}
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
