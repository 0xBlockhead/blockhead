<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	import { calldataExamples, type CalldataExample } from '$/constants/calldata-examples.ts'
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
	import Select from '$/components/Select.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import CalldataSignatureResult, { CalldataSignatureKind } from './CalldataSignatureResult.svelte'


	const hexFromParam = (value: string | null) => {
		if (!value) return ''

		const digits = value.trim().replace(/^0x/i, '').replace(/\s/g, '')
		if (!/^[0-9a-fA-F]*$/.test(digits)) return ''

		const evenDigits = digits.length % 2 === 0 ? digits : digits.slice(0, -1)
		return evenDigits ? `0x${evenDigits}` : ''
	}

	const IDLE_SELECTOR_HEX: `0x${string}` = '0xffffffff'

	const IDLE_TOPIC_HEX = ZeroExHex.assert(`0x${'f'.repeat(64)}`)

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
												{normalizedSelector}
											</a>
										</Heading>
									{/snippet}

									{#snippet Value()}
										<span data-text="muted">Selector: {selector}</span>
									{/snippet}

									{#snippet Content()}
										<CalldataSignatureResult
											hex={ZeroExHex.assert(hexWithPrefix)}
											kind={CalldataSignatureKind.Function}
											resource={selectorEntity.signatures}
											bind:selectedSignatureIndex
										>
											{#snippet Address(address)}
												<EvmAccountView
													selection={select(EntityType.EvmAccount, { address: EvmAddress.assert(address) })}
													layout={EntityLayout.Value}
												/>
											{/snippet}
										</CalldataSignatureResult>
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
												{normalizedTopic}
											</a>
										</Heading>
									{/snippet}

									{#snippet Value()}
										<span data-text="muted">Topic: {topic}</span>
									{/snippet}

									{#snippet Content()}
										<CalldataSignatureResult
											hex={ZeroExHex.assert(hexWithPrefix)}
											kind={CalldataSignatureKind.Event}
											resource={topicEntity.signatures}
											bind:selectedSignatureIndex={selectedEventSignatureIndex}
										>
											{#snippet Address(address)}
												<EvmAccountView
													selection={select(EntityType.EvmAccount, { address: EvmAddress.assert(address) })}
													layout={EntityLayout.Value}
												/>
											{/snippet}
										</CalldataSignatureResult>
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

</style>
