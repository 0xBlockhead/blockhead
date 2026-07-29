<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { calldataExamples, type CalldataExample } from '$/constants/calldata-examples.ts'
	import { decodeCalldataWithSignature, decodeEventDataWithSignature, formatDecodedParamValue } from '$/lib/calldata-decode.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'
	import { normalizeEvmSelectorHex, normalizeEvmTopicHex } from '$/lib/signature-paths.ts'
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/state'
	import { untrack } from 'svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import Icon from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Select from '$/components/Select.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	const hexFromParam = (value: string | null) => {
		if (!value) return ''

		const digits = value.trim().replace(/^0x/i, '').replace(/\s/g, '')
		if (!/^[0-9a-fA-F]*$/.test(digits)) return ''

		const evenDigits = digits.length % 2 === 0 ? digits : digits.slice(0, -1)
		return evenDigits ? `0x${evenDigits}` : ''
	}

	const EMPTY_SIGNATURES: readonly string[] = []

	const IDLE_SELECTOR_HEX: `0x${string}` = '0xffffffff'

	const IDLE_TOPIC_HEX = ZeroExHex.assert(`0x${'f'.repeat(64)}`)

	const TRUNCATE_PARAM_LENGTH = 28

	let inputRaw = $state(
		hexFromParam(page.url.searchParams.get('data')),
	)

	let selectedExample = $state<CalldataExample | undefined>(undefined)

	let selectedSignatureIndex = $state(0)

	let selectedEventSignatureIndex = $state(0)

	afterNavigate(({ to }) => {
		if (!to) return

		const nextData = hexFromParam(to.url.searchParams.get('data'))
		if (nextData === inputRaw) return

		inputRaw = nextData
	})

	$effect(() => {
		const hex = hexNormalized.length > 0 ? `0x${hexNormalized}` : ''
		const currentData = untrack(() =>
			hexFromParam(page.url.searchParams.get('data')),
		)
		if (hex === currentData) return

		globalThis.history.replaceState(
			globalThis.history.state,
			'',
			resolve('/evm/calldata-decoder') + (hex ? `?data=${encodeURIComponent(hex)}` : ''),
		)
	})

	$effect(() => {
		const example = selectedExample
		if (!example) return

		inputRaw = example.hex
		selectedExample = undefined
	})

	const hexWithPrefix = $derived(
		inputRaw.startsWith('0x') ?
			inputRaw
		:
			inputRaw ?
				`0x${inputRaw}`
			:
				'',
	)

	const hexNormalized = $derived(
		hexWithPrefix.slice(2).toLowerCase(),
	)

	const selector = $derived(
		hexNormalized.length >= 8 ?
			ZeroExHex.assert(`0x${hexNormalized.slice(0, 8).toLowerCase()}`)
		:
			null,
	)

	const topic = $derived(
		hexNormalized.length >= 64 ?
			ZeroExHex.assert(`0x${hexNormalized.slice(0, 64).toLowerCase()}`)
		:
			null,
	)

	const normalizedSelector = $derived(
		selector ? normalizeEvmSelectorHex(selector) : null,
	)

	const normalizedTopic = $derived(
		topic ? normalizeEvmTopicHex(topic) : null,
	)

	const selectorEntity = $derived(select(
		EntityType.EvmSelector,
		selector ?
			{ hex: normalizedSelector ?? selector }
		:
			{ hex: IDLE_SELECTOR_HEX },
		{
			sources: [Source.Openchain_Rest],
			fields: { signatures: true },
		},
	))

	const topicEntity = $derived(select(
		EntityType.EvmTopic,
		topic ?
			{ hex: normalizedTopic ?? topic }
		:
			{ hex: IDLE_TOPIC_HEX },
		{
			sources: [Source.Openchain_Rest],
			fields: { signatures: true },
		},
	))

	const functionSignatures = $derived(
		selector ?
			selectorEntity.signatures.current?.values.map(String) ?? EMPTY_SIGNATURES
		:
			EMPTY_SIGNATURES,
	)

	const eventSignatures = $derived(
		topic ?
			topicEntity.signatures.current?.values.map(String) ?? EMPTY_SIGNATURES
		:
			EMPTY_SIGNATURES,
	)

	const signatureForDecode = $derived(
		functionSignatures.length > 0 ?
			functionSignatures[Math.min(selectedSignatureIndex, functionSignatures.length - 1)]
		:
			null,
	)

	const decodedCall = $derived(
		hexWithPrefix && selector && signatureForDecode ?
			decodeCalldataWithSignature(
				signatureForDecode,
				ZeroExHex.assert(hexWithPrefix),
			)
		:
			null,
	)

	const eventSignatureForDecode = $derived(
		eventSignatures.length > 0 ?
			eventSignatures[Math.min(selectedEventSignatureIndex, eventSignatures.length - 1)]
		:
			null,
	)

	const decodedEvent = $derived(
		hexWithPrefix && hexNormalized.length >= 64 && eventSignatureForDecode ?
			decodeEventDataWithSignature(
				eventSignatureForDecode,
				ZeroExHex.assert(hexWithPrefix),
			)
		:
			null,
	)


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Calldata decoder • Blockhead</title>
</svelte:head>


<Page>
	<section
		class="calldata-decoder"
		data-column
	>
		<header data-column="gap-1">
			<Heading>Calldata decoder</Heading>
			<p>
				Paste transaction input or event data hex to resolve the function selector or event topic.
			</p>
		</header>

		<form
			class="calldata-decoder-form"
			data-card
			data-column
		>
			<Select
				items={[...calldataExamples]}
				bind:value={
					() => selectedExample,
					(_value) => {
						selectedExample = _value
					}
				}
				allowDeselect={true}
				getItemId={(example) => example.id}
				getItemLabel={(example) => example.label}
				placeholder="Load example..."
				ariaLabel="Load example calldata"
			/>

			<label
				class="calldata-decoder-field"
				data-column
			>
				<span>Calldata (hex)</span>
				<textarea
					bind:value={inputRaw}
					placeholder="0xa9059cbb000000000000000000000000..."
					rows={4}
					spellcheck={false}
					autocapitalize="off"
					autocomplete="off"
				></textarea>
			</label>
		</form>

		{#if hexWithPrefix}
			<Collapsible>
				{#snippet Summary()}
					<Heading>Result</Heading>
				{/snippet}

				{#snippet children()}
					<ul
						class="calldata-result"
						data-column="gap-4"
					>
						{#if selector && normalizedSelector}
							<li>
								<EntityView
									entityType={EntityType.EvmSelector}
									entitySelector={{ hex: normalizedSelector }}
									href={
										resolve(
											'/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]',
											{
												hex: normalizedSelector,
											}
										)
									}
								>
									{#snippet Icon()}
										<Icon
											icon="🔖"
											label="EVM selector"
											size="1.75rem"
										/>
									{/snippet}

									{#snippet Title()}
										<ResourceBoundary
											resource={selectorEntity}
											placeholderText="Loading function signature..."
										>
											{#snippet children()}
												<Heading>
													<a
														href={
															resolve(
																'/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]',
																{
																	hex: normalizedSelector,
																}
															)
														}
													>
														{functionSignatures[selectedSignatureIndex] ?? normalizedSelector}
													</a>
												</Heading>
											{/snippet}
										</ResourceBoundary>
									{/snippet}

									{#snippet Value()}
										<span data-text="muted">Selector: {selector}</span>
									{/snippet}

									{#snippet Content()}
										{#if functionSignatures.length > 0}
											<dl data-definition-list="vertical">
												<div>
													<dt>Signature</dt>
													<dd>
														{#if functionSignatures.length > 1}
															<select
																bind:value={selectedSignatureIndex}
																aria-label="Choose function signature"
																class="calldata-result-select"
															>
																{#each functionSignatures as signature, index (signature)}
																	<option value={index}>{signature}</option>
																{/each}
															</select>
														{:else}
															<code>{functionSignatures[0]}</code>
														{/if}
													</dd>
												</div>

												{#if decodedCall}
													<div>
														<dt>Arguments</dt>
														<dd>
															<ol class="calldata-result-args">
																{#each decodedCall.params as param, index (`${index}:${param.type}`)}
																	<div class="calldata-result-arg">
																		<li>
																			<span>{index}</span>
																			{#if param.type === 'address' && typeof param.value === 'string'}
																				<EvmAccountView
																					selection={select(EntityType.EvmAccount, { address: EvmAddress.assert(param.value) })}
																					layout={EntityLayout.Value}
																				/>
																			{:else}
																				{@const decodedValue = formatDecodedParamValue(param.type, param.value)}

																				{#if decodedValue.length > TRUNCATE_PARAM_LENGTH}
																					<TruncatedValue
																						value={decodedValue}
																						startLength={10}
																						endLength={8}
																					/>
																				{:else}
																					<span class="calldata-result-arg-value">{decodedValue}</span>
																				{/if}
																			{/if}
																		</li>
																	</div>
																{/each}
															</ol>
														</dd>
													</div>
												{/if}
											</dl>
										{/if}
									{/snippet}
								</EntityView>
							</li>
						{/if}

						{#if topic && normalizedTopic}
							<li>
								<EntityView
									entityType={EntityType.EvmTopic}
									entitySelector={{ hex: normalizedTopic }}
									href={
										resolve(
											'/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]',
											{
												hex: normalizedTopic,
											}
										)
									}
								>
									{#snippet Icon()}
										<Icon
											icon="📋"
											label="EVM topic"
											size="1.75rem"
										/>
									{/snippet}

									{#snippet Title()}
										<ResourceBoundary
											resource={topicEntity}
											placeholderText="Loading event signature..."
										>
											{#snippet children()}
												<Heading>
													<a
														href={
															resolve(
																'/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]',
																{
																	hex: normalizedTopic,
																}
															)
														}
													>
														{eventSignatures[selectedEventSignatureIndex] ?? normalizedTopic}
													</a>
												</Heading>
											{/snippet}
										</ResourceBoundary>
									{/snippet}

									{#snippet Value()}
										<span data-text="muted">Topic: {topic}</span>
									{/snippet}

									{#snippet Content()}
										{#if eventSignatures.length > 0}
											<dl data-definition-list="vertical">
												<div>
													<dt>Signature</dt>
													<dd>
														{#if eventSignatures.length > 1}
															<select
																bind:value={selectedEventSignatureIndex}
																aria-label="Choose event signature"
																class="calldata-result-select"
															>
																{#each eventSignatures as signature, index (signature)}
																	<option value={index}>{signature}</option>
																{/each}
															</select>
														{:else}
															<code>{eventSignatures[0]}</code>
														{/if}
													</dd>
												</div>

												{#if decodedEvent}
													<div>
														<dt>Arguments</dt>
														<dd>
															<ol class="calldata-result-args">
																{#each decodedEvent.params as param, index (`${index}:${param.type}`)}
																	<div class="calldata-result-arg">
																		<li>
																			<span>{index}</span>
																			{#if param.type === 'address' && typeof param.value === 'string'}
																				<EvmAccountView
																					selection={select(EntityType.EvmAccount, { address: EvmAddress.assert(param.value) })}
																					layout={EntityLayout.Value}
																				/>
																			{:else}
																				{@const decodedValue = formatDecodedParamValue(param.type, param.value)}

																				{#if decodedValue.length > TRUNCATE_PARAM_LENGTH}
																					<TruncatedValue
																						value={decodedValue}
																						startLength={10}
																						endLength={8}
																					/>
																				{:else}
																					<span class="calldata-result-arg-value">{decodedValue}</span>
																				{/if}
																			{/if}
																		</li>
																	</div>
																{/each}
															</ol>
														</dd>
													</div>
												{/if}
											</dl>
										{/if}
									{/snippet}
								</EntityView>
							</li>
						{/if}

						<li>
							<dl data-definition-list="vertical">
								<div>
									<dt>Bytes</dt>
									<dd>{hexNormalized ? Math.floor(hexNormalized.length / 2) : 0}</dd>
								</div>
							</dl>
						</li>
					</ul>
				{/snippet}
			</Collapsible>
		{:else if inputRaw.trim().length > 0}
			<p>
				Enter valid hex. Odd-length input is trimmed to even length.
			</p>
		{/if}
	</section>
</Page>


<style>
	.calldata-decoder {
		gap: 1rem;
	}

	.calldata-decoder-form {
		gap: 1rem;
		padding: 1rem;
	}

	.calldata-decoder-field {
		gap: 0.5rem;
	}

	.calldata-decoder-field textarea {
		font-family: var(--fontFamily-monospace);
		min-block-size: 6rem;
	}

	.calldata-result {
		list-style: none;
		padding-inline-start: 0;
	}

	.calldata-result-select {
		font-family: var(--fontFamily-monospace);
		max-width: 100%;
	}

	.calldata-result-args {
		margin: 0;
	}

	.calldata-result-arg dt {
		font-family: var(--fontFamily-monospace);
		min-inline-size: 1.5em;
	}

	.calldata-result-arg-value {
		font-family: var(--fontFamily-monospace);
		word-break: break-all;
	}
</style>
