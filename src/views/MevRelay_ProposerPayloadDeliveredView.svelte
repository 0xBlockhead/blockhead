<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Props
	let {
		children,
		entityId,
		href,
		layout,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	const payloadLive = useEntity(
		EntityType.MevRelay_ProposerPayloadDelivered,
		entityId,
		{
			$: [Source.MevRelay_Rest],
			builderPubkey: {},
			value: {},
			blockNumber: {},
			$executionBlock: {},
		},
	)


	const defaultHref = resolve(
		'/(explore)/(networks)/network/[networkId]',
		{ networkId: String(entityId.$network.chainId) },
	)
</script>


<EntityView
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	{entityId}
	href={href ?? defaultHref}
	{layout}
	{open}
	title={`${entityId.relayHost} · slot ${String(entityId.slot)}`}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.slot}
		</span>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.relayHost}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading relay payload…"
			resource={payloadLive}
		>
			{#snippet children(p)}
				<dl>
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

					{#if p.value !== undefined}
						<div>
							<dt>Bid value</dt>
							<dd>
								<NumberValue value={p.value} /> wei
							</dd>
						</div>
					{/if}

					{#if p.builderPubkey !== undefined}
						<div>
							<dt>Builder pubkey</dt>
							<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									startLength={10}
									endLength={8}
									value={p.builderPubkey}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.MevRelay_ProposerPayloadDelivered}
			{entityId}
		/>

		<ResourceBoundary
			resource={payloadLive}
		>
			{#snippet children(p)}
				{#if open}
					{#if p.$executionBlock !== undefined}
						<section>
							<h2>
								Execution block
							</h2>
							<EvmBlockView
								entityId={p.$executionBlock[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
									{
										networkId: String(entityId.$network.chainId),
										blockNumber: String(p.$executionBlock[EntityMetaKey.Id].blockNumber),
									},
								)}
								id={`${String(entityId.$network.chainId)}:${String(p.$executionBlock[EntityMetaKey.Id].blockNumber)}:mev-exec-block`}
								layout={EntityLayout.Summary}
								open={false}
							/>
						</section>
					{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
