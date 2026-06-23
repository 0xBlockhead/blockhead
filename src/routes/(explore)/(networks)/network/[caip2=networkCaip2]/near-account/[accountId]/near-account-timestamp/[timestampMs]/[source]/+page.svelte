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
	import NearAccount_TimestampView from '$/views/NearAccount_TimestampView.svelte'
</script>


<Page>
	<NearAccount_TimestampView
		selection={select(EntityType.NearAccount_Timestamp, data.selector)}
	/>
</Page>
