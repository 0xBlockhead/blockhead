<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const pubkey = $derived(
		page.params.pubkey ?? '',
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection={select(EntityType.NostrProfile, { pubkey })}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
