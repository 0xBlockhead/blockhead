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
	import UsageRight_TimestampView from '$/views/UsageRight_TimestampView.svelte'
</script>


<Page>
	<UsageRight_TimestampView
		selection={select(EntityType.UsageRight_Timestamp, data.selector)}
	/>
</Page>
