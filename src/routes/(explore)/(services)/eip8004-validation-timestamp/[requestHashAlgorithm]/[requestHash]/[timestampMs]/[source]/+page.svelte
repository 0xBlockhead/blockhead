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
	import Eip8004Validation_TimestampView from '$/views/Eip8004Validation_TimestampView.svelte'
</script>


<Page>
	<Eip8004Validation_TimestampView
		selection={select(EntityType.Eip8004Validation_Timestamp, data.selector)}
	/>
</Page>
