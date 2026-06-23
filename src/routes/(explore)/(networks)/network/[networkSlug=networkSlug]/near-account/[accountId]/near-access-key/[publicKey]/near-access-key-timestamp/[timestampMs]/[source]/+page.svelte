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
	import NearAccessKey_TimestampView from '$/views/NearAccessKey_TimestampView.svelte'
</script>


<Page>
	<NearAccessKey_TimestampView
		selection={select(EntityType.NearAccessKey_Timestamp, data.selector)}
	/>
</Page>
