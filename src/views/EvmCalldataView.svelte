<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/(evm)/evm/(calldata)/calldata/[hex]',
			{ hex: entityId.hex },
		),
		title = 'Calldata',
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmCalldata>
			href?: string
			title?: string
			open?: boolean
		},
		never
	> = $props()

	const calldata = useEntity(
		EntityType.EvmCalldata,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
			],
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	{entityId}
	href={href}
	{title}
	idDragPlainText={stringify(entityId)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.hex}
		</span>
	{/snippet}

	{#snippet Title()}
		{#if Value}
		{@render Value()}
					{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Calldata is the opaque byte blob included with a call: its opening bytes pick the function schema, followed by ABI-packed arguments.
		</p>
		<p>
			Revert data and indexed events reuse similar hashing ideas but with different widths and meanings.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			placeholderText="Loading calldata…"
			resource={calldata}
		>
			{#snippet children(calldata)}
				<div data-column="gap-1">
				<dl data-column-item="center">
					<div>
						<dt>Contract call data length</dt>
						<dd>{String((entityId.hex.length - 2) / 2)} bytes</dd>
					</div>
					{#if open}
						<div>
							<dt>Call/input data (<code>msg.data</code>)</dt>
							<dd>
								<TruncatedValue
									value={entityId.hex}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
				</dl>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
