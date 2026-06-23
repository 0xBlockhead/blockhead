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
	import NearValidator_TimestampView from '$/views/NearValidator_TimestampView.svelte'
</script>


<Page>
	<NearValidator_TimestampView
		selection={select(EntityType.NearValidator_Timestamp, data.selector)}
	/>
</Page>
