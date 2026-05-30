<script lang="ts">
	// Types/constants
	import { type as arktype } from 'arktype'
	import { EvmAddress } from '$/schema/$ZeroExHex.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()


	const address = $derived(
		page.params.address ?? '',
	)
	const entityId = $derived(
		((parsedAddress) => (
			parsedAddress instanceof arktype.errors ?
				undefined
			:
				{ address: parsedAddress }
		))(EvmAddress(address)),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(lens)/lens/account/[address]', {
		address: encodeURIComponent(address),
	})}
	id={address}
>
	{#snippet Summary({ open: _open })}
		{#if entityId}
			<LensAccountView
				{entityId}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
