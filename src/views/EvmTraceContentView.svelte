<script lang="ts">
	// Types/constants
	import type { EvmTraceTree } from '$/schema/EvmTrace.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'


	// Props
	let {
		trace,
		chainId,
	}: {
		trace: EvmTraceTree
		chainId: number
	} = $props()


	// Context
	import { resolve } from '$app/paths'


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmTraceSelectorSignatures from '$/views/EvmTraceSelectorSignatures.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<div data-row="wrap align-center">
	{#if trace.type}
		<code>{trace.type.toUpperCase()}</code>
	{/if}

	<span>#{trace.index}</span>

	{#if trace.error}
		<span data-tag="failure">⚠ {trace.error}</span>
	{/if}
</div>

<dl>
	{#if trace.from}
		<div>
			<dt>From</dt>
			<dd>
				<ActorNetworkView
					entityId={{
						$network: { chainId },
						$actor: { address: trace.from },
					}}
					href={resolve(
						'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
						{
							networkId: String(chainId),
							address: trace.from,
						},
					)}
					layout={EntityLayout.Title}
					open={false}
					showTypeAnnotation={false}
				/>
			</dd>
		</div>
	{/if}

	{#if trace.to}
		<div>
			<dt>To</dt>
			<dd>
				<ActorNetworkView
					entityId={{
						$network: { chainId },
						$actor: { address: trace.to },
					}}
					href={resolve(
						'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
						{
							networkId: String(chainId),
							address: trace.to,
						},
					)}
					layout={EntityLayout.Title}
					open={false}
					showTypeAnnotation={false}
				/>
			</dd>
		</div>
	{/if}

	{#if trace.value && trace.value !== '0x0' && trace.value !== '0x'}
		<div>
			<dt>Value</dt>
			<dd>
				<NumberValue
					value={BigInt(trace.value)}
				/> wei
			</dd>
		</div>
	{/if}

	{#if trace.gas !== undefined}
		<div>
			<dt>Gas</dt>
			<dd>
				<NumberValue value={trace.gas} />
			</dd>
		</div>
	{/if}

	{#if trace.gasUsed !== undefined}
		<div>
			<dt>Gas used</dt>
			<dd>
				<NumberValue value={trace.gasUsed} />
			</dd>
		</div>
	{/if}

	{#if trace.input && trace.input !== '0x'}
		<div>
			<dt>Input</dt>
			<dd>
				{#if trace.input.length >= 10}
					<EvmTraceSelectorSignatures
						selectorHex={`0x${trace.input.slice(2, 10).toLowerCase()}`}
					/>
				{/if}

				<TruncatedValue
					value={trace.input}
					format={TruncatedValueFormat.Abbr}
				/>
				<span>({String(Math.max(0, (trace.input.length - 2) / 2))} bytes)</span>
			</dd>
		</div>
	{/if}

	{#if trace.output && trace.output !== '0x'}
		<div>
			<dt>Output</dt>
			<dd>
				<TruncatedValue
					value={trace.output}
					format={TruncatedValueFormat.Abbr}
				/>
			</dd>
		</div>
	{/if}
</dl>
