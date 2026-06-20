<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const address = $derived(
		page.params.address ?? '',
	)
	const selector = $derived.by(() => {
		const raw = decodeURIComponent(address)
		if (raw.startsWith('legacy:'))
			return { legacyProfileId: raw.slice('legacy:'.length) }

		const with0x = raw.startsWith('0x') ? raw : `0x${raw}`
		const parsedAddress = (
			hexLowerOfByteSize(with0x, 20)
			?? (
				/^0x[a-fA-F0-9]{40}$/i.test(with0x) ?
					hexLowerOfByteSize(`0x${with0x.slice(2).toLowerCase()}`, 20)
				:
					undefined
			)
		)
		return parsedAddress === undefined ?
			{ localName: raw.replace(/^@/, '') }
		:
			{ address: parsedAddress }
	})


	// Functions
	import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(lens)/lens/account/[address=evmAddress]', {
		address: encodeURIComponent(address),
	})}
	id={address}
>
	{#snippet Summary({ open: _open })}
		<LensAccountView
			selection={select(EntityType.LensAccount, selector)}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
