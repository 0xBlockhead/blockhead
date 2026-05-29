<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.PolkadotBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const block = useEntity(
		EntityType.PolkadotBlock,
		entityId,
		{
			$: [
				Source.SubstrateSidecar_Rest,
			],
			hash: {},
			$$extrinsics: {},
			$$events: {},
			...open && {
				$parent: {},
				stateRoot: {},
				extrinsicsRoot: {},
			},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotBlock}
	{entityId}
	title={`Block #${entityId.blockNumber.toString()}`}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Block #{entityId.blockNumber.toString()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Polkadot blocks contain Substrate extrinsics and emitted events under the relay-chain runtime.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={block}
			placeholderText="Loading Polkadot block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if entityId.hash != null || block.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={entityId.hash ?? block.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.$$extrinsics.length > 0}
						<div>
							<dt>Extrinsics</dt>
							<dd><NumberValue value={block.$$extrinsics.length} /></dd>
						</div>
					{/if}

					{#if block.$$events.length > 0}
						<div>
							<dt>Events</dt>
							<dd><NumberValue value={block.$$events.length} /></dd>
						</div>
					{/if}

					{#if open && block.$parent != null}
						<div>
							<dt>Parent</dt>
							<dd>
								Block #{block.$parent[EntityMetaKey.Id].blockNumber.toString()}
							</dd>
						</div>
					{/if}

					{#if open && block.stateRoot != null}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue
									value={block.stateRoot}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && block.extrinsicsRoot != null}
						<div>
							<dt>Extrinsics root</dt>
							<dd>
								<TruncatedValue
									value={block.extrinsicsRoot}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
