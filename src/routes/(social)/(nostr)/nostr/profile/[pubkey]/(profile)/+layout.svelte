<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const pubkey = $derived(
		page.params.pubkey ?? '',
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(nostr)/nostr/profile/[pubkey]', {
		pubkey: pubkey,
	})}
	id={pubkey}
>
	{#snippet Summary({ open: _open })}
		<NostrProfileView
			selection={
				select(
					EntityType.NostrProfile,
					{
						pubkey: pubkey,
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
