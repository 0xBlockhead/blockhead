<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import VirtualList from '$/components/VirtualList.svelte'


	type Row = {
		id: string
		text: string
	}

	const items: Row[] = Array.from(
		{
			length: 400,
		},
		(_, index) => ({
			id: String(index),
			text: `Row ${index}: ${'Lorem ipsum dolor sit amet. '.repeat(2 + (index % 5))}`,
		})
	)


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Virtual list • Blockhead</title>
</svelte:head>


<Page>
	<section
		class='virtual-list-demo'
		data-card
	>
		<h2>
			VirtualList + Pretext
		</h2>

		<p data-text='annotation'>
			<code>@chenglou/pretext</code>
			<code>prepare</code>
			/
			<code>layout</code>
			for row heights; official variable-height demos:
			<a href='https://chenglou.me/pretext/'>chenglou.me/pretext</a>
		</p>

		<VirtualList
			class='virtual-list-demo-viewport'
			{items}
			font='16px Ubuntu, system-ui, sans-serif'
			getKey={(row) => row.id}
			getMeasureText={(row) => row.text}
			lineHeight={22}
			itemGap={8}
			rowInsetBlock={4}
		>
			{#snippet Item({
				item,
				index,
			})}
				<p class='virtual-list-demo-line'>
					<span data-text='annotation'>
						{String(index)}
					</span>
					{item.text}
				</p>
			{/snippet}
		</VirtualList>
	</section>
</Page>


<style>
	.virtual-list-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 0;
	}

	:global(.virtual-list-demo-viewport) {
		flex: 1;
		min-height: 50vh;
		max-height: 70vh;
		border: 1px solid color-mix(in oklab, CanvasText 12%, transparent);
	}

	.virtual-list-demo-line {
		margin: 0;
		font: 16px/22px Ubuntu, system-ui, sans-serif;
		overflow: hidden;
	}
</style>
