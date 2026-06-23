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
	import EnsName_TimestampView from '$/views/EnsName_TimestampView.svelte'
</script>


<Page>
	<EnsName_TimestampView
		selection={select(EntityType.EnsName_Timestamp, data.selector)}
	/>
</Page>
