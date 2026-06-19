<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
		'/(explore)/(evm)/evm/(calldata)/calldata/[hex]',
		{ hex: selection.entitySelector.hex },
		),
		title = 'Calldata',
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmCalldata>
			href?: string
			title?: string
			open?: boolean
		},
		never
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	bind:open
	entitySelector={selection.entitySelector}
	href={href}
	{title}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.hex}
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
			prefix; four-byte selection.entitySelector then arguments). Match length and selection.entitySelector to the contract you target before any wallet prompt—human-readable strings are not calldata.
		</p>
	{/snippet}

	{#snippet Content({})}
		<div data-column="gap-1">
			<dl data-column-item="center">
			<div>
				<dt>Calldata</dt>
				<dd>
					<TruncatedValue
						value={selection.entitySelector.hex}
						format={TruncatedValueFormat.Abbr}
					/>
				</dd>
			</div>

			<div>
				<dt>Payload length</dt>
				<dd>
					{String((selection.entitySelector.hex.length - 2) / 2)}
					bytes
					<span data-text="muted">
						(nibble-prefixed <code>0x</code>
						hex; leading four bytes are the selection.entitySelector when invoking a contract)
					</span>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Hex</dt>
					<dd>
						<TruncatedValue
							format={TruncatedValueFormat.Visual}
							value={selection.entitySelector.hex}
						/>
					</dd>
				</div>
			{/if}
			</dl>
		</div>
	{/snippet}
</EntityView>
