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
	import TokenProgramExtension_TimestampView from '$/views/TokenProgramExtension_TimestampView.svelte'
</script>


<Page>
	<TokenProgramExtension_TimestampView
		selection={select(EntityType.TokenProgramExtension_Timestamp, data.selector)}
	/>
</Page>
