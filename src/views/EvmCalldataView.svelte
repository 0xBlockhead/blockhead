<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
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

	// Components
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	entitySelector={selector}
	href={href}
	{title}
	idDragPlainText={stringify(selector)}
	bind:open
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
			Calldata is the opaque byte blob included with a call: its opening bytes pick the function schema, followed by ABI-packed arguments.
		</p>
		<p>
			Revert data and indexed events reuse similar hashing ideas but with different widths and meanings.
		</p>
	{/snippet}

	{#snippet Content({})}
		<div data-column="gap-1">
			<dl data-column-item="center">
				<div>
					<dt>Contract call data length</dt>
						<dd>{String((selector.hex.length - 2) / 2)} bytes</dd>
					</div>
					{#if open}
						<div>
							<dt>Call/input data (<code>msg.data</code>)</dt>
							<dd>
								<TruncatedValue
									value={selector.hex}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
				</dl>
		</div>
	{/snippet}
</EntityView>
