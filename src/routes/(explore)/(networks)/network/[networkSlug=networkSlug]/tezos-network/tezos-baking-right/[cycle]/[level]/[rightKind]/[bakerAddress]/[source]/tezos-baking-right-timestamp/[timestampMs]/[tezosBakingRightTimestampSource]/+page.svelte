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
	import TezosBakingRight_TimestampView from '$/views/TezosBakingRight_TimestampView.svelte'
</script>


<Page>
	<TezosBakingRight_TimestampView
		selection={select(EntityType.TezosBakingRight_Timestamp, data.selector)}
	/>
</Page>
