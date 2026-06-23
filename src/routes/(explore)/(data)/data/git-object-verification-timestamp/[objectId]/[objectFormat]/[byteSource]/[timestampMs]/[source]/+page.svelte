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
	import GitObjectVerification_TimestampView from '$/views/GitObjectVerification_TimestampView.svelte'
</script>


<Page>
	<GitObjectVerification_TimestampView
		selection={select(EntityType.GitObjectVerification_Timestamp, data.selector)}
	/>
</Page>
