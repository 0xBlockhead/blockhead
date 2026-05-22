<script lang="ts">
	import type { PageProps } from './$types.ts'

	// Context
	import { resolve } from '$app/paths'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<Page>
	<NostrArticleView
		entityId={data.entityId}
		href={resolve('/(social)/(nostr)/nostr/article/[pubkey]/[identifier]', {
			pubkey: data.entityId.pubkey,
			identifier: encodeURIComponent(data.entityId.identifier),
		})}
	/>
</Page>
