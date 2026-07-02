<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<svelte:head>
	<title>Nostr profile • Blockhead</title>
</svelte:head>


<Page>
	<NostrProfileView
		href={
			resolve('/(social)/(nostr)/nostr/profile/[pubkey]', {
				pubkey: params.pubkey,
			})
		}
		selection={
			select(EntityType.NostrProfile, data.selector, {
				fields: {
					$icon: true,
					displayName: true,
					about: true,
					nip05: true,
					website: true,
					metadataUpdatedAt: true,
				},
			})
		}
	/>
</Page>
