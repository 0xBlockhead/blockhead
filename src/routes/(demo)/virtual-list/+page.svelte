<script lang="ts">
	// Types/constants
	type Row = {
		id: string
		text: string
	}


	// Components
	import VirtualList from '$/components/VirtualList.svelte'
</script>


<section
	class="virtual-list-demo"
	data-card
>
	<h2>
		VirtualList + Pretext
	</h2>

	<p data-text="annotation">
		<code>@chenglou/pretext</code>
		<code>prepare</code>
		/
		<code>layout</code>
		for row heights; official variable-height demos:
		<a href="https://chenglou.me/pretext/">chenglou.me/pretext</a>
	</p>

	<VirtualList
		class="virtual-list-demo-viewport"
		items={Array.from(
			{
				length: 400,
			},
			(_, i) => (
				{
					id: String(i),
					text: `Row ${i}: ${'Lorem ipsum dolor sit amet. '.repeat(2 + (i % 5))}`,
				} satisfies Row
			),
		)}
		font="16px Ubuntu, system-ui, sans-serif"
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
			<p class="virtual-list-demo-line">
				<span data-text="annotation">
					{String(index)}
				</span>
				{item.text}
			</p>
		{/snippet}
	</VirtualList>
</section>


<style>
	.virtual-list-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 0;
	}

	.virtual-list-demo-viewport {
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
