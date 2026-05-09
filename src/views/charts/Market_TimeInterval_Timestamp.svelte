<script lang="ts">
	// Types/constants
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Props
	let {
		title = 'OHLC',
		points = [],
		priceDecimals = 8,
		min = 0,
		max = 1,
		stepInlineSize = '0.875rem',
		height = '22rem',
	}: {
		title?: string
		points?: Entity<typeof schema, EntityType.Market_TimeInterval_Timestamp>[]
		priceDecimals?: number
		min?: number
		max?: number
		stepInlineSize?: string
		height?: string
	} = $props()
</script>


<section
	aria-label={title}
	class="market-candlestick-chart"
	data-card="padding-0"
	style:--chart-price-decimals={priceDecimals}
	style:--chart-price-min={min}
	style:--chart-price-max={max}
	style:--chart-step-inline-size={stepInlineSize}
	style:--chart-size-block={height}
>
	<header data-row>
		<h2>
			{title}
		</h2>

		<p data-text="muted">
			Scroll to pan. Pinch or browser zoom to inspect.
		</p>
	</header>

	<div
		class="chart-viewport"
		data-scroll-container="inline snap-inline"
		data-sticky-container
		role="img"
		aria-label={`${title} candlestick chart`}
	>
		<div
			class="chart-canvas"
			data-scroll-item="inline-attached overflow-end"
		>
			{#each points as point (point[EntityMetaKey.IdKey])}
				{@const open = Number(point.open ?? 0n) / (10 ** priceDecimals)}
				{@const high = Number(point.high ?? 0n) / (10 ** priceDecimals)}
				{@const low = Number(point.low ?? 0n) / (10 ** priceDecimals)}
				{@const close = Number(point.close ?? 0n) / (10 ** priceDecimals)}
				{@const timestampMs = Number(point[EntityMetaKey.Id].timestampNs / 1_000_000n)}

				<article
					aria-label={`${new Date(timestampMs).toLocaleDateString()}: open ${open}, high ${high}, low ${low}, close ${close}`}
					class="candle"
					data-scroll-item="snap-inline-end"
					data-trend={close >= open ? 'up' : 'down'}
					style:--candle-open={open}
					style:--candle-high={high}
					style:--candle-low={low}
					style:--candle-close={close}
					style:--candle-timestamp={timestampMs}
				>
					<span class="candle-wick"></span>
					<span class="candle-body"></span>
				</article>
			{/each}
		</div>
	</div>
</section>


<style>
	@property --chart-scroll-zoom {
		syntax: '<number>';
		inherits: true;
		initial-value: 0;
	}

	.market-candlestick-chart {
		--chart-range: max(1, calc(var(--chart-price-max) - var(--chart-price-min)));
		--chart-grid-color: color-mix(in oklch, var(--color-fg) 8%, transparent);
		--chart-axis-color: color-mix(in oklch, var(--color-fg) 18%, transparent);
		--chart-candle-inline-size: clamp(0.25rem, calc(var(--chart-step-inline-size) * 0.54), 0.8rem);
		--chart-scroll-zoom: 0;
		--chart-zoom: calc(1 + var(--chart-scroll-zoom) * 0.5);
		--chart-up-color: oklch(0.68 0.15 150);
		--chart-down-color: oklch(0.62 0.18 25);

		overflow: clip;
	}

	header {
		padding: var(--card-padding);
		padding-block-end: 0;

		h2,
		p {
			margin: 0;
		}
	}

	.chart-viewport {
		scroll-timeline: --chart-pan inline;
		timeline-scope: --chart-pan;

		block-size: var(--chart-size-block);
		max-inline-size: 100%;
		padding: var(--card-padding);
		resize: horizontal;
		scrollbar-gutter: stable both-edges;
	}

	.chart-canvas {
		animation: ChartScrollZoom linear both;
		animation-timeline: --chart-pan;
		animation-range: 0% 100%;

		position: relative;
		isolation: isolate;

		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: calc(var(--chart-step-inline-size) * var(--chart-zoom));
		align-items: stretch;

		min-block-size: 100%;
		padding-block: 0.75rem 1.5rem;
		padding-inline: calc(var(--chart-step-inline-size) * 2);

		background:
			linear-gradient(to right, var(--chart-grid-color) 1px, transparent 1px) 0 0 / calc(var(--chart-step-inline-size) * var(--chart-zoom) * 4) 100%,
			linear-gradient(to bottom, var(--chart-grid-color) 1px, transparent 1px) 0 0 / 100% 20%,
			linear-gradient(to bottom, transparent, transparent calc(100% - 1px), var(--chart-axis-color) calc(100% - 1px));
		border: 1px solid var(--color-border);
		border-radius: calc(var(--card-radius) * 0.75);
	}

	.candle {
		--candle-color: var(--chart-up-color);
		--candle-open-y: clamp(0%, calc((var(--chart-price-max) - var(--candle-open)) / var(--chart-range) * 100%), 100%);
		--candle-high-y: clamp(0%, calc((var(--chart-price-max) - var(--candle-high)) / var(--chart-range) * 100%), 100%);
		--candle-low-y: clamp(0%, calc((var(--chart-price-max) - var(--candle-low)) / var(--chart-range) * 100%), 100%);
		--candle-close-y: clamp(0%, calc((var(--chart-price-max) - var(--candle-close)) / var(--chart-range) * 100%), 100%);
		--candle-body-start: min(var(--candle-open-y), var(--candle-close-y));
		--candle-body-end: max(var(--candle-open-y), var(--candle-close-y));

		position: relative;
		min-inline-size: 0;
		block-size: 100%;
		scroll-margin-inline: calc(var(--chart-step-inline-size) * 2);
	}

	.candle[data-trend='down'] {
		--candle-color: var(--chart-down-color);
	}

	.candle-wick,
	.candle-body {
		position: absolute;
		inset-inline: 50% auto;
		translate: -50% 0;
		background: var(--candle-color);
	}

	.candle-wick {
		inset-block-start: var(--candle-high-y);
		block-size: max(1px, calc(var(--candle-low-y) - var(--candle-high-y)));
		inline-size: 1px;
		opacity: 0.8;
	}

	.candle-body {
		inset-block-start: var(--candle-body-start);
		block-size: max(2px, calc(var(--candle-body-end) - var(--candle-body-start)));
		inline-size: var(--chart-candle-inline-size);
		border-radius: 999px;
		box-shadow: 0 0 0 1px color-mix(in oklch, var(--candle-color) 70%, var(--color-bg));
	}

	@keyframes ChartScrollZoom {
		from {
			--chart-scroll-zoom: 0;
		}

		to {
			--chart-scroll-zoom: 1;
		}
	}
</style>
