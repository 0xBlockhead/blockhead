<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/$EntityType.ts'

	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
</script>


<Page>
	<NostrArticlesView
		entityFieldReference={{
			entityType: EntityType.NostrProfile,
			entityId: data.entityId,
			fieldName: '$$articles',
		}}
		id="nostr-profile-articles"
	/>
</Page>
