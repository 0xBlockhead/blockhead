<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.HyperliquidAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const hyperliquidAccount = useEntity(
		EntityType.HyperliquidAccount,
		entityId,
		{
			accountRole: {},
			masterAddress: {},
			agentAddress: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
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

					{#if hyperliquidAccount.masterAddress != null}
						<div>
							<dt>Master Address</dt>
							<dd>
								<TruncatedValue
									value={hyperliquidAccount.masterAddress}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if hyperliquidAccount.agentAddress != null}
						<div>
							<dt>Agent Address</dt>
							<dd>
								<TruncatedValue
									value={hyperliquidAccount.agentAddress}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
