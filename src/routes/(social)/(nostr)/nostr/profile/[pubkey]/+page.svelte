<script lang="ts">
	import type { PageProps } from './$types.ts'

	// Context
	import { resolve } from '$app/paths'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<Page>
	<NostrProfileView
		entityId={data.entityId}
		href={resolve('/(social)/(nostr)/nostr/profile/[pubkey]', {
			pubkey: data.entityId.pubkey,
		})}
	/>
</Page>
