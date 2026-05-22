<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const address = $derived(
		page.params.address ?? '',
	)


	// Components
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
		<LensAccountView
			entityId={{ address: address as `0x${string}` }}
			href={resolve('/(social)/(lens)/lens/account/[address]', {
				address: encodeURIComponent(address),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
