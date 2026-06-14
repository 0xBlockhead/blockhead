<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		topics,
		data,
		emitterContractId,
		open = false,
	}: {
		topics: string[]
		data?: string
		emitterContractId?: EntitySelector<typeof schema, EntityType.EvmContract>
		open?: boolean
	} = $props()

	import {
		decodeLogWithContractAbi,
		decodeLogWithSignature,
		formatDecodedParamValue,
	} from '$/lib/calldata-decode.ts'

	import { getEvmTopicPath, normalizeEvmTopicHex } from '$/lib/signature-paths.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	const emptyTopicHex: `0x${string}` = '0x0000000000000000000000000000000000000000000000000000000000000000'


	// (Derived)
	const topic0Hex = $derived(
		topics[0]?.startsWith('0x') ?
			normalizeEvmTopicHex(topics[0] as `0x${string}`)
		:
			null,
	)

	const topic = subscribe(EntityType.EvmTopic,
		(
			topic0Hex != null ?
				{ hex: topic0Hex }
			:
					{ hex: emptyTopicHex }
		) satisfies EntitySelector<typeof schema, EntityType.EvmTopic>,
		({ sources: [
				Source.Openchain_Rest,
			], fields: { signatures: true } }),
	)

	const emitterContract = subscribe(EntityType.EvmContract,
		emitterContractId ?? {
			$network: { caip2: { namespace: 'eip155' as const, reference: String(0) } },
			address: '0x0000000000000000000000000000000000000000',
		},
		({ sources: (
				open && emitterContractId ?
					[
						Source.Sourcify_Rest,
						Source.Etherscan_Rest,
					]
				:
					[]
			), fields: { ...(open && emitterContractId && ({ abi: true })) } }),
	)


	const decodedLog = $derived.by(() => {
		if (!open || topic0Hex == null || data == null)
			return null

		for (const signature of topic.current?.fields.signatures ?? []) {
			const decoded = decodeLogWithSignature(signature, topics, data)
			if (decoded)
				return { signature, decoded, source: 'catalog' as const }
		}

		const abi = emitterContract.current?.fields.abi
		if (abi?.length) {
			const fromAbi = decodeLogWithContractAbi(abi, topics, data)
			if (fromAbi)
				return { ...fromAbi, source: 'contract-abi' as const }
		}

		return null
	})


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


{#if topic0Hex != null}
	<div data-column="gap-2">
		<div data-row="wrap gap-2 align-baseline">
			<span data-text="annotation">Topic 0</span>
			<a
				data-text="font-monospace"
				href={getEvmTopicPath(topic0Hex)}
			>
				<TruncatedValue
					value={topic0Hex}
					format={TruncatedValueFormat.Abbr}
				/>
			</a>
		</div>

		{#if open}
			<ResourceBoundary
				resource={topic}
				placeholderText="Loading log topic signatures…"
			>
				{#snippet children()}
					{#if decodedLog}
						<div data-column="gap-1">
							<span data-text="annotation">
								{decodedLog.source === 'contract-abi' ?
									'Decoded from emitter ABI'
								:
									'Decoded from topic catalog'}
							</span>
							<code>{decodedLog.signature}</code>
							{#if decodedLog.decoded.params.length}
								<ul data-text="muted">
									{#each decodedLog.decoded.params as param, index (index)}
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
	</div>
{/if}
