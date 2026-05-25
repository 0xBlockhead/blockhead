<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()


	// (Derived)
	const address = $derived(
		page.params.address ?? '',
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
		<LensAccountView
			entityId={{ address: address as `0x${string}` }}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
