<script lang="ts">
	// Props
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import ActorView from '$/views/ActorView.svelte'
</script>


<Page>
	<ActorView
		entityId={{
			address: params.accountId as `0x${string}`,
		}}
	/>
</Page>
