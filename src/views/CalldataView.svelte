<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
		'/(explore)/(evm)/evm/(calldata)/calldata/[hex]',
		{ hex: selector.hex },
		),
		title = 'Calldata',
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmCalldata>
			href?: string
			title?: string
			open?: boolean
		},
		never
	> = $props()

	const calldata = subscribe(EntityType.EvmCalldata,
		selector,
		{
			sources: [
				Source.Local_Internal,
			],
			fields: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	bind:open
	entitySelector={selector}
	href={href}
	{title}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selector.hex}
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
						value={selector.hex}
						format={TruncatedValueFormat.Abbr}
					/>
				</dd>
			</div>

			<div>
				<dt>Payload length</dt>
				<dd>
					{String((selector.hex.length - 2) / 2)}
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
									value={selector.hex}
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
