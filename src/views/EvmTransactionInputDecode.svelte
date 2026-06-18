<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		input,
		open = false,
	}: {
		input: string
		open?: boolean
	} = $props()

	import {
		decodeCalldataWithSignature,
		formatDecodedParamValue,
	} from '$/lib/calldata-decode.ts'

	import { normalizeEvmSelectorHex } from '$/lib/signature-paths.ts'
	import { select } from '$/routes/+layout.svelte'

	const emptySelectorHex: `0x${string}` = '0x00000000'


	// (Derived)
	const selectorHex = $derived(
		input.startsWith('0x') && input.length >= 10 ?
			normalizeEvmSelectorHex(input)
		:
			null,
	)

	const selector = $derived(select(
		EntityType.EvmSelector,
		(
			selectorHex != null ?
				{ hex: selectorHex }
			:
				{ hex: emptySelectorHex }
		) satisfies EntitySelector<typeof schema, EntityType.EvmSelector>,
		{
			sources: [
				Source.Openchain_Rest,
			],
		},
	))
	const signatures = $derived(selector.signatures)

	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<div data-column="gap-2">
	{#if selectorHex != null}
		<div data-row="wrap gap-2 align-baseline">
			<span data-text="annotation">Selector</span>
			<a
				data-text="font-monospace"
				href={resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
					hex: selectorHex,
				})}
			>
				<TruncatedValue
					value={selectorHex}
					format={TruncatedValueFormat.Abbr}
				/>
			</a>
		</div>

		{#if open}
			<ResourceBoundary
				resource={signatures}
				placeholderText="Loading function signatures…"
			>
				{#snippet children(signatures)}
					{@const decodedCall = signatures
						?.map((signature) => ({
							signature,
							decoded: decodeCalldataWithSignature(signature, input),
						}))
						.find(({ decoded }) => decoded)}
					{#if decodedCall}
						<div data-column="gap-1">
							<code>{decodedCall.signature}</code>
							{#if decodedCall.decoded?.params.length}
								<ul data-text="muted">
									{#each decodedCall.decoded.params as param, index (index)}
										<li>
											{param.type}: {formatDecodedParamValue(param.type, param.value)}
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/if}

	<TruncatedValue
		value={input}
		format={TruncatedValueFormat.Abbr}
	/>
</div>
