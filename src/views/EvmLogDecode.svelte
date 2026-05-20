<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		topics,
		data,
		emitterContractId,
		open = false,
	}: {
		topics: string[]
		data?: string
		emitterContractId?: EntityId<typeof schema, EntityType.EvmContract>
		open?: boolean
	} = $props()


	// Functions
	import {
		decodeLogWithContractAbiJson,
		decodeLogWithSignature,
		formatDecodedParamValue,
	} from '$/lib/calldata-decode.ts'
	import { getEvmTopicPath, normalizeEvmTopicHex } from '$/lib/signature-paths.ts'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	const topic0Hex = $derived(
		topics[0]?.startsWith('0x') ?
			normalizeEvmTopicHex(topics[0] as `0x${string}`)
		:
			null,
	)

	const topicEntityId = $derived(
		(
			topic0Hex != null ?
				{ hex: topic0Hex }
			:
				{ hex: `0x${'0'.repeat(64)}` }
		) satisfies EntityId<typeof schema, EntityType.EvmTopic>,
	)

	const topic = useEntity(
		EntityType.EvmTopic,
		topicEntityId,
		{
			$: [
				Source.Openchain_Rest,
			],
			signatures: {},
		},
	)

	const emitterContract = useEntity(
		EntityType.EvmContract,
		emitterContractId ?? {
			$network: { chainId: 0 },
			address: '0x0000000000000000000000000000000000000000',
		},
		{
			$: (
				open && emitterContractId ?
					[
						Source.Sourcify_Rest,
						Source.Etherscan_Rest,
					]
				:
					[]
			),
			...(open && emitterContractId && {
				abi: {},
			}),
		},
	)


	// (Derived)
	const decodedLog = $derived.by(() => {
		if (!open || topic0Hex == null || data == null) return null
		for (const signature of topic.current.signatures ?? []) {
			const decoded = decodeLogWithSignature(signature, topics, data)
			if (decoded) return { signature, decoded, source: 'catalog' as const }
		}
		const abiJson = emitterContract.current.abi
		if (abiJson != null && abiJson !== '') {
			const fromAbi = decodeLogWithContractAbiJson(abiJson, topics, data)
			if (fromAbi) return { ...fromAbi, source: 'contract-abi' as const }
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
				href={resolve(getEvmTopicPath(topic0Hex))}
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
				{#snippet children(_topicEntity)}
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
