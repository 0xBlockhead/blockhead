<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotBlock}
	entitySelector={selection.entitySelector}
	href={
		'caip2' in selection.entitySelector.$network ?
			`/network/${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}/blocks/${selection.entitySelector.blockNumber.toString()}`
		:
			`/network/${selection.entitySelector.$network.slug}/blocks/${selection.entitySelector.blockNumber.toString()}`
	}
	title={`Block #${selection.entitySelector.blockNumber.toString()}`}
	idDragPlainText={selection.entitySelector.blockNumber.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.blockNumber.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Polkadot blocks contain Substrate extrinsics and emitted events under the relay-chain runtime.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ sources: [
							Source.SubstrateSidecar_Rest,
						], fields: { hash: true, $$extrinsics: true, $$events: true, ...(open && ({ $parent: true, stateRoot: true, extrinsicsRoot: true })) } }),
				)}
			placeholderText="Loading Polkadot block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if ('hash' in selection.entitySelector && selection.entitySelector.hash != null) || block.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={'hash' in selection.entitySelector ? selection.entitySelector.hash : block.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

						{#if (block.$$extrinsics?.values.length ?? 0) > 0}
							<div>
								<dt>Extrinsics</dt>
								<dd><NumberValue value={block.$$extrinsics?.values.length ?? 0} /></dd>
							</div>
						{/if}

						{#if (block.$$events?.values.length ?? 0) > 0}
							<div>
								<dt>Events</dt>
								<dd><NumberValue value={block.$$events?.values.length ?? 0} /></dd>
							</div>
						{/if}

					{#if open && block.$parent != null}
						<div>
							<dt>Parent</dt>
							<dd>
								Block #{block.$parent[EntityMetaKey.Selector].blockNumber.toString()}
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
