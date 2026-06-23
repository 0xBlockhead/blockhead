<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalActivityPubNetwork_TimestampView from '$/views/_GlobalActivityPubNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalActivityPubNetwork_TimestampView
		selection={select(EntityType._GlobalActivityPubNetwork_Timestamp, data.selector)}
	/>
</Page>
