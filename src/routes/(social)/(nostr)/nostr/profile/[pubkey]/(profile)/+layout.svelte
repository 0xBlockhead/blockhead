<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()

	const pubkey = $derived(
		page.params.pubkey ?? '',
	)


	// Components
	import NostrProfileView from '$/views/NostrProfileView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(nostr)/nostr/profile/[pubkey]', {
		pubkey,
	})}
	id={pubkey}
>
	{#snippet Summary({ open: _open })}
		<NostrProfileView
			entityId={{ pubkey }}
			href={resolve('/(social)/(nostr)/nostr/profile/[pubkey]', {
				pubkey,
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
