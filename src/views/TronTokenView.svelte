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
			entityId: EntityId<typeof schema, EntityType.TronToken>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const token = useEntity(
		EntityType.TronToken,
		entityId,
		{
			standard: {},
			name: {},
			symbol: {},
			decimals: {},
			totalSupply: {},
			...open && {
				createdTimestampMs: {},
				holderCount: {},
			},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronToken}
	{entityId}
	title={entityId.tokenId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<ResourceBoundary resource={token}>
			{#snippet children(token)}
				{token.symbol ?? token.name ?? entityId.tokenId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={token}
			placeholderText="Loading TRON token..."
		>
			{#snippet children(token)}
				<dl data-column-item="center">
					{#if token.standard != null}
						<div>
							<dt>Standard</dt>
							<dd>{token.standard}</dd>
						</div>
					{/if}

					{#if token.name != null}
						<div>
							<dt>Name</dt>
							<dd>{token.name}</dd>
						</div>
					{/if}

					{#if token.symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>{token.symbol}</dd>
						</div>
					{/if}

					{#if token.decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd><NumberValue value={token.decimals} /></dd>
						</div>
					{/if}

					{#if token.totalSupply != null}
						<div>
							<dt>Total supply</dt>
							<dd><NumberValue value={token.totalSupply} /></dd>
						</div>
					{/if}

					{#if open && token.createdTimestampMs != null}
						<div>
							<dt>Created</dt>
							<dd><Timestamp timestamp={token.createdTimestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
