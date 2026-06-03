<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
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
				Source.Local_Internal,
			],
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	bind:open
	{entityId}
	href={href}
	{title}
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
			<strong>Raw calldata</strong>
			is ABI-encoded execution bytes (<code>0x</code>
			prefix; four-byte selector then arguments). Match length and selector to the contract you target before any wallet prompt—human-readable strings are not calldata.
		</p>
	{/snippet}

	{#snippet Content({})}
		<div data-column="gap-1">
			<dl data-column-item="center">
			<div>
				<dt>Calldata</dt>
				<dd>
					<TruncatedValue
						value={entityId.hex}
						format={TruncatedValueFormat.Abbr}
					/>
				</dd>
			</div>

			<div>
				<dt>Payload length</dt>
				<dd>
					{String((entityId.hex.length - 2) / 2)}
					bytes
					<span data-text="muted">
						(nibble-prefixed <code>0x</code>
						hex; leading four bytes are the selector when invoking a contract)
					</span>
				</dd>
			</div>
			{#if open}
				<ResourceBoundary
					placeholderText="Loading calldata…"
					resource={calldata}
				>
					{#snippet children(calldata)}
						<div>
							<dt>Hex</dt>
							<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Visual}
									value={entityId.hex}
								/>
							</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
			</dl>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
	{/snippet}
</EntityView>
