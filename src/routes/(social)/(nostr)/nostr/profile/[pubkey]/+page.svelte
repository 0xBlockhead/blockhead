<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'


	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<Page>
	<NostrProfileView
		selection={select(EntityType.NostrProfile, data.selector)}
	/>
</Page>
