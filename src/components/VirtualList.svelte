<script
	lang="ts"
	generics="_Item"
>
	// Types/constants
	import { layout, prepare, type PreparedText } from '@chenglou/pretext'
	import { browser } from '$app/environment'
	import type { Snippet } from 'svelte'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		items,
		getKey,
		getMeasureText,
		font,
		lineHeight,
		rowInsetBlock = 0,
		itemGap = 0,
		overscan = 4,
		Item,
		...viewportProps
	}: WithRest<
		{
			items: readonly _Item[]
			getKey: (item: _Item, index: number) => string
			getMeasureText: (item: _Item, index: number) => string
			font: string
			lineHeight: number
			rowInsetBlock?: number
			itemGap?: number
			overscan?: number
			Item: Snippet<[
				{
					item: _Item
					index: number
				},
			]>
		},
		SvelteHTMLElements['div']
	> = $props()


	// State
	let viewportEl: HTMLDivElement | undefined = $state()
	let measureWidth = $state(0)
	let viewportHeight = $state(0)
	let scrollTop = $state(0)
	let rowHeights = $state<number[]>([])
	let offsets = $state<number[]>([
		0,
	])
	let totalHeight = $state(0)


	// Derived
	const visible = $derived.by(() => {
		const n = items.length
		const os = offsets
		if (
			n === 0
			|| os.length !== n + 1
		) return {
			start: 0,
			end: -1,
		}

		const st = scrollTop
		const vh = viewportHeight
		let lo = 0
		let hi = n - 1
		while (
			lo < hi
		) {
			const mid = (
				lo + hi
			) >> 1
			if (
				os[mid + 1] <= st
			) lo = mid + 1
			else hi = mid
		}

		let start = Math.max(
			0,
			lo - overscan,
		)
		const bottom = st + vh
		let end = lo
		while (
			end < n
			&& os[end] < bottom
		) end++

		end = Math.min(
			n - 1,
			end + overscan - 1,
		)
		if (
			end < start
		) end = start

		return {
			start,
			end,
		}
	})


	// Functions
	const preparedByKey = new Map<string, PreparedText>()

	const onScroll = () => {
		if (
			!viewportEl
		) return
		scrollTop = viewportEl.scrollTop
	}
</script>


{#if !browser}
	<div
		data-virtual-list="ssr"
		{...viewportProps}
	>
		{#each items as item, index (getKey(
			item,
			index,
		))}
			<div data-virtual-list-row>
				{@render Item({
					item,
					index,
				})}
			</div>
		{/each}
	</div>
{:else}
	<div
		bind:this={viewportEl}
		data-scroll-container
		data-virtual-list
		onscroll={onScroll}
		{...viewportProps}
	>
		{#if viewportEl}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				use:resizeViewport={(w, h) => {
					measureWidth = w
					viewportHeight = h
				}}
			></div>
		{/if}

		{@const _ = (
			void items,
			void font,
			void lineHeight,
			void rowInsetBlock,
			void itemGap,
			void getMeasureText,
			(() => {
				const w = Math.max(
					1,
					measureWidth,
				)
				const nextHeights: number[] = []
				const nextOffsets: number[] = [
					0,
				]
				let acc = 0
				for (
					let i = 0;
					i < items.length;
					i++
				) {
					const text = getMeasureText(
						items[i],
						i,
					)
					const ck = `${font}\0${text}`
					let p = preparedByKey.get(ck)
					if (
						!p
					) {
						p = prepare(
							text,
							font,
						)
						preparedByKey.set(
							ck,
							p,
						)
					}

					const block = layout(
						p,
						w,
						lineHeight,
					).height + rowInsetBlock
					const withGap = (
						block + (
							i < items.length - 1 ?
								itemGap
							:
								0
						)
					)
					nextHeights.push(withGap)
					acc += withGap
					nextOffsets.push(acc)
				}

				rowHeights = nextHeights
				offsets = nextOffsets
				totalHeight = acc
			})()
		)}
		<div
			class="virtual-list-sizer"
			style:height="{totalHeight}px"
		>
			{#each Array.from(
				{
					length: visible.end - visible.start + 1,
				},
				(_, k) => (
					visible.start + k
				),
			) as index (getKey(
				items[index],
				index,
			))}
				<div
					class="virtual-list-row"
					style:top="{offsets[index]}px"
					style:min-height="{rowHeights[index]}px"
				>
					{@render Item({
						item: items[index],
						index,
					})}
				</div>
			{/each}
		</div>
	</div>
{/if}


<script lang="ts">
	const resizeViewport = (
		_el: HTMLDivElement,
		setSize: (w: number, h: number) => void,
	) => {
		const parent = _el.parentElement
		if (
			!parent
		) return {
			destroy() {},
		}

		const ro = new ResizeObserver((entries) => {
			const cr = entries[0].contentRect
			setSize(
				cr.width,
				cr.height,
			)
		})
		ro.observe(parent)
		const r = parent.getBoundingClientRect()
		setSize(
			r.width,
			r.height,
		)

		return {
			destroy: () => (
				ro.disconnect()
			),
		}
	}
</script>


<style>
	[data-virtual-list] {
		position: relative;
		overflow: auto;
	}

	.virtual-list-sizer {
		position: relative;
		width: 100%;
		pointer-events: none;
	}

	.virtual-list-row {
		position: absolute;
		left: 0;
		right: 0;
		width: 100%;
		box-sizing: border-box;
		pointer-events: auto;
	}
</style>
