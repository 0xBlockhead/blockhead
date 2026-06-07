<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


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

	import { getEvmSelectorPath, normalizeEvmSelectorHex } from '$/lib/signature-paths.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const emptySelectorHex: `0x${string}` = '0x00000000'


	// (Derived)
	const selectorHex = $derived(
		input.startsWith('0x') && input.length >= 10 ?
			normalizeEvmSelectorHex(input)
		:
			null,
	)

	const selector = useEntity(
		EntityType.EvmSelector,
		(
			selectorHex != null ?
				{ hex: selectorHex }
			:
					{ hex: emptySelectorHex }
		) satisfies EntityId<typeof schema, EntityType.EvmSelector>,
		{
			$: [
				Source.Openchain_Rest,
			],
			signatures: {},
		},
	)


	const decodedCall = $derived.by(() => {
		if (!open)
			return null

		const signatures = selector.current?.signatures
		if (!signatures?.length)
			return null

		for (const signature of signatures) {
			const decoded = decodeCalldataWithSignature(signature, input)
			if (decoded)
				return { signature, decoded }
		}

		return null
	})


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
				href={getEvmSelectorPath(selectorHex)}
			>
				<TruncatedValue
					value={selectorHex}
					format={TruncatedValueFormat.Abbr}
				/>
			</a>
		</div>

		{#if open}
			<ResourceBoundary
				resource={selector}
				placeholderText="Loading function signatures…"
			>
				{#snippet children()}
					{#if decodedCall}
						<div data-column="gap-1">
							<code>{decodedCall.signature}</code>
							{#if decodedCall.decoded.params.length}
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
